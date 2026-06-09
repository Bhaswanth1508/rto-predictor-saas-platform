import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, TrendingDown, MapPin, BarChart3, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';
const features = [
  {
    icon: ShieldCheck,
    title: "Risk Prediction",
    description: "AI-driven engine predicts RTO risk for every order before you ship."
  },
  {
    icon: TrendingDown,
    title: "Loss Reduction",
    description: "Minimize shipping costs and product damage by identifying high-risk returns."
  },
  {
    icon: MapPin,
    title: "Geographical Intelligence",
    description: "Deep insights into pincode-level RTO trends across the country."
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description: "Comprehensive dashboards tracking your recovery and saving metrics."
  }
];
const plans = [
  {
    name: "Starter",
    price: "$49",
    description: "Perfect for growing D2C brands.",
    features: ["Up to 500 orders/mo", "Basic RTO Prediction", "Standard Support"]
  },
  {
    name: "Growth",
    price: "$149",
    description: "For high-volume merchants.",
    features: ["Up to 2500 orders/mo", "Advanced Risk Rules", "Priority Support", "Pincode Insights"]
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Tailored solutions for large brands.",
    features: ["Unlimited Orders", "Custom Rule Engine", "Dedicated Account Manager", "API Access"]
  }
];
export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <ThemeToggle />
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-mesh py-24 md:py-32 lg:py-48">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-display mb-6">
              Stop Losing Profits to <span className="text-gradient">RTO Returns</span>
            </h1>
            <p className="text-body max-w-2xl mx-auto mb-10">
              RTO Predictor helps D2C brands identify high-risk orders before shipment. Save on logistics, minimize losses, and scale with confidence.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" className="btn-primary">
                <Link to="/register">Get Started Now <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button variant="outline" size="lg" className="btn-outline">
                Book a Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-24 md:py-32 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Built for Smarter E-commerce</h2>
            <p className="text-muted-foreground">Proactive intelligence to protect your bottom line.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-none shadow-soft hover:shadow-glow transition-all">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-lg bg-primary-brand/10 flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-primary-brand" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Pricing Section */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-muted-foreground">Choose a plan that scales with your growth.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, i) => (
              <Card key={i} className={`flex flex-col ${i === 1 ? 'border-primary-brand ring-1 ring-primary-brand scale-105 z-10' : ''}`}>
                <CardHeader>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.price !== 'Custom' && <span className="ml-1 text-muted-foreground">/month</span>}
                  </div>
                  <CardDescription className="mt-2">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    {plan.features.map((feat, j) => (
                      <li key={j} className="flex items-center text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-primary-brand mr-2" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                  <Button className={`w-full mt-8 ${i === 1 ? 'btn-primary' : ''}`} variant={i === 1 ? 'default' : 'outline'}>
                    Select Plan
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-secondary/50 border-t py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div>
              <span className="text-xl font-bold tracking-tight text-primary-brand">RTO Predictor</span>
              <p className="text-sm text-muted-foreground mt-2">© 2024 RTO Predictor SaaS. All rights reserved.</p>
            </div>
            <div className="flex gap-8">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Contact Us</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}