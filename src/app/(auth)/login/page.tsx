"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/auth-context";
import { useState, type FormEvent } from "react";
import { Loader } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

export default function LoginPage() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await login(email, password);
    } catch (err) {
      console.error(err);
      toast({
        title: "Login Failed",
        description: err instanceof Error ? err.message : "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <Image 
        src="https://picsum.photos/seed/logo/100/100" 
        alt="Company Logo" 
        width={80} 
        height={80} 
        className="mb-4 rounded-full"
        data-ai-hint="logo"
      />
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 bg-clip-text text-transparent">SmartLedger</h1>
        <p className="text-muted-foreground">for Retail Business</p>
      </div>
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="ml-auto inline-block text-sm font-bold">
                  Forgot your password?
                </Link>
              </div>
              <Input id="password" type="password" name="password" required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
              Login
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-bold">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
