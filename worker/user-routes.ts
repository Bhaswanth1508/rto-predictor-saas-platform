import { Hono } from "hono";
import type { Env } from './core-utils';
import { UserEntity, OrderEntity, CustomerEntity, PincodeEntity } from "./entities";
import { ok, bad, isStr } from './core-utils';
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
    if (!data.orderNumber || !data.brandId) return bad(c, 'Missing required fields');
    const order = await OrderEntity.create(c.env, {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    });
    return ok(c, order);
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
  // Pincode Intel (Seed on first access)
  app.get('/api/pincodes', async (c) => {
    await PincodeEntity.ensureSeed(c.env);
    const { items } = await PincodeEntity.list(c.env, null, 100);
    return ok(c, items);
  });
  // General User Mgmt
  app.get('/api/users', async (c) => {
    await UserEntity.ensureSeed(c.env);
    const page = await UserEntity.list(c.env, c.req.query('cursor') ?? null);
    return ok(c, page);
  });
}