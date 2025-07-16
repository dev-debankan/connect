
'use client';

import Link from "next/link";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { createUser } from "@/lib/data";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("full-name") as string;
    const email = formData.get("email") as string;

    if (!name || !email) {
      toast({
        title: "Error",
        description: "Please fill out all fields.",
        variant: "destructive",
      });
      return;
    }
    
    createUser({ name, email });
    
    toast({
      title: "Account Created!",
      description: "You have successfully created your account. Please log in.",
    });
    router.push('/login');
  };

  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <Users className="mx-auto h-12 w-auto text-primary" />
            <h2 className="mt-6 text-center text-3xl font-headline font-bold tracking-tight">
            Create your account
            </h2>
            <p className="mt-2 text-center text-sm text-muted-foreground">
            Or{' '}
            <Link href="/login" className="font-medium text-primary hover:text-primary/90">
                sign in to your existing account
            </Link>
            </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Get Started</CardTitle>
                    <CardDescription>It's quick and easy to create an account.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid gap-2">
                          <Label htmlFor="full-name">Full Name</Label>
                          <Input id="full-name" name="full-name" placeholder="John Doe" required />
                      </div>
                      <div className="grid gap-2">
                          <Label htmlFor="email">Email address</Label>
                          <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                      </div>
                      <div className="grid gap-2">
                          <Label htmlFor="password">Password</Label>
                          <div className="relative">
                            <Input id="password" type={showPassword ? 'text' : 'password'} required />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground hover:bg-transparent"
                              onClick={togglePasswordVisibility}
                              >
                              {showPassword ? <EyeOff /> : <Eye />}
                              <span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
                            </Button>
                          </div>
                      </div>
                      <Button type="submit" className="w-full">
                          Create Account
                      </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
