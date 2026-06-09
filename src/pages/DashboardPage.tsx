import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ShoppingBag, AlertTriangle, CheckCircle2, ChevronRight, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { Link } from 'react-router-dom';
export function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => api<any>('/api/dashboard/stats'),
    refetchInterval: 30000
  });
  const { data: orderData } = useQuery({
    queryKey: ['orders-recent'],
    queryFn: () => api<{ items: any[] }>('/api/orders?limit=5')
  });
  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-brand" />
      </div>
    );
  }
  const stats = [
    { label: 'Total Orders', value: data?.summary?.totalOrders || '0', icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'RTO Percentage', value: data?.summary?.rtoPercentage || '0%', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-100' },
    { label: 'High Risk Orders', value: data?.summary?.highRiskCount || '0', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100' },
    { label: 'Total Revenue', value: data?.summary?.totalRevenue || '₹0', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100' },
  ];
  const recentHighRisk = orderData?.items?.filter(o => o.rtoRisk === 'high') || [];
  return (
    <div className="space-y-8 animate-fade-in">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground">Real-time risk metrics for your D2C brand.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Export CSV</Button>
          <Button className="btn-primary" asChild>
            <Link to="/orders">Manage Orders</Link>
          </Button>
        </div>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="border-none shadow-soft overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg ${stat.bg}`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <h3 className="text-2xl font-bold mt-1 tracking-tight">{stat.value}</h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-soft">
          <CardHeader>
            <CardTitle>RTO Trends (Last 7 Days)</CardTitle>
            <CardDescription>Daily RTOs vs Total Orders</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.trend}>
                <defs>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1A4080" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#1A4080" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="orders" stroke="#1A4080" fillOpacity={1} fill="url(#colorOrders)" strokeWidth={2} />
                <Area type="monotone" dataKey="rtos" stroke="#FF6B35" fill="transparent" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="border-none shadow-soft">
          <CardHeader>
            <CardTitle>Risk Distribution</CardTitle>
            <CardDescription>Volume by Risk Segment</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] flex flex-col justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.riskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data?.riskDistribution?.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-none shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">Recent High-Risk Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentHighRisk.length > 0 ? (
              recentHighRisk.map((order, i) => (
                <div key={order.id} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
                  <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-semibold">Order {order.orderNumber}</p>
                      <span className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{order.recommendation}</p>
                  </div>
                  <Button variant="ghost" size="icon" asChild>
                    <Link to="/orders"><ChevronRight className="h-4 w-4" /></Link>
                  </Button>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-green-500 opacity-50" />
                <p>No high risk orders detected today!</p>
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="border-none shadow-soft bg-primary-brand/5">
          <CardHeader>
            <CardTitle className="text-lg">Suggested Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="p-4 rounded-lg bg-white border border-primary-brand/20 shadow-sm">
                <p className="text-sm font-medium">Verify Bulk Orders</p>
                <p className="text-xs text-muted-foreground mt-1">3 orders from "Patna" (High Risk Area) are over ₹5000. Recommend WhatsApp confirmation.</p>
             </div>
             <div className="p-4 rounded-lg bg-white border border-primary-brand/20 shadow-sm">
                <p className="text-sm font-medium">Address Correction Needed</p>
                <p className="text-xs text-muted-foreground mt-1">2 customers have flagged addresses with incorrect house numbers.</p>
             </div>
             <Button variant="outline" className="w-full" asChild>
                <Link to="/reports">Generate Detailed Insight Report</Link>
             </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}