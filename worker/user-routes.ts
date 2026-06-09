import { Hono } from "hono";
import type { Env } from './core-utils';
import { UserEntity, OrderEntity, CustomerEntity, PincodeEntity } from "./entities";
import { ok, bad } from './core-utils';
import { calculateRtoRisk } from './risk-engine';
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // Orders
  app.get('/api/orders', async (c) => {
    const cq = c.req.query('cursor');
    const lq = c.req.query('limit');
    const brandId = c.req.query('brandId');
    let { items, next } = await OrderEntity.list(c.env, cq ?? null, lq ? Number(lq) : 50);
    if (brandId) {
      items = items.filter(o => o.brandId === brandId);
    }
    return ok(c, { items, next });
  });
  app.post('/api/orders', async (c) => {
    const data = await c.req.json();
    if (!data.orderNumber || !data.brandId || !data.pincode || !data.customerId) {
      return bad(c, 'Missing required fields: orderNumber, brandId, pincode, customerId');
    }
    // 1. Fetch Related Entities for Analysis
    const customerInst = new CustomerEntity(c.env, data.customerId);
    const customer = await customerInst.getState();
    const pincodeInst = new PincodeEntity(c.env, data.pincode);
    let pincode = await pincodeInst.getState();
    // Fallback if pincode not in our seed intelligence
    if (!pincode.code) {
      pincode = { id: data.pincode, code: data.pincode, city: 'Unknown', state: 'Unknown', rtoRate: 15.0 };
    }
    // 2. Run Risk Engine
    const { risk, recommendation } = calculateRtoRisk(
      data.amount,
      customer.trustScore ?? 50,
      pincode.rtoRate
    );
    // 3. Create Order
    const order = await OrderEntity.create(c.env, {
      ...data,
      id: crypto.randomUUID(),
      rtoRisk: risk,
      recommendation,
      createdAt: new Date().toISOString()
    });
    return ok(c, order);
  });
  // Dashboard Stats
  app.get('/api/dashboard/stats', async (c) => {
    const { items: orders } = await OrderEntity.list(c.env, null, 1000);
    const totalOrders = orders.length;
    const highRiskOrders = orders.filter(o => o.rtoRisk === 'high').length;
    const rtoOrders = orders.filter(o => o.status === 'rto').length;
    const totalRevenue = orders.reduce((sum, o) => sum + o.amount, 0);
    const rtoPercentage = totalOrders > 0 ? (rtoOrders / totalOrders) * 100 : 0;
    // Mock 7-day trend
    const trend = Array.from({ length: 7 }).map((_, i) => ({
      date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
      orders: Math.floor(Math.random() * 50) + 20,
      rtos: Math.floor(Math.random() * 10)
    }));
    return ok(c, {
      summary: {
        totalOrders,
        rtoPercentage: rtoPercentage.toFixed(1) + '%',
        highRiskCount: highRiskOrders,
        totalRevenue: '₹' + totalRevenue.toLocaleString()
      },
      trend,
      riskDistribution: [
        { name: 'Low Risk', value: orders.filter(o => o.rtoRisk === 'low').length, color: '#10b981' },
        { name: 'Medium Risk', value: orders.filter(o => o.rtoRisk === 'medium').length, color: '#f59e0b' },
        { name: 'High Risk', value: highRiskOrders, color: '#ef4444' }
      ]
    });
  });
  // Pincode Intelligence
  app.get('/api/pincodes/stats', async (c) => {
    await PincodeEntity.ensureSeed(c.env);
    const { items: pincodes } = await PincodeEntity.list(c.env, null, 100);
    // Group by state for geographic stats
    const stateStats = pincodes.reduce((acc: any, p) => {
      if (!acc[p.state]) acc[p.state] = { name: p.state, count: 0, avgRate: 0 };
      acc[p.state].count++;
      acc[p.state].avgRate += p.rtoRate;
      return acc;
    }, {});
    const topStates = Object.values(stateStats).map((s: any) => ({
      name: s.name,
      rate: (s.avgRate / s.count).toFixed(1)
    })).sort((a: any, b: any) => b.rate - a.rate).slice(0, 5);
    return ok(c, { pincodes, topStates });
  });
  // Customers
  app.get('/api/customers', async (c) => {
    const cq = c.req.query('cursor');
    const lq = c.req.query('limit');
    const brandId = c.req.query('brandId');
    let { items, next } = await CustomerEntity.list(c.env, cq ?? null, lq ? Number(lq) : 50);
    if (brandId) {
      items = items.filter(cus => cus.brandId === brandId);
    }
    return ok(c, { items, next });
  });
  // General User Mgmt
  app.get('/api/users', async (c) => {
    await UserEntity.ensureSeed(c.env);
    const page = await UserEntity.list(c.env, c.req.query('cursor') ?? null);
    return ok(c, page);
  });
}