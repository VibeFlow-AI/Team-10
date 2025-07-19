"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MentorCard } from "@/components/MentorCard";
import { BookingCard } from "@/components/BookingCard";
import { BookingModal } from "@/components/BookingModal";
import { useAuth } from "@/lib/auth";
import { studentService } from "@/lib/services/studentService";
import { mentorService } from "@/lib/services/mentorService";
import { MentorProfile, StudentProfile } from "@/lib/types/eduvibe";
import { mentors, mockStudent, matchMentorsToStudent, Mentor } from "@/lib/mentor-data";
import { Search, Filter, BookOpen, Calendar } from "lucide-react";
import Link from "next/link";
import { firebaseUtils } from "@/lib/firebase-utils";

export default function StudentDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [mentors, setMentors] = useState<MentorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("explore");
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [filteredMentors, setFilteredMentors] = useState<MentorProfile[]>([]);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Fetch student profile and recommended mentors
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        // 1. Fetch student profile from Firestore by uid field (not document ID)
        const students = await studentService.query([
          firebaseUtils.where('uid', firebaseUtils.operators.equal, user.uid)
        ]);
        const profile = students[0] || null;
        if (!profile) throw new Error("Student profile not found.");
        setStudentProfile(profile);
        // 2. Fetch recommended mentors
        const recMentors = await mentorService.getMentorsMatchingStudentPreferences(profile);
        setMentors(recMentors);
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    if (!authLoading) fetchData();
  }, [user, authLoading]);

  // Filter mentors based on search and subject filter
  useEffect(() => {
    let filtered = mentors;

    if (searchQuery) {
      filtered = filtered.filter(mentor =>
        mentor.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentor.teachingSubjects.some(subject => 
          subject.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        (mentor.professionalRole && mentor.professionalRole.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (subjectFilter && subjectFilter !== "all") {
      filtered = filtered.filter(mentor =>
        mentor.teachingSubjects.includes(subjectFilter)
      );
    }

    setFilteredMentors(filtered);
  }, [searchQuery, subjectFilter, mentors]);

  const handleBookNow = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    setIsBookingModalOpen(true);
  };

  const handleBookingComplete = (booking: any) => {
    setBookings(prev => [booking, ...prev]);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 5000);
  };

  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false);
    setSelectedMentor(null);
  };

  // Get all unique subjects from mentors
  const allSubjects = Array.from(new Set(mentors.flatMap(m => m.teachingSubjects))).sort();

  // Helper to adapt MentorProfile to MentorCard props
  const mapMentorProfileToCard = (mentor: MentorProfile) => ({
    id: mentor.uid,
    name: mentor.fullName,
    photo: mentor.profilePictureUrl || "/public/default-profile.png",
    rating: mentor.averageRating || 5,
    experience: mentor.teachingExperience || "N/A",
    subjects: mentor.teachingSubjects,
    expertise: [mentor.professionalRole, mentor.shortBio].filter(Boolean),
    hourlyRate: 25, // Placeholder, replace with real data if available
    // Add missing fields for Mentor type compatibility
    languages: [mentor.preferredLanguage],
    gradeLevels: mentor.preferredStudentLevels || [],
    bio: mentor.shortBio || "",
  });

  if (authLoading || loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading dashboard...</div>;
  }
  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-600">{error}</div>;
  }
  if (!studentProfile) {
    return <div className="flex justify-center items-center min-h-screen">No student profile found.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            <span>Booking successful! Check your Booked Sessions tab.</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Student Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Welcome back, {studentProfile.fullName}! Discover mentors and manage your sessions.
          </p>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="explore" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Explore Mentors
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Booked Sessions ({bookings.length})
            </TabsTrigger>
          </TabsList>

          {/* Explore Mentors Tab */}
          <TabsContent value="explore" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Find Your Perfect Mentor
                </CardTitle>
                <CardDescription>
                  Use the filters below to find mentors that match your interests and needs.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Search Mentors</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search by name, subjects, or expertise..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Filter by Subject</label>
                    <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All subjects" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All subjects</SelectItem>
                        {allSubjects.map((subject) => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Showing {filteredMentors.length} of {mentors.length} mentors
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("");
                      setSubjectFilter("all");
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Mentors Grid */}
            {filteredMentors.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMentors.map((mentor) => (
                  <MentorCard
                    key={mentor.uid}
                    mentor={mapMentorProfileToCard(mentor)}
                    onBookNow={handleBookNow}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No mentors found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your search criteria or filters.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("");
                      setSubjectFilter("all");
                    }}
                  >
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Booked Sessions Tab */}
          <TabsContent value="bookings" className="space-y-6">
            {bookings.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No booked sessions yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Start exploring mentors and book your first session!
                  </p>
                  <Button onClick={() => setActiveTab("explore")}>
                    Explore Mentors
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Back to Home */}
        <div className="text-center mt-12">
          <Link href="/">
            <Button variant="outline" size="lg">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>

      {/* Booking Modal */}
      {selectedMentor && (
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={handleCloseBookingModal}
          mentor={selectedMentor}
          onBookingComplete={handleBookingComplete}
        />
      )}
    </div>
  );
} 