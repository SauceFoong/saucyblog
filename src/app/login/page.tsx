"use client";
import React, { useState } from "react";
import { createSupabaseClientSide } from "@/lib/supabase/supabase-client-side";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null); // Clear any previous errors

    try {
      const supabase = createSupabaseClientSide();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Handle specific error cases
        switch (error.message) {
          case "Invalid login credentials":
            setErrorMessage("Invalid email or password. Please try again.");
            break;
          case "Email not confirmed":
            setErrorMessage("Please verify your email address before logging in.");
            break;
          default:
            setErrorMessage(error.message);
        }
        return;
      }

      if (data.user) {
        // Successful login
        router.push("/posts");
        router.refresh(); // Refresh to update auth state
      }
    } catch (error: any) {
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="p-6 rounded shadow-md w-full max-w-md">
        <CardContent>
          <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

          {/* Error Alert */}
          {errorMessage && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>
                {errorMessage}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin}>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-4"
              required
              disabled={isLoading}
            />

            <div className="relative">
            <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border p-2 mb-4 w-full"
                disabled={isLoading}
                required
            />
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-2 text-gray-500"
            >
                {showPassword ? <EyeOff /> : <Eye />}
            </button>
            </div>

            <Button 
              type="submit" 
              className="w-full mb-4"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </Button>
            <div className="text-sm text-gray-600 text-center space-y-2">
                <p>
                Don't have an account?{" "}
                <Link href="/register" className="text-blue-600 hover:underline">
                  Register here
                </Link>
                </p>
                <p>
                <Link href="/" className="text-blue-600 hover:underline">
                  Homepage
                </Link>
                </p>
              <p>
                <Link href="/forgot-password" className="text-blue-600 hover:underline">
                  Forgot your password?
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}