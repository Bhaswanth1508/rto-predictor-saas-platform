export const MOCK_SUBSCRIPTION_PLANS = [
  { id: 'p1', name: 'Starter', price: 49, limit: 500 },
  { id: 'p2', name: 'Growth', price: 149, limit: 2500 },
  { id: 'p3', name: 'Enterprise', price: 499, limit: Infinity },
];
export const MOCK_USERS = [
  { id: 'u1', email: 'owner@brand.com', role: 'brand_owner', brandId: 'b1' },
  { id: 'u2', email: 'admin@rtopredictor.com', role: 'admin', brandId: 'internal' },
];
export const MOCK_BRANDS = [
  { id: 'b1', name: 'EcoThreads', planId: 'p2', status: 'active', createdAt: '2023-10-01' },
  { id: 'b2', name: 'UrbanFit', planId: 'p1', status: 'active', createdAt: '2023-12-15' },
];
export const MOCK_CUSTOMERS = [
  { id: 'c1', name: 'John Doe', email: 'john@example.com', rtoCount: 0, orderCount: 5, trustScore: 98 },
  { id: 'c2', name: 'Alice Smith', email: 'alice@badbuyer.com', rtoCount: 3, orderCount: 4, trustScore: 25 },
];
export const MOCK_ORDERS = [
  { id: 'o1', orderNumber: 'ORD-5521', amount: 2450, customerId: 'c1', status: 'pending', rtoRisk: 'low', recommendation: 'Ship Normally' },
  { id: 'o2', orderNumber: 'ORD-5522', amount: 1200, customerId: 'c2', status: 'pending', rtoRisk: 'high', recommendation: 'Call for confirmation' },
];
export const MOCK_PINCODES = [
  { pincode: '110001', city: 'Delhi', state: 'Delhi', rtoRate: 8.5 },
  { pincode: '400001', city: 'Mumbai', state: 'Maharashtra', rtoRate: 12.1 },
  { pincode: '560001', city: 'Bangalore', state: 'Karnataka', rtoRate: 6.2 },
  { pincode: '800001', city: 'Patna', state: 'Bihar', rtoRate: 24.8 },
];
export const MOCK_REPORTS = [
  { id: 'r1', type: 'Monthly Analysis', date: '2024-03-01', format: 'PDF' },
  { id: 'r2', type: 'Pincode Risk Map', date: '2024-03-15', format: 'CSV' },
];