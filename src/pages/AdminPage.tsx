import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  ShieldCheck, 
  Users, 
  Building2, 
  DollarSign, 
  Activity, 
  CheckCircle2, 
  AlertCircle,
  MoreVertical,
  PauseCircle,
  PlayCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
export function AdminPage() {
  const queryClient = useQueryClient();
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => api<any>('/api/admin/stats')
  });
  const { data: brands, isLoading: brandsLoading } = useQuery({
    queryKey: ['admin-brands'],
    queryFn: () => api<any[]>('/api/admin/brands')
  });
  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: string }) => 
      api(`/api/admin/brands/${id}/status`, { method: 'POST', body: JSON.stringify({ status }) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-brands'] });
      toast.success('Brand status updated');
    }
  });
  const toggleStatus = (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    mutation.mutate({ id, status: nextStatus });
  };
  const statCards = [
    { title: "Global Revenue", value: stats?.globalRevenue || "...", icon: DollarSign, color: "text-purple-600", bg: "bg-purple-50" },
    { title: "Total Brands", value: stats?.totalBrands || "...", icon: Building2, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Active Users", value: stats?.activeUsers || "...", icon: Users, color: "text-green-600", bg: "bg-green-50" },
    { title: "System Health", value: stats?.systemHealth || "...", icon: Activity, color: "text-emerald-600", bg: "bg-emerald-50" },
  ];
  return (
    <div className="space-y-8 animate-fade-in">
      <header className="flex items-center justify-between p-6 bg-gradient-to-r from-purple-900 to-indigo-900 rounded-2xl text-white shadow-lg overflow-hidden relative">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ShieldCheck className="h-8 w-8" /> Admin Governance
          </h1>
          <p className="text-purple-100/70 mt-1">Platform-wide oversight and merchant management.</p>
        </div>
        <div className="absolute right-[-10%] top-[-20%] h-64 w-64 bg-white/10 rounded-full blur-3xl" />
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="border-none shadow-soft">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg ${s.bg}`}>
                    <s.icon className={`h-5 w-5 ${s.color}`} />
                  </div>
                </div>
                <p className="text-sm font-medium text-muted-foreground">{s.title}</p>
                <h3 className="text-2xl font-bold mt-1 tracking-tight">{s.value}</h3>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      <Card className="border-none shadow-soft">
        <CardHeader>
          <CardTitle>Merchant Management</CardTitle>
          <CardDescription>Monitoring and controlling all registered D2C brands.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Brand Name</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {brandsLoading ? (
                <TableRow><TableCell colSpan={5} className="text-center py-12">Loading brands...</TableCell></TableRow>
              ) : brands?.map((brand) => (
                <TableRow key={brand.id}>
                  <TableCell className="font-semibold">{brand.name}</TableCell>
                  <TableCell className="capitalize">{brand.planId}</TableCell>
                  <TableCell>
                    {brand.status === 'active' ? (
                      <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">Active</Badge>
                    ) : (
                      <Badge variant="destructive">Suspended</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{brand.createdAt ? new Date(brand.createdAt).toLocaleDateString() : 'N/A'}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => toast.info('Managing ' + brand.name)}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => toggleStatus(brand.id, brand.status)}
                          className={brand.status === 'active' ? 'text-red-600' : 'text-green-600'}
                        >
                          {brand.status === 'active' ? (
                            <><PauseCircle className="mr-2 h-4 w-4" /> Suspend Brand</>
                          ) : (
                            <><PlayCircle className="mr-2 h-4 w-4" /> Activate Brand</>
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border-none shadow-soft bg-slate-900 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-400" /> Platform Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-300">
            <p>Admin session active for user <span className="font-mono text-white">internal_admin_01</span>.</p>
            <p>All administrative actions are logged in the immutable system audit trail.</p>
            <Button variant="outline" className="w-full border-slate-700 hover:bg-slate-800 text-white">View Audit Logs</Button>
          </CardContent>
        </Card>
        <Card className="border-none shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-600">
              <AlertCircle className="h-5 w-5" /> Maintenance Mode
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Toggle maintenance mode to prevent new signups and order processing during updates.</p>
            <Button variant="outline" className="w-full text-orange-600 border-orange-200 hover:bg-orange-50">Enable System Lock</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}