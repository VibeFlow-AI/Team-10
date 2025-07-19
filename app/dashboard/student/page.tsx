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
import { mentors, mockStudent, matchMentorsToStudent, Mentor } from "@/lib/mentor-data";
import { Search, Filter, BookOpen, Calendar } from "lucide-react";
import Link from "next/link";

export default function StudentDashboardPage() {
  const [activeTab, setActiveTab] = useState("explore");
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [matchedMentors, setMatchedMentors] = useState<Mentor[]>([]);
  const [filteredMentors, setFilteredMentors] = useState<Mentor[]>([]);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Initialize matched mentors on component mount
  useEffect(() => {
    const matched = matchMentorsToStudent(mockStudent, mentors);
    setMatchedMentors(matched);
    setFilteredMentors(matched);
  }, []);

  // Filter mentors based on search and subject filter
  useEffect(() => {
    let filtered = matchedMentors;

    if (searchQuery) {
      filtered = filtered.filter(mentor =>
        mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentor.subjects.some(subject => 
          subject.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        mentor.expertise.some(skill => 
          skill.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    if (subjectFilter && subjectFilter !== "all") {
      filtered = filtered.filter(mentor =>
        mentor.subjects.includes(subjectFilter)
      );
    }

    setFilteredMentors(filtered);
  }, [searchQuery, subjectFilter, matchedMentors]);

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

  const allSubjects = Array.from(new Set(mentors.flatMap(m => m.subjects))).sort();

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
            Welcome back, {mockStudent.name}! Discover mentors and manage your sessions.
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
                    Showing {filteredMentors.length} of {matchedMentors.length} mentors
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
                    key={mentor.id}
                    mentor={mentor}
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