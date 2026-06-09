import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Building2, Shield, Zap, Copy, ExternalLink } from "lucide-react";
import { getCurrentUser } from "@/services/auth";
import { toast } from "sonner";
export function SettingsPage() {
  const user = getCurrentUser();
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };
  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your brand profile, team, and integrations.</p>
      </header>
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full lg:w-[600px] bg-muted/50 p-1">
          <TabsTrigger value="profile" className="gap-2"><Building2 className="h-4 w-4" /> Profile</TabsTrigger>
          <TabsTrigger value="team" className="gap-2"><User className="h-4 w-4" /> Team</TabsTrigger>
          <TabsTrigger value="security" className="gap-2"><Shield className="h-4 w-4" /> Security</TabsTrigger>
          <TabsTrigger value="api" className="gap-2"><Zap className="h-4 w-4" /> API Keys</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="space-y-4">
          <Card className="border-none shadow-soft">
            <CardHeader>
              <CardTitle>Brand Profile</CardTitle>
              <CardDescription>Public and internal identification for your store.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand-name">Brand Name</Label>
                  <Input id="brand-name" defaultValue={user?.brandName || "My Brand"} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand-email">Contact Email</Label>
                  <Input id="brand-email" type="email" defaultValue={user?.email || ""} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Current Plan</Label>
                <div className="flex items-center gap-4 p-4 border rounded-lg bg-primary-brand/5 border-primary-brand/10">
                  <div className="h-10 w-10 rounded-full bg-primary-brand flex items-center justify-center text-white">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold capitalize">{user?.role === 'admin' ? 'Enterprise' : 'Growth Plan'}</p>
                    <p className="text-xs text-muted-foreground">Billing cycles on the 1st of every month.</p>
                  </div>
                  <Button variant="outline" size="sm">Manage Billing</Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="btn-primary">Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="team" className="space-y-4">
          <Card className="border-none shadow-soft">
            <CardHeader>
              <CardTitle>Team Management</CardTitle>
              <CardDescription>Invite and manage roles for your brand staff.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs">JD</div>
                    <div>
                      <p className="text-sm font-medium">Jane Doe (You)</p>
                      <p className="text-xs text-muted-foreground">Admin • jane@brand.com</p>
                    </div>
                  </div>
                  <Badge>Owner</Badge>
                </div>
                <Button variant="outline" className="w-full py-6 border-dashed">
                  + Invite Team Member
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="api" className="space-y-4">
          <Card className="border-none shadow-soft">
            <CardHeader>
              <CardTitle>API Configuration</CardTitle>
              <CardDescription>Connect external platforms to RTO Predictor.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="font-bold">Public Key</Label>
                    <Badge variant="outline" className="text-2xs">PROD</Badge>
                  </div>
                  <div className="flex gap-2">
                    <code className="flex-1 bg-slate-50 p-2 rounded border text-xs overflow-hidden truncate">
                      pk_live_51Mv9kSJ6z2pX4W...
                    </code>
                    <Button variant="ghost" size="icon" onClick={() => copyToClipboard('pk_live_51Mv9kSJ6z2pX4W')}><Copy className="h-4 w-4" /></Button>
                  </div>
                </div>
                <div className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="font-bold">Secret Key</Label>
                    <Badge variant="destructive" className="text-2xs">KEEP PRIVATE</Badge>
                  </div>
                  <div className="flex gap-2">
                    <code className="flex-1 bg-slate-50 p-2 rounded border text-xs overflow-hidden truncate">
                      ••••••••••••••••••••••••••••
                    </code>
                    <Button variant="ghost" size="icon" onClick={() => copyToClipboard('sk_live_secret_key_mock')}><Copy className="h-4 w-4" /></Button>
                  </div>
                </div>
              </div>
              <div className="pt-4 flex gap-4">
                <Button variant="outline" className="flex-1"><ExternalLink className="mr-2 h-4 w-4" /> Documentation</Button>
                <Button className="flex-1 btn-primary">Rotate Keys</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="security" className="space-y-4">
          <Card className="border-none shadow-soft">
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Secure your account with multi-factor authentication.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Two-Factor Authentication</p>
                  <p className="text-xs text-muted-foreground">Add an extra layer of security to your account.</p>
                </div>
                <Button variant="outline">Enable</Button>
              </div>
              <div className="pt-4">
                <Button variant="destructive">Delete Account</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}