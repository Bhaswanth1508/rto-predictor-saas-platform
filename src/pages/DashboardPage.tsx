import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ShoppingBag, AlertTriangle, CheckCircle2, ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
export function DashboardPage() {
  const stats = [
    { label: 'Total Orders', value: '1,284', icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'RTO Percentage', value: '14.2%', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-100' },
    { label: 'High Risk Orders', value: '86', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100' },
    { label: 'Recovered Revenue', value: '$12,450', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100' },
  ];
  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground">Welcome back! Here's how your brand is performing today.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Download Report</Button>
          <Button className="btn-primary">Connect Integration</Button>
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
            <Card className="border-none shadow-soft">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg ${stat.bg}`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <span className="text-xs font-medium text-green-600">+12% vs last mo</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-soft min-h-[300px] flex items-center justify-center text-muted-foreground bg-secondary/20">
          <p>Analytics Chart Placeholder (Phase 3)</p>
        </Card>
        <Card className="border-none shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">Recent Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0">
                <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">High RTO Risk: Order #8241</p>
                  <p className="text-xs text-muted-foreground">Detected abnormal return history from this address.</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            ))}
            <Button variant="ghost" className="w-full text-sm text-primary-brand">View All Orders</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}