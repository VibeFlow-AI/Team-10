import {
  FirebaseService,
  firebaseUtils,
  dateUtils,
  validationUtils,
} from "../firebase-utils";
import {
  MentorProfile,
  StudentProfile,
  MentorSession,
  MentorDashboardData,
  MentorEducationLevel,
  TeachingExperience,
  PreferredLanguage,
  SessionStatus,
  PaymentStatus,
  UserRole,
} from "../types/eduvibe";
import { SessionService } from "./sessionService";

/**
 * Mentor Service - Handles all mentor-related operations
 * Manages mentor profiles, sessions, and dashboard data
 */
export class MentorService extends FirebaseService<MentorProfile> {
  constructor() {
    super("mentors");
  }

  /**
   * Register a new mentor profile with multi-step onboarding data
   * @param profile - Complete mentor profile data from onboarding forms
   * @returns Promise<void>
   */
  async registerMentorProfile(
    profile: Omit<
      MentorProfile,
      | "id"
      | "createdAt"
      | "updatedAt"
      | "role"
      | "isEmailVerified"
      | "isProfileComplete"
      | "onboardingStep"
      | "isVerified"
      | "isApproved"
      | "rating"
      | "totalSessions"
    >
  ): Promise<void> {
    try {
      // Validate required fields
      const requiredFields = [
        "fullName",
        "age",
        "emailAddress",
        "contactNumber",
        "preferredLanguage",
        "currentLocation",
        "shortBio",
        "professionalRole",
        "teachingSubjects",
        "teachingExperience",
        "preferredStudentLevels",
        "linkedinProfile",
      ];
      const missingFields = validationUtils.validateRequired(
        profile,
        requiredFields
      );

      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
      }

      // Validate email format
      if (!validationUtils.isValidEmail(profile.emailAddress)) {
        throw new Error("Invalid email format");
      }

      // Validate phone number
      if (!validationUtils.isValidPhone(profile.contactNumber)) {
        throw new Error("Invalid phone number format");
      }

      // Validate age
      if (profile.age < 18 || profile.age > 100) {
        throw new Error("Invalid age. Must be between 18 and 100");
      }

      // Validate LinkedIn URL
      if (!this.isValidLinkedInUrl(profile.linkedinProfile)) {
        throw new Error("Invalid LinkedIn URL");
      }

      // Validate GitHub/Portfolio URL if provided
      if (
        profile.githubOrPortfolio &&
        !this.isValidUrl(profile.githubOrPortfolio)
      ) {
        throw new Error("Invalid GitHub/Portfolio URL");
      }

      // Create mentor profile with system defaults
      const mentorProfile: Omit<
        MentorProfile,
        "id" | "createdAt" | "updatedAt"
      > = {
        ...profile,
        role: UserRole.MENTOR,
        isEmailVerified: false,
        isProfileComplete: true,
        onboardingStep: 3, // Completed all 3 steps
        isVerified: false, // Requires admin verification
        isApproved: false, // Requires admin approval
        rating: 0,
        totalSessions: 0,
        displayName: profile.fullName,
        email: profile.emailAddress,
        uid: profile.uid || "",
        lastSignInAt: new Date(),
      };

      await this.create(mentorProfile);
    } catch (error) {
      console.error("Error registering mentor profile:", error);
      throw error;
    }
  }

  /**
   * Get mentor dashboard data including sessions and statistics
   * @param uid - Mentor's unique identifier
   * @returns Promise<MentorDashboardData>
   */
  async getMentorDashboard(uid: string): Promise<MentorDashboardData> {
    try {
      // Get mentor profile
      const mentor = await this.getById(uid);
      if (!mentor) {
        throw new Error("Mentor profile not found");
      }

      // Get upcoming sessions
      const upcomingSessions = await this.getUpcomingSessions(uid);

      // Get past sessions
      const pastSessions = await this.getPastSessions(uid);

      // Calculate dashboard statistics
      const totalStudents = this.calculateUniqueStudents(
        upcomingSessions,
        pastSessions
      );
      const totalEarnings = this.calculateTotalEarnings(pastSessions);
      const averageRating = this.calculateAverageRating(pastSessions);
      const sessionStats = this.calculateSessionStats(
        upcomingSessions,
        pastSessions
      );
      const earningsByMonth = this.calculateEarningsByMonth(pastSessions);
      const popularSubjects = this.calculatePopularSubjects(
        upcomingSessions,
        pastSessions
      );

      return {
        upcomingSessions,
        pastSessions,
        totalStudents,
        totalEarnings,
        averageRating,
        sessionStats,
        earningsByMonth,
        popularSubjects,
      };
    } catch (error) {
      console.error("Error getting mentor dashboard:", error);
      throw error;
    }
  }

  /**
   * Get mentors matching student preferences
   * @param student - Student profile with preferences
   * @returns Promise<MentorProfile[]>
   */
  async getMentorsMatchingStudentPreferences(
    student: StudentProfile
  ): Promise<MentorProfile[]> {
    try {
      const studentSubjects = student.subjectsOfInterest
        .split(",")
        .map((s) => s.trim());

      // Get all approved and verified mentors
      const mentors = await this.query([
        firebaseUtils.where("isApproved", firebaseUtils.operators.equal, true),
        firebaseUtils.where("isVerified", firebaseUtils.operators.equal, true),
      ]);

      // Filter mentors based on student preferences
      return mentors.filter((mentor) => {
        // Check subject compatibility
        const subjectMatch = mentor.teachingSubjects.some((subject) =>
          studentSubjects.some(
            (studentSubject) =>
              studentSubject.toLowerCase().includes(subject.toLowerCase()) ||
              subject.toLowerCase().includes(studentSubject.toLowerCase())
          )
        );

        // Check education level compatibility
        const levelMatch = mentor.preferredStudentLevels.some((level) => {
          switch (level) {
            case MentorEducationLevel.GRADE_3_5:
              return student.currentEducationLevel === "grade_9";
            case MentorEducationLevel.GRADE_6_9:
              return student.currentEducationLevel === "grade_9";
            case MentorEducationLevel.GRADE_10_11:
              return student.currentEducationLevel === "ordinary_level";
            case MentorEducationLevel.ADVANCED_LEVEL:
              return student.currentEducationLevel === "advanced_level";
            default:
              return false;
          }
        });

        return subjectMatch && levelMatch;
      });
    } catch (error) {
      console.error(
        "Error getting mentors matching student preferences:",
        error
      );
      throw error;
    }
  }

  /**
   * Get all sessions for a specific mentor
   * @param uid - Mentor's unique identifier
   * @returns Promise<MentorSession[]>
   */
  async getSessionsByMentor(uid: string): Promise<MentorSession[]> {
    try {
      const sessionService = new SessionService();
      return await sessionService.query([
        firebaseUtils.where("mentorId", firebaseUtils.operators.equal, uid),
        firebaseUtils.orderBy("sessionDate", "desc"),
      ]);
    } catch (error) {
      console.error("Error getting sessions by mentor:", error);
      throw error;
    }
  }

  /**
   * Get upcoming sessions for a mentor
   * @param uid - Mentor's unique identifier
   * @returns Promise<MentorSession[]>
   */
  async getUpcomingSessions(uid: string): Promise<MentorSession[]> {
    try {
      const sessionService = new SessionService();
      const now = new Date();

      return await sessionService.query([
        firebaseUtils.where("mentorId", firebaseUtils.operators.equal, uid),
        firebaseUtils.where("sessionDate", ">=", now),
        firebaseUtils.orderBy("sessionDate", "asc"),
      ]);
    } catch (error) {
      console.error("Error getting upcoming sessions:", error);
      throw error;
    }
  }

  /**
   * Get past sessions for a mentor
   * @param uid - Mentor's unique identifier
   * @returns Promise<MentorSession[]>
   */
  async getPastSessions(uid: string): Promise<MentorSession[]> {
    try {
      const sessionService = new SessionService();
      const now = new Date();

      return await sessionService.query([
        firebaseUtils.where("mentorId", firebaseUtils.operators.equal, uid),
        firebaseUtils.where("sessionDate", "<", now),
        firebaseUtils.orderBy("sessionDate", "desc"),
      ]);
    } catch (error) {
      console.error("Error getting past sessions:", error);
      throw error;
    }
  }

  /**
   * Update mentor profile
   * @param uid - Mentor's unique identifier
   * @param updates - Profile updates
   * @returns Promise<void>
   */
  async updateMentorProfile(
    uid: string,
    updates: Partial<MentorProfile>
  ): Promise<void> {
    try {
      await this.update(uid, updates);
    } catch (error) {
      console.error("Error updating mentor profile:", error);
      throw error;
    }
  }

  /**
   * Get mentor by email
   * @param email - Mentor's email address
   * @returns Promise<MentorProfile | null>
   */
  async getMentorByEmail(email: string): Promise<MentorProfile | null> {
    try {
      const mentors = await this.query([
        firebaseUtils.where(
          "emailAddress",
          firebaseUtils.operators.equal,
          email
        ),
      ]);
      return mentors.length > 0 ? mentors[0] : null;
    } catch (error) {
      console.error("Error getting mentor by email:", error);
      throw error;
    }
  }

  /**
   * Get approved and verified mentors
   * @returns Promise<MentorProfile[]>
   */
  async getApprovedMentors(): Promise<MentorProfile[]> {
    try {
      return await this.query([
        firebaseUtils.where("isApproved", firebaseUtils.operators.equal, true),
        firebaseUtils.where("isVerified", firebaseUtils.operators.equal, true),
        firebaseUtils.orderBy("rating", "desc"),
      ]);
    } catch (error) {
      console.error("Error getting approved mentors:", error);
      throw error;
    }
  }

  /**
   * Search mentors with filters
   * @param filters - Search filters
   * @returns Promise<MentorProfile[]>
   */
  async searchMentors(filters: {
    subjects?: string[];
    educationLevels?: MentorEducationLevel[];
    languages?: PreferredLanguage[];
    minRating?: number;
  }): Promise<MentorProfile[]> {
    try {
      let mentors = await this.getApprovedMentors();

      // Apply filters
      if (filters.subjects && filters.subjects.length > 0) {
        mentors = mentors.filter((mentor) =>
          mentor.teachingSubjects.some((subject) =>
            filters.subjects!.includes(subject)
          )
        );
      }

      if (filters.educationLevels && filters.educationLevels.length > 0) {
        mentors = mentors.filter((mentor) =>
          mentor.preferredStudentLevels.some((level) =>
            filters.educationLevels!.includes(level)
          )
        );
      }

      if (filters.languages && filters.languages.length > 0) {
        mentors = mentors.filter((mentor) =>
          filters.languages!.includes(mentor.preferredLanguage)
        );
      }

      if (filters.minRating) {
        mentors = mentors.filter(
          (mentor) => mentor.rating >= filters.minRating!
        );
      }

      return mentors;
    } catch (error) {
      console.error("Error searching mentors:", error);
      throw error;
    }
  }

  /**
   * Update mentor rating
   * @param uid - Mentor's unique identifier
   * @param newRating - New rating value
   * @returns Promise<void>
   */
  async updateMentorRating(uid: string, newRating: number): Promise<void> {
    try {
      const mentor = await this.getById(uid);
      if (!mentor) {
        throw new Error("Mentor not found");
      }

      // Calculate new average rating
      const totalSessions = mentor.totalSessions + 1;
      const newAverageRating =
        (mentor.rating * mentor.totalSessions + newRating) / totalSessions;

      await this.update(uid, {
        rating: newAverageRating,
        totalSessions,
      });
    } catch (error) {
      console.error("Error updating mentor rating:", error);
      throw error;
    }
  }

  // Helper methods

  /**
   * Validate LinkedIn URL
   * @param url - LinkedIn URL to validate
   * @returns boolean - True if valid LinkedIn URL
   */
  private isValidLinkedInUrl(url: string): boolean {
    const linkedInRegex =
      /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/;
    return linkedInRegex.test(url);
  }

  /**
   * Validate URL format
   * @param url - URL to validate
   * @returns boolean - True if valid URL
   */
  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Calculate unique students count
   * @param upcomingSessions - Upcoming sessions
   * @param pastSessions - Past sessions
   * @returns number - Unique students count
   */
  private calculateUniqueStudents(
    upcomingSessions: MentorSession[],
    pastSessions: MentorSession[]
  ): number {
    const allSessions = [...upcomingSessions, ...pastSessions];
    const uniqueStudents = new Set(
      allSessions.map((session) => session.studentId)
    );
    return uniqueStudents.size;
  }

  /**
   * Calculate total earnings from completed sessions
   * @param sessions - Array of past sessions
   * @returns number - Total earnings
   */
  private calculateTotalEarnings(sessions: MentorSession[]): number {
    // Assuming fixed rate per session (you can modify this based on your pricing model)
    const ratePerHour = 25; // $25 per hour
    return sessions
      .filter((session) => session.status === SessionStatus.COMPLETED)
      .reduce((total, session) => {
        return total + (session.duration / 60) * ratePerHour;
      }, 0);
  }

  /**
   * Calculate average rating from sessions with ratings
   * @param sessions - Array of past sessions
   * @returns number - Average rating
   */
  private calculateAverageRating(sessions: MentorSession[]): number {
    const sessionsWithRatings = sessions.filter(
      (session) => session.mentorRating
    );
    if (sessionsWithRatings.length === 0) return 0;

    const totalRating = sessionsWithRatings.reduce(
      (sum, session) => sum + (session.mentorRating || 0),
      0
    );
    return totalRating / sessionsWithRatings.length;
  }

  /**
   * Calculate session statistics
   * @param upcomingSessions - Upcoming sessions
   * @param pastSessions - Past sessions
   * @returns Session statistics object
   */
  private calculateSessionStats(
    upcomingSessions: MentorSession[],
    pastSessions: MentorSession[]
  ): {
    total: number;
    completed: number;
    cancelled: number;
    pending: number;
  } {
    const allSessions = [...upcomingSessions, ...pastSessions];

    return {
      total: allSessions.length,
      completed: allSessions.filter((s) => s.status === SessionStatus.COMPLETED)
        .length,
      cancelled: allSessions.filter((s) => s.status === SessionStatus.CANCELLED)
        .length,
      pending: allSessions.filter((s) => s.status === SessionStatus.PENDING)
        .length,
    };
  }

  /**
   * Calculate earnings by month
   * @param sessions - Array of past sessions
   * @returns Array of monthly earnings
   */
  private calculateEarningsByMonth(sessions: MentorSession[]): {
    month: string;
    amount: number;
  }[] {
    const monthlyEarnings: { [key: string]: number } = {};
    const ratePerHour = 25;

    sessions
      .filter((session) => session.status === SessionStatus.COMPLETED)
      .forEach((session) => {
        const month = dateUtils.formatDate(session.sessionDate, {
          year: "numeric",
          month: "short",
        });
        const earnings = (session.duration / 60) * ratePerHour;
        monthlyEarnings[month] = (monthlyEarnings[month] || 0) + earnings;
      });

    return Object.entries(monthlyEarnings)
      .map(([month, amount]) => ({ month, amount }))
      .sort(
        (a, b) => new Date(a.month).getTime() - new Date(b.month).getTime()
      );
  }

  /**
   * Calculate popular subjects
   * @param upcomingSessions - Upcoming sessions
   * @param pastSessions - Past sessions
   * @returns Array of popular subjects
   */
  private calculatePopularSubjects(
    upcomingSessions: MentorSession[],
    pastSessions: MentorSession[]
  ): {
    subject: string;
    sessions: number;
  }[] {
    const allSessions = [...upcomingSessions, ...pastSessions];
    const subjectCount: { [key: string]: number } = {};

    allSessions.forEach((session) => {
      subjectCount[session.subject] = (subjectCount[session.subject] || 0) + 1;
    });

    return Object.entries(subjectCount)
      .map(([subject, sessions]) => ({ subject, sessions }))
      .sort((a, b) => b.sessions - a.sessions)
      .slice(0, 5);
  }
}

// Export singleton instance
export const mentorService = new MentorService();
