"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface GetStartedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GetStartedModal({ isOpen, onClose }: GetStartedModalProps) {
  const router = useRouter();

  const handleSignUp = () => {
    onClose();
    router.push("/register");
  };

  const handleLogin = () => {
    onClose();
    router.push("/login");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Welcome to EduVibe!
            </CardTitle>
            <CardDescription className="text-center">
              Connect with mentors and accelerate your learning journey with AI-powered matching.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleSignUp} 
              className="w-full"
              size="lg"
            >
              Sign Up / Register
            </Button>
            <Button 
              onClick={handleLogin} 
              variant="outline" 
              className="w-full"
              size="lg"
            >
              Already have an account? Login
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 