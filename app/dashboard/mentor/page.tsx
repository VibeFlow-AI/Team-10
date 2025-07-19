"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Calendar, Clock, User, BookOpen, Play } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";

// Mock data for booked sessions
const ageGroupData = [
  { name: "14-15 years", value: 20, color: "#8884d8" },
  { name: "16-17 years", value: 45, color: "#82ca9d" },
  { name: "18-19 years", value: 25, color: "#ffc658" },
  { name: "20+ years", value: 10, color: "#ff7300" },
];

// Mock data for subject demand
const subjectDemandData = [
  { subject: "Mathematics", bookings: 12 },
  { subject: "Physics", bookings: 8 },
  { subject: "Chemistry", bookings: 6 },
  { subject: "Biology", bookings: 5 },
  { subject: "English", bookings: 4 },
  { subject: "History", bookings: 3 },
];

export default function MentorDashboardPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mentorProfile, setMentorProfile] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const user = auth.currentUser;
        if (!user) {
          setError("You must be logged in to view your dashboard.");
          setLoading(false);
          return;
        }
        // Fetch mentor profile
        const mentorDoc = doc(db, "mentors", user.uid);
        const mentorSnap = await getDoc(mentorDoc);
        if (mentorSnap.exists()) {
          setMentorProfile(mentorSnap.data());
        }
        // Fetch sessions where mentorId == user.uid
        const q = query(
          collection(db, "sessions"),
          where("mentorId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);
        const sessionList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSessions(sessionList);
      } catch (err) {
        setError("Failed to load dashboard data.");
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  // Fallback to mock data if not logged in or no sessions
  const bookedSessions =
    sessions.length > 0
      ? sessions
      : [
          {
            id: 1,
            studentName: "Sarah Johnson",
            studentAge: 16,
            profilePicture:
              "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
            sessionDate: "2024-01-15",
            sessionTime: "14:00",
            subject: "Mathematics",
            requestTimestamp: "2024-01-10T10:30:00Z",
          },
          {
            id: 2,
            studentName: "Michael Chen",
            studentAge: 17,
            profilePicture:
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
            sessionDate: "2024-01-16",
            sessionTime: "16:00",
            subject: "Physics",
            requestTimestamp: "2024-01-11T09:15:00Z",
          },
          {
            id: 3,
            studentName: "Emma Davis",
            studentAge: 15,
            profilePicture:
              "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
            sessionDate: "2024-01-17",
            sessionTime: "10:00",
            subject: "Chemistry",
            requestTimestamp: "2024-01-12T14:20:00Z",
          },
          {
            id: 4,
            studentName: "Alex Rodriguez",
            studentAge: 18,
            profilePicture:
              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
            sessionDate: "2024-01-18",
            sessionTime: "13:30",
            subject: "Mathematics",
            requestTimestamp: "2024-01-13T11:45:00Z",
          },
          {
            id: 5,
            studentName: "Sophie Williams",
            studentAge: 16,
            profilePicture:
              "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
            sessionDate: "2024-01-19",
            sessionTime: "15:00",
            subject: "Biology",
            requestTimestamp: "2024-01-14T16:30:00Z",
          },
        ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatRequestTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Mentor Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Manage your sessions and track student demographics
          </p>
        </div>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {/* A. Booked Sessions List */}
            <div className="lg:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl font-bold text-green-600">
                    <Calendar className="w-5 h-5" />
                    Booked Sessions
                  </CardTitle>
                  <CardDescription>
                    Upcoming sessions with your students
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {bookedSessions
                      .sort(
                        (a, b) =>
                          new Date(a.sessionDate).getTime() -
                          new Date(b.sessionDate).getTime()
                      )
                      .map((session) => (
                        <div
                          key={session.id}
                          className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center gap-4">
                            <img
                              src={session.profilePicture}
                              alt={session.studentName}
                              className="w-12 h-12 rounded-full object-cover border-2 border-green-200"
                            />
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {session.studentName}
                              </h3>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {formatDate(session.sessionDate)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {formatTime(session.sessionTime)}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary" className="text-xs">
                                  {session.subject}
                                </Badge>
                                <span className="text-xs text-gray-500">
                                  Requested:{" "}
                                  {formatRequestTime(session.requestTimestamp)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
                            <Play className="w-4 h-4" />
                            Start Session
                          </Button>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* B. Age Group Pie Chart */}
            <div>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl font-bold text-blue-600">
                    <User className="w-5 h-5" />
                    Student Age Groups
                  </CardTitle>
                  <CardDescription>
                    Distribution of student ages
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={ageGroupData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {ageGroupData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
        {/* C. Subject Demand Bar Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-bold text-purple-600">
              <BookOpen className="w-5 h-5" />
              Subject Demand
            </CardTitle>
            <CardDescription>
              Most requested subjects by students
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={subjectDemandData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="bookings" fill="#8884d8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="text-center">
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
