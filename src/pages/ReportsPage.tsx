import React, { useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FileText, Download, History, Calendar, Loader2, CheckCircle2 } from 'lucide-react';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
export function ReportsPage() {
  const [reportType, setReportType] = useState('rto-analysis');
  const [isGenerating, setIsGenerating] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);
  const { data: history, isLoading: historyLoading } = useQuery({
    queryKey: ['report-history'],
    queryFn: () => api<any[]>('/api/reports/history')
  });
  const { data: orders } = useQuery({
    queryKey: ['orders-export'],
    queryFn: () => api<{ items: any[] }>('/api/orders?limit=100')
  });
  const generatePDF = async () => {
    if (!pdfRef.current) return;
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(pdfRef.current);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`RTO-Report-${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success('PDF generated successfully');
    } catch (err) {
      toast.error('Failed to generate PDF');
    } finally {
      setIsGenerating(false);
    }
  };
  const csvData = orders?.items?.map(o => ({
    Order: o.orderNumber,
    Amount: o.amount,
    Risk: o.rtoRisk,
    Recommendation: o.recommendation,
    Date: o.createdAt
  })) || [];
  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Reporting & Exports</h1>
        <p className="text-muted-foreground">Download comprehensive analytics and audit logs.</p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 border-none shadow-soft">
          <CardHeader>
            <CardTitle>Generate Report</CardTitle>
            <CardDescription>Configure parameters for your data export.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rto-analysis">RTO Analysis Summary</SelectItem>
                  <SelectItem value="pincode-risk">Geographic Risk Map</SelectItem>
                  <SelectItem value="customer-trust">Customer Trust Audit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <Calendar className="mr-2 h-4 w-4" /> Last 30 Days
              </Button>
            </div>
            <div className="pt-4 space-y-2">
              <Button onClick={generatePDF} className="w-full btn-primary" disabled={isGenerating}>
                {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                Export PDF
              </Button>
              <CSVLink data={csvData} filename="rto-orders.csv">
                <Button variant="outline" className="w-full">
                  <FileText className="mr-2 h-4 w-4" /> Export CSV
                </Button>
              </CSVLink>
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2 border-none shadow-soft overflow-hidden">
          <CardHeader>
            <CardTitle>Report Preview</CardTitle>
            <CardDescription>Interactive snapshot of the current selection.</CardDescription>
          </CardHeader>
          <CardContent>
            <div ref={pdfRef} className="p-6 bg-white rounded-lg border border-slate-100 shadow-sm text-slate-900">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-primary-brand">RTO Predictor</h2>
                  <p className="text-xs text-slate-500 uppercase tracking-widest">Enterprise Analytics</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{new Date().toLocaleDateString()}</p>
                  <p className="text-xs text-slate-400">Report ID: #XP-9921</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-slate-50 p-3 rounded border">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Total Orders</p>
                  <p className="text-lg font-bold">1,240</p>
                </div>
                <div className="bg-slate-50 p-3 rounded border">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Avg Risk</p>
                  <p className="text-lg font-bold text-orange-600">Medium</p>
                </div>
                <div className="bg-slate-50 p-3 rounded border">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Saving Est.</p>
                  <p className="text-lg font-bold text-green-600">₹45.2k</p>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-bold border-b pb-1">Risk Summary by Category</h3>
                <div className="flex justify-between text-xs py-1"><span>High Risk Orders</span><span className="font-bold">24</span></div>
                <div className="flex justify-between text-xs py-1"><span>Medium Risk Orders</span><span className="font-bold">156</span></div>
                <div className="flex justify-between text-xs py-1"><span>Low Risk Orders</span><span className="font-bold">1,060</span></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className="border-none shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary-brand" /> Generated History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Format</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {historyLoading ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8"><Loader2 className="animate-spin mx-auto h-6 w-6 text-slate-300" /></TableCell></TableRow>
              ) : history?.map((rep) => (
                <TableRow key={rep.id}>
                  <TableCell className="font-medium">{rep.type}</TableCell>
                  <TableCell>{rep.date}</TableCell>
                  <TableCell><Badge variant="outline">{rep.format}</Badge></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle2 className="h-4 w-4" /> <span className="text-xs font-medium">Ready</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">View</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}