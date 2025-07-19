"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { X } from "lucide-react";
import { AuthService } from "@/lib/auth";
import { userService } from "@/lib/services/userService";
import { UserRole } from "@/lib/types/eduvibe";
import { useUser } from "@/context/UserContext";

interface GetStartedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GetStartedModal({
  isOpen,
  onClose,
}: GetStartedModalProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { setUserProfile } = useUser();

  const handleContinue = async () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedEmail || !trimmedPassword) {
      setError("Email and password are required.");
      return;
    }
    if (!emailRegex.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (trimmedPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      let user = null;
      try {
        // Try to log in
        user = await AuthService.signInWithEmail(trimmedEmail, trimmedPassword);
        console.log("User logged in:", user);
      } catch (loginErr) {
        // Only try to register if the error is user-not-found
        if (
          loginErr &&
          typeof loginErr === "object" &&
          "code" in loginErr &&
          loginErr.code === "auth/user-not-found"
        ) {
          try {
            user = await AuthService.signUpWithEmail(
              trimmedEmail,
              trimmedPassword
            );
          } catch (signupErr) {
            setError("Registration failed. Please try again.");
            setLoading(false);
            return;
          }
        } else if (
          loginErr &&
          typeof loginErr === "object" &&
          "code" in loginErr &&
          loginErr.code === "auth/wrong-password"
        ) {
          setError("Incorrect password. Please try again.");
          setLoading(false);
          return;
        } else if (
          loginErr &&
          typeof loginErr === "object" &&
          "code" in loginErr &&
          loginErr.code === "auth/invalid-email"
        ) {
          setError("Invalid email address.");
          setLoading(false);
          return;
        } else {
          setError("Sign in failed. Please try again.");
          setLoading(false);
          return;
        }
      }

      // 3. Check if user exists in User collection
      const userProfile = await userService.getUserByEmail(user.email);
      if (userProfile) {
        setUserProfile(userProfile);
        // 4. If user exists and onboarding not complete, redirect to correct registration page
        if (!userProfile.isProfileComplete) {
          if (userProfile.role === UserRole.MENTOR) {
            router.push("/register/mentor");
          } else if (userProfile.role === UserRole.STUDENT) {
            router.push("/register/student");
          }
          setLoading(false);
          return;
        } else {
          // If profile complete, go to dashboard
          if (userProfile.role === UserRole.MENTOR) {
            router.push("/dashboard/mentor");
          } else if (userProfile.role === UserRole.STUDENT) {
            router.push("/dashboard/student");
          }
          setLoading(false);
          return;
        }
      } else {
        // If user not in User collection, show role selection
        setShowRoleSelection(true);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const handleBackToSignIn = () => {
    setShowRoleSelection(false);
  };

  const handleContinueAsMentor = () => {
    onClose();
    router.push("/register/mentor");
  };

  const handleContinueAsStudent = () => {
    onClose();
    router.push("/register/student");
  };

  const handleGoogleSignIn = () => {
    // Handle Google sign-in logic here
    console.log("Google sign-in clicked");
  };

  const handleFacebookSignIn = () => {
    // Handle Facebook sign-in logic here
    console.log("Facebook sign-in clicked");
  };

  const handleGitHubSignIn = () => {
    // Handle GitHub sign-in logic here
    console.log("GitHub sign-in clicked");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-100 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-lg relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
        
        <Card className="border-0 shadow-none">
          {!showRoleSelection ? (
            <>
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold text-center">
                  Sign in to EduVibe
                </CardTitle>
                <CardDescription className="text-center text-gray-600">
                  Welcome back! please sign in to continue.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Social Login Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleGoogleSignIn}
                    variant="outline"
                    className="flex-1 bg-black text-white hover:bg-gray-800 border-black"
                    size="lg"
                  >
                    <span className="text-white font-bold">G</span>
                  </Button>
                  <Button
                    onClick={handleFacebookSignIn}
                    variant="outline"
                    className="flex-1 bg-black text-white hover:bg-gray-800 border-black"
                    size="lg"
                  >
                    <span className="text-white font-bold">f</span>
                  </Button>
                  <Button
                    onClick={handleGitHubSignIn}
                    variant="outline"
                    className="flex-1 bg-black text-white hover:bg-gray-800 border-black"
                    size="lg"
                  >
                    <span className="text-white font-bold">GitHub</span>
                  </Button>
                </div>

                {/* Separator */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">or</span>
                  </div>
                </div>

                {/* Email Input */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border-gray-300 focus:border-black focus:ring-black"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border-gray-300 focus:border-black focus:ring-black"
                  />
                </div>

                {/* Continue Button */}
                <Button
                  onClick={handleContinue}
                  className="w-full bg-black text-white hover:bg-gray-800"
                  size="lg"
                  disabled={!email.trim() || loading}
                >
                  {loading ? "Signing In..." : "Continue"}
                </Button>
                {error && (
                  <p className="text-red-500 text-sm text-center">{error}</p>
                )}
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold text-center">
                  Choose Your Role
                </CardTitle>
                <CardDescription className="text-center text-gray-600">
                  How would you like to use EduVibe?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={handleContinueAsMentor}
                  className="w-full bg-black text-white hover:bg-gray-800 h-16 text-lg"
                  size="lg"
                >
                  Continue as Mentor
                </Button>
                <Button
                  onClick={handleContinueAsStudent}
                  className="w-full bg-black text-white hover:bg-gray-800 h-16 text-lg"
                  size="lg"
                >
                  Continue as Student
                </Button>
                <Button
                  onClick={handleBackToSignIn}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  Back to Sign In
                </Button>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
