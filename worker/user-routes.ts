import { Hono } from "hono";
import type { Env } from './core-utils';
import { UserEntity, OrderEntity, CustomerEntity, PincodeEntity, BrandEntity } from "./entities";
import { ok, bad, notFound } from './core-utils';
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
    const customerInst = new CustomerEntity(c.env, data.customerId);
    const customer = await customerInst.getState();
    const pincodeInst = new PincodeEntity(c.env, data.pincode);
    let pincode = await pincodeInst.getState();
    if (!pincode.code) {
      pincode = { id: data.pincode, code: data.pincode, city: 'Unknown', state: 'Unknown', rtoRate: 15.0 };
    }
    const { risk, recommendation } = calculateRtoRisk(data.amount, customer.trustScore ?? 50, pincode.rtoRate);
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
    const trend = Array.from({ length: 7 }).map((_, i) => ({
      date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
      orders: Math.floor(Math.random() * 50) + 20,
      rtos: Math.floor(Math.random() * 10)
    }));
    return ok(c, {
      summary: { totalOrders, rtoPercentage: rtoPercentage.toFixed(1) + '%', highRiskCount: highRiskOrders, totalRevenue: '₹' + totalRevenue.toLocaleString() },
      trend,
      riskDistribution: [
        { name: 'Low Risk', value: orders.filter(o => o.rtoRisk === 'low').length, color: '#10b981' },
        { name: 'Medium Risk', value: orders.filter(o => o.rtoRisk === 'medium').length, color: '#f59e0b' },
        { name: 'High Risk', value: highRiskOrders, color: '#ef4444' }
      ]
    });
  });
  // Admin Routes
  app.get('/api/admin/stats', async (c) => {
    const { items: brands } = await BrandEntity.list(c.env, null, 1000);
    const { items: orders } = await OrderEntity.list(c.env, null, 5000);
    const { items: users } = await UserEntity.list(c.env, null, 1000);
    const totalRevenue = orders.reduce((sum, o) => sum + o.amount, 0);
    return ok(c, {
      globalRevenue: '₹' + totalRevenue.toLocaleString(),
      totalBrands: brands.length,
      activeUsers: users.length,
      systemHealth: '99.9%',
      brandsByPlan: {
        starter: brands.filter(b => b.planId === 'starter').length,
        growth: brands.filter(b => b.planId === 'growth').length,
        enterprise: brands.filter(b => b.planId === 'enterprise').length,
      }
    });
  });
  app.get('/api/admin/brands', async (c) => {
    const brands = await BrandEntity.list(c.env, null, 100);
    return ok(c, brands);
  });
  app.post('/api/admin/brands/:id/status', async (c) => {
    const id = c.req.param('id');
    const { status } = await c.req.json();
    if (status !== 'active' && status !== 'suspended') return bad(c, 'Invalid status');
    const brand = new BrandEntity(c.env, id);
    if (!(await brand.exists())) return notFound(c, 'Brand not found');
    await brand.patch({ status });
    return ok(c, { id, status });
  });
  // Reports Routes
  app.get('/api/reports/history', async (c) => {
    // Mock history retrieval
    const history = [
      { id: 'rep_1', type: 'Daily RTO Analysis', date: '2024-05-20', status: 'completed', format: 'PDF' },
      { id: 'rep_2', type: 'Pincode Risk Map', date: '2024-05-19', status: 'completed', format: 'CSV' },
      { id: 'rep_3', type: 'Customer Trust Audit', date: '2024-05-18', status: 'completed', format: 'PDF' },
    ];
    return ok(c, history);
  });
  // Customers & Pincodes
  app.get('/api/customers', async (c) => {
    const { items, next } = await CustomerEntity.list(c.env, c.req.query('cursor') ?? null, 50);
    return ok(c, { items, next });
  });
  app.get('/api/pincodes/stats', async (c) => {
    await PincodeEntity.ensureSeed(c.env);
    const { items: pincodes } = await PincodeEntity.list(c.env, null, 100);
    const stateStats = pincodes.reduce((acc: any, p) => {
      if (!acc[p.state]) acc[p.state] = { name: p.state, count: 0, avgRate: 0 };
      acc[p.state].count++;
      acc[p.state].avgRate += p.rtoRate;
      return acc;
    }, {});
    const topStates = Object.values(stateStats).map((s: any) => ({
      name: s.name,
      rate: (s.avgRate / s.count).toFixed(1)
    })).sort((a: any, b: any) => Number(b.rate) - Number(a.rate)).slice(0, 5);
    return ok(c, { pincodes, topStates });
  });
  app.get('/api/users', async (c) => {
    await UserEntity.ensureSeed(c.env);
    const page = await UserEntity.list(c.env, c.req.query('cursor') ?? null);
    return ok(c, page);
  });
}