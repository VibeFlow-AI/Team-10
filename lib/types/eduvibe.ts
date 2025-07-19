// EduVibe EdTech Platform TypeScript Interfaces

// User roles enum
export enum UserRole {
  STUDENT = "student",
  MENTOR = "mentor",
  ADMIN = "admin",
}

// Subject areas enum
export enum Subject {
  MATHEMATICS = "mathematics",
  PHYSICS = "physics",
  CHEMISTRY = "chemistry",
  BIOLOGY = "biology",
  ENGLISH = "english",
  HISTORY = "history",
  GEOGRAPHY = "geography",
  COMPUTER_SCIENCE = "computer_science",
  ECONOMICS = "economics",
  LITERATURE = "literature",
}

// Student education level enum
export enum StudentEducationLevel {
  GRADE_9 = "grade_9",
  ORDINARY_LEVEL = "ordinary_level",
  ADVANCED_LEVEL = "advanced_level",
}

// Mentor education levels enum
export enum MentorEducationLevel {
  GRADE_3_5 = "grade_3_5",
  GRADE_6_9 = "grade_6_9",
  GRADE_10_11 = "grade_10_11",
  ADVANCED_LEVEL = "advanced_level",
}

// Teaching experience enum
export enum TeachingExperience {
  NONE = "none",
  ONE_TO_THREE_YEARS = "1_3_years",
  THREE_TO_FIVE_YEARS = "3_5_years",
  FIVE_PLUS_YEARS = "5_plus_years",
}

// Skill level enum
export enum SkillLevel {
  BEGINNER = "beginner",
  INTERMEDIATE = "intermediate",
  ADVANCED = "advanced",
}

// Learning style enum
export enum LearningStyle {
  VISUAL = "visual",
  HANDS_ON = "hands_on",
  THEORETICAL = "theoretical",
  MIXED = "mixed",
}

// Preferred language enum
export enum PreferredLanguage {
  ENGLISH = "english",
  SINHALA = "sinhala",
  TAMIL = "tamil",
  OTHER = "other",
}

// Session status enum
export enum SessionStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  NO_SHOW = "no_show",
}

// Payment status enum
export enum PaymentStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  FAILED = "failed",
  REFUNDED = "refunded",
}

// Base user interface
export interface BaseUser {
  uid: string;
  email: string;
  role: UserRole;
  displayName: string;
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
  isEmailVerified: boolean;
  lastSignInAt?: Date;
}

// Student subject skill level interface
export interface SubjectSkillLevel {
  subject: string;
  skillLevel: SkillLevel;
}

// Student profile interface - matches the exact form requirements
export interface StudentProfile extends BaseUser {
  role: UserRole.STUDENT;

  // Part 1: Who Are You? (Basic Information)
  fullName: string;
  age: number;
  emailAddress: string;
  contactNumber: string;

  // Part 2: Academic Background
  currentEducationLevel: StudentEducationLevel;
  school: string;

  // Part 3: Subject & Skill Assessment
  subjectsOfInterest: string; // comma separated subjects
  currentYear: number;
  subjectSkillLevels: SubjectSkillLevel[]; // skill level for each subject
  preferredLearningStyle: LearningStyle;
  hasLearningDisabilities: boolean;
  learningDisabilitiesDescription?: string;

  // Onboarding status
  isProfileComplete: boolean;
  onboardingStep: number;
}

// Mentor profile interface - matches the exact form requirements
export interface MentorProfile extends BaseUser {
  role: UserRole.MENTOR;

  // Part 1: Personal Information
  fullName: string;
  age: number;
  emailAddress: string;
  contactNumber: string;
  preferredLanguage: PreferredLanguage | string;
  currentLocation: string;
  shortBio: string;
  professionalRole: string;

  // Part 2: Areas of Expertise
  teachingSubjects: string[]; // subjects they plan to teach
  teachingExperience: TeachingExperience;
  preferredStudentLevels: MentorEducationLevel[];

  // Part 3: Social & Professional Links
  linkedinProfile: string; // mandatory URL
  githubOrPortfolio?: string; // optional URL
  profilePictureUrl?: string; // uploaded image URL

  // Onboarding status
  isProfileComplete: boolean;
  onboardingStep: number;
}

// Time slot interface
export interface TimeSlot {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  isAvailable: boolean;
}

// Session interface
export interface MentorSession {
  id: string;
  studentId: string;
  mentorId: string;

  // Session details
  subject: string;
  educationLevel: StudentEducationLevel;
  sessionDate: Date;
  startTime: string;
  endTime: string;
  duration: number; // in minutes (2 hours = 120 minutes)

  // Status and payment
  status: SessionStatus;
  paymentStatus: PaymentStatus;
  bankSlipUrl?: string;

  // Session content
  topic?: string;
  learningObjectives?: string[];
  materials?: string[]; // URLs to materials

  // Session feedback
  studentRating?: number;
  studentFeedback?: string;
  mentorRating?: number;
  mentorFeedback?: string;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  confirmedAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  cancelledBy?: string;
  cancellationReason?: string;
}

// Booking request interface
export interface BookingRequest {
  id: string;
  studentId: string;
  mentorId: string;

  // Request details
  subject: string;
  educationLevel: StudentEducationLevel;
  preferredDate: Date;
  preferredTimeSlots: string[];
  duration: number; // in minutes

  // Additional information
  topic?: string;
  learningObjectives?: string[];
  specialRequirements?: string;

  // Status
  status: "pending" | "accepted" | "rejected" | "expired";

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
  respondedAt?: Date;
  responseMessage?: string;
}

// Dashboard data interfaces
export interface StudentDashboardData {
  upcomingSessions: MentorSession[];
  pastSessions: MentorSession[];
  availableMentors: MentorProfile[];
  totalSessions: number;
  totalSpent: number;
  favoriteSubjects: string[];
  learningProgress: {
    subject: string;
    sessionsCompleted: number;
    averageRating: number;
  }[];
}

export interface MentorDashboardData {
  upcomingSessions: MentorSession[];
  pastSessions: MentorSession[];
  totalStudents: number;
  totalEarnings: number;
  averageRating: number;
  sessionStats: {
    total: number;
    completed: number;
    cancelled: number;
    pending: number;
  };
  earningsByMonth: {
    month: string;
    amount: number;
  }[];
  popularSubjects: {
    subject: string;
    sessions: number;
  }[];
}

// Search and filter interfaces
export interface MentorSearchFilters {
  subjects?: string[];
  educationLevels?: MentorEducationLevel[];
  languages?: PreferredLanguage[];
  maxHourlyRate?: number;
  availability?: {
    dayOfWeek: number;
    timeSlot: string;
  };
}

export interface SessionFilters {
  status?: SessionStatus[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  subject?: string;
  mentorId?: string;
  studentId?: string;
}

// Real-time listener interfaces
export interface RealtimeListener<T> {
  data: T[];
  loading: boolean;
  error: string | null;
}

// API response interfaces
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Pagination interface
export interface PaginationOptions {
  limit: number;
  offset?: number;
  orderBy?: {
    field: string;
    direction: "asc" | "desc";
  };
}

// Availability check interface
export interface AvailabilityCheck {
  mentorId: string;
  date: Date;
  timeSlot: string;
  duration: number;
  isAvailable: boolean;
  conflictingSessions?: MentorSession[];
}
