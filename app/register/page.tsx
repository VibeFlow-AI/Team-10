"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegisterPage() {
  const router = useRouter();

  const handleStudentRegister = () => {
    router.push("/register/student");
  };

  const handleMentorRegister = () => {
    router.push("/register/mentor");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Register as a...
          </h1>
          <p className="text-lg text-gray-600">
            Choose your role to get started with EduVibe
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {/* Student Card */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={handleStudentRegister}>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-indigo-600">
                Register as Student
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription className="text-base">
                I'm a learner looking for guidance.
              </CardDescription>
              <Button className="mt-6 w-full" size="lg">
                Get Started
              </Button>
            </CardContent>
          </Card>

          {/* Mentor Card */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={handleMentorRegister}>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-green-600">
                Register as Mentor
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription className="text-base">
                I want to help students as a mentor.
              </CardDescription>
              <Button className="mt-6 w-full" size="lg" variant="outline">
                Get Started
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 