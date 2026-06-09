import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, AlertCircle, TrendingDown, Info } from 'lucide-react';
import { motion } from 'framer-motion';
export function PincodeIntelPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading } = useQuery({
    queryKey: ['pincode-stats'],
    queryFn: () => api<any>('/api/pincodes/stats')
  });
  const pincodes = data?.pincodes || [];
  const topStates = data?.topStates || [];
  const filteredPincodes = pincodes.filter((p: any) => 
    p.code.includes(searchTerm) || 
    p.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.state.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const getRtoColor = (rate: number) => {
    if (rate > 20) return "text-red-600 bg-red-100";
    if (rate > 10) return "text-orange-600 bg-orange-100";
    return "text-green-600 bg-green-100";
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12 space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pincode Intelligence</h1>
          <p className="text-muted-foreground">Geographic risk profiling based on delivery history.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {topStates.map((state: any, i: number) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="border-none shadow-soft">
              <CardHeader className="p-4 pb-2">
                <CardDescription className="text-xs uppercase font-bold tracking-wider">{state.name}</CardDescription>
                <CardTitle className="text-2xl">{state.rate}%</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <Badge variant="outline" className={getRtoColor(Number(state.rate))}>
                  Avg RTO Rate
                </Badge>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Zone Analysis</CardTitle>
              <CardDescription>Searchable intelligence for 10,000+ delivery zones</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search pincode, city..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pincode</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>RTO Rate</TableHead>
                    <TableHead className="text-right">Risk Factor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    [...Array(5)].map((_, i) => (
                      <TableRow key={i} className="animate-pulse h-12 bg-muted/20" />
                    ))
                  ) : filteredPincodes.map((p: any) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-mono font-bold">{p.code}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{p.city}</span>
                          <span className="text-2xs text-muted-foreground">{p.state}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${getRtoColor(p.rtoRate)}`}>
                          {p.rtoRate}%
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                         <div className="flex justify-end">
                           <div className={`h-3 w-3 rounded-full ${p.rtoRate > 20 ? 'bg-red-500' : p.rtoRate > 10 ? 'bg-orange-500' : 'bg-green-500'}`} />
                         </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        <div className="space-y-6">
          <Card className="border-none shadow-soft bg-primary-brand text-white">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5" /> Geographic Heatmap
              </CardTitle>
              <CardDescription className="text-white/70">
                Mock visualization of nationwide return trends.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-square bg-white/10 rounded-lg flex items-center justify-center border border-white/20">
                 {/* Visual Mockup for Map */}
                 <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                    <svg viewBox="0 0 100 100" className="w-3/4 opacity-40">
                      <path d="M10,30 Q50,0 90,30 L90,70 Q50,100 10,70 Z" fill="currentColor" />
                    </svg>
                    <div className="absolute top-1/4 left-1/4 h-8 w-8 bg-red-500 rounded-full blur-xl opacity-60 animate-pulse" />
                    <div className="absolute bottom-1/3 right-1/3 h-12 w-12 bg-orange-400 rounded-full blur-xl opacity-40 animate-pulse" />
                    <div className="absolute top-1/2 right-1/4 h-6 w-6 bg-green-400 rounded-full blur-lg opacity-30" />
                    <p className="absolute bottom-4 text-xs font-bold bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm">Interactive Map: Coming Phase 4</p>
                 </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-soft">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Info className="h-5 w-5 text-primary-brand" /> Analysis Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-4 text-muted-foreground">
              <div className="flex gap-3">
                <AlertCircle className="h-4 w-4 shrink-0 text-orange-500" />
                <p><span className="font-bold text-foreground">Tier 3 Cities</span> are currently seeing a 15% spike in RTO due to festive logistics delays.</p>
              </div>
              <div className="flex gap-3">
                <TrendingDown className="h-4 w-4 shrink-0 text-green-500" />
                <p><span className="font-bold text-foreground">Address Accuracy</span> is the #1 reason for success in high-risk zones. Enable GPS pinning at checkout.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}