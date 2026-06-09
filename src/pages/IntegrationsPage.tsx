import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Truck, MessageSquare, CreditCard, ExternalLink, ShieldCheck } from 'lucide-react';
const integrations = [
  {
    name: "Shopify",
    description: "Sync orders, inventory, and RTO risks directly from your Shopify store.",
    icon: ShoppingBag,
    category: "E-commerce",
    status: "available",
    color: "bg-green-50 text-green-700 border-green-200"
  },
  {
    name: "WooCommerce",
    description: "Deep integration for WordPress merchants to manage return losses.",
    icon: ShoppingBag,
    category: "E-commerce",
    status: "beta",
    color: "bg-purple-50 text-purple-700 border-purple-200"
  },
  {
    name: "Shiprocket",
    description: "Push RTO risk flags directly to your shipping dashboard.",
    icon: Truck,
    category: "Logistics",
    status: "available",
    color: "bg-blue-50 text-blue-700 border-blue-200"
  },
  {
    name: "Delhivery",
    description: "Real-time sync with one of India's largest logistics partners.",
    icon: Truck,
    category: "Logistics",
    status: "coming-soon",
    color: "bg-gray-50 text-gray-700 border-gray-200"
  },
  {
    name: "WhatsApp API",
    description: "Automate order confirmation messages for high-risk customers.",
    icon: MessageSquare,
    category: "Communication",
    status: "available",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200"
  },
  {
    name: "Razorpay",
    description: "Disable COD dynamically for high-risk orders during checkout.",
    icon: CreditCard,
    category: "Payments",
    status: "coming-soon",
    color: "bg-blue-50 text-blue-800 border-blue-300"
  }
];
export function IntegrationsPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">App Integrations</h1>
          <p className="text-muted-foreground">Connect your tech stack to automate RTO risk management.</p>
        </div>
        <Button className="btn-primary">
          <ShieldCheck className="mr-2 h-4 w-4" /> Custom API Access
        </Button>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((item, i) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="h-full border-none shadow-soft hover:shadow-glow transition-all group">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <div className={`p-3 rounded-xl ${item.color}`}>
                    <item.icon className="h-6 w-6" />
                  </div>
                  {item.status !== 'available' && (
                    <Badge variant="secondary" className="capitalize">
                      {item.status.replace('-', ' ')}
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-xl group-hover:text-primary-brand transition-colors">
                  {item.name}
                </CardTitle>
                <CardDescription className="text-xs font-bold uppercase tracking-widest">
                  {item.category}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </CardContent>
              <CardFooter className="pt-4">
                <Button 
                  className="w-full" 
                  variant={item.status === 'available' ? 'default' : 'outline'}
                  disabled={item.status === 'coming-soon'}
                >
                  {item.status === 'available' ? 'Connect Now' : 'Join Waitlist'}
                  <ExternalLink className="ml-2 h-3 w-3" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
      <div className="bg-secondary/30 rounded-2xl p-8 text-center border-2 border-dashed">
        <h3 className="text-xl font-bold mb-2">Missing an integration?</h3>
        <p className="text-muted-foreground max-w-lg mx-auto mb-6">
          We're constantly adding new partners. Let us know which platform you'd like to see next in our roadmap.
        </p>
        <Button variant="outline">Suggest a Partner</Button>
      </div>
    </div>
  );
}