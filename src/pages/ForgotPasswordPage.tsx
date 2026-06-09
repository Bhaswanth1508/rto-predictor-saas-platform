import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { forgotPassword } from '@/services/auth';
import { toast } from 'sonner';
export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await forgotPassword(email);
    setSubmitted(true);
    toast.success('Reset link sent to your email');
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-mesh p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-soft border-none">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 rounded-xl bg-primary-brand/10 flex items-center justify-center">
                <KeyRound className="h-6 w-6 text-primary-brand" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
            <CardDescription>
              {submitted 
                ? "Check your inbox for instructions" 
                : "Enter your email address and we'll send you a link to reset your password"}
            </CardDescription>
          </CardHeader>
          {!submitted ? (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@brand.com"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full btn-primary">
                  Send Reset Link
                </Button>
                <Link to="/login" className="flex items-center text-sm text-muted-foreground hover:text-primary-brand">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to login
                </Link>
              </CardFooter>
            </form>
          ) : (
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link to="/login">Return to Login</Link>
              </Button>
            </CardFooter>
          )}
        </Card>
      </motion.div>
    </div>
  );
}