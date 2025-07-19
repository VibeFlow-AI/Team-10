import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function MentorDashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Welcome to Your Mentor Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Your onboarding is complete! Here's what you can do next.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-green-600">
                Manage Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                View upcoming sessions, manage bookings, and track your teaching schedule.
              </CardDescription>
              <Button className="w-full" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-blue-600">
                Student Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                Review and respond to student requests for mentorship and tutoring.
              </CardDescription>
              <Button className="w-full" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-purple-600">
                Teaching Materials
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                Upload and organize your teaching resources, lesson plans, and materials.
              </CardDescription>
              <Button className="w-full" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-orange-600">
                Earnings & Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                Track your earnings, session statistics, and student feedback.
              </CardDescription>
              <Button className="w-full" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-red-600">
                Community
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                Connect with other mentors, share experiences, and collaborate.
              </CardDescription>
              <Button className="w-full" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-teal-600">
                Profile & Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                Update your profile, availability, and teaching preferences.
              </CardDescription>
              <Button className="w-full" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <Link href="/">
            <Button variant="outline" size="lg">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 