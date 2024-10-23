"use client";

import React, { useState } from "react";
import { createSupabaseClientSide } from "@/lib/supabase/supabase-client-side";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff } from "lucide-react";
import { isUsernameExist } from "@/action/register";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null); // Clear any previous errors

    try {
      const supabase = createSupabaseClientSide();

      const usernameExist = await isUsernameExist(username);

      // 0. Validate if username exist
      if(usernameExist) {
        setErrorMessage("This username is already registered.");
        return;
      }

      // 1. Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: firstName + " " + lastName,
          },
        },
      });

      if (authError) {
        // Handle specific error cases
        switch (authError.message) {
          case "User already registered":
            setErrorMessage("This email is already registered.");
            break;
          case "Password should be at least 6 characters":
            setErrorMessage("Password must be at least 6 characters long.");
            break;
          default:
            setErrorMessage(authError.message);
        }
        return;
      }

      // 2. If registration is successful, insert user profile data
      if (authData.user) {  
        console.log(authData.user)
        const { error: profileError } = await supabase
          .from("profiles")
          .insert({
            user_id: authData.user.id,
            username,
            first_name: firstName,
            last_name: lastName
          });

        if (profileError) {
          console.error("Error creating profile:", profileError);
          setErrorMessage("Error creating user profile. Please try again.");
          return;
        }

        // Success case
        setSuccessMessage("Registration successful! You can proceed to login now.");
        setErrorMessage(""); // Clear any previous error message
        setEmail("");
        setPassword("");
        setUsername("");
        setFirstName("");
        setLastName("");
      }
    } catch (error: any) {
      setErrorMessage(error.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="p-6 rounded shadow-md w-full max-w-md">
        <CardContent>
          <h2 className="text-xl font-bold mb-4 text-center">Register</h2>

          {/* Success Alert */}
          {successMessage && (
            <Alert variant="default" className="mb-4">
              <AlertDescription>
                {successMessage}
              </AlertDescription>
            </Alert>
          )}

          {/* Error Alert */}
          {errorMessage && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>
                {errorMessage}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleRegister}>
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mb-4"
              required
              disabled={isLoading}
              minLength={3}
            />
            <Input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="mb-4"
              required
              disabled={isLoading}
            />
            <Input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="mb-4"
              required
              disabled={isLoading}
            />
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
                  Registering...
                </span>
              ) : (
                "Register"
              )}
            </Button>
            <div className="text-sm text-gray-600 text-center space-y-2">
              <p>
                Already have an account?{" "}
                <Link href="/login" className="text-blue-600 hover:underline">
                  Login here
                </Link>
              </p>
              {errorMessage?.includes("already registered") && (
                <p>
                  <Link href="/login" className="text-blue-600 hover:underline">
                    Go to Login
                  </Link>
                </p>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
