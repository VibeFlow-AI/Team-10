import {
  FirebaseService,
  firebaseUtils,
  dateUtils,
  validationUtils,
} from "../firebase-utils";
import {
  StudentProfile,
  MentorProfile,
  MentorSession,
  StudentDashboardData,
  SubjectSkillLevel,
  SkillLevel,
  StudentEducationLevel,
  SessionStatus,
  PaymentStatus,
  UserRole,
} from "../types/eduvibe";
import { MentorService } from "./mentorService";
import { SessionService } from "./sessionService";

/**
 * Student Service - Handles all student-related operations
 * Manages student profiles, bookings, and dashboard data
 */
export class StudentService extends FirebaseService<StudentProfile> {
  constructor() {
    super("students");
  }

  /**
   * Register a new student profile with multi-step onboarding data
   * @param profile - Complete student profile data from onboarding forms
   * @returns Promise<void>
   */
  async registerStudentProfile(
    profile: Omit<
      StudentProfile,
      | "id"
      | "createdAt"
      | "updatedAt"
      | "role"
      | "isEmailVerified"
      | "isProfileComplete"
      | "onboardingStep"
    >
  ): Promise<void> {
    try {
      // Validate required fields
      const requiredFields = [
        "fullName",
        "age",
        "emailAddress",
        "contactNumber",
        "currentEducationLevel",
        "school",
        "subjectsOfInterest",
        "currentYear",
        "preferredLearningStyle",
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
      if (profile.age < 5 || profile.age > 100) {
        throw new Error("Invalid age. Must be between 5 and 100");
      }

      // Create student profile with system defaults
      const studentProfile: Omit<
        StudentProfile,
        "id" | "createdAt" | "updatedAt"
      > = {
        ...profile,
        role: UserRole.STUDENT,
        isEmailVerified: false,
        isProfileComplete: true,
        onboardingStep: 3, // Completed all 3 steps
        displayName: profile.fullName,
        email: profile.emailAddress,
        uid: profile.uid || "",
        lastSignInAt: new Date(),
      };

      await this.create(studentProfile);
    } catch (error) {
      console.error("Error registering student profile:", error);
      throw error;
    }
  }

  /**
   * Get student dashboard data including sessions and available mentors
   * @param uid - Student's unique identifier
   * @returns Promise<StudentDashboardData>
   */
  async getStudentDashboard(uid: string): Promise<StudentDashboardData> {
    try {
      // Get student profile
      const student = await this.getById(uid);
      if (!student) {
        throw new Error("Student profile not found");
      }

      // Get upcoming sessions
      const upcomingSessions = await this.getUpcomingSessions(uid);

      // Get past sessions
      const pastSessions = await this.getPastSessions(uid);

      // Get available mentors based on student preferences
      const availableMentors = await this.getAvailableMentors(student);

      // Calculate dashboard statistics
      const totalSessions = upcomingSessions.length + pastSessions.length;
      const totalSpent = this.calculateTotalSpent(pastSessions);
      const favoriteSubjects = this.extractFavoriteSubjects(pastSessions);
      const learningProgress = this.calculateLearningProgress(pastSessions);

      return {
        upcomingSessions,
        pastSessions,
        availableMentors,
        totalSessions,
        totalSpent,
        favoriteSubjects,
        learningProgress,
      };
    } catch (error) {
      console.error("Error getting student dashboard:", error);
      throw error;
    }
  }

  /**
   * Book a mentor session with bank slip upload
   * @param studentId - Student's unique identifier
   * @param mentorId - Mentor's unique identifier
   * @param dateTime - Session date and time
   * @param slipUrl - URL to uploaded bank slip
   * @returns Promise<void>
   */
  async bookMentorSession(
    studentId: string,
    mentorId: string,
    dateTime: string,
    slipUrl: string
  ): Promise<void> {
    try {
      // Validate inputs
      if (!studentId || !mentorId || !dateTime || !slipUrl) {
        throw new Error("All parameters are required");
      }

      // Check mentor availability
      const isAvailable = await this.checkMentorAvailability(
        mentorId,
        dateTime
      );
      if (!isAvailable) {
        throw new Error("Mentor is not available at the selected time");
      }

      // Get student and mentor profiles by uid field
      const students = await this.query([
        firebaseUtils.where('uid', firebaseUtils.operators.equal, studentId)
      ]);
      const student = students[0] || null;
      const mentorService = new MentorService();
      const mentors = await mentorService.query([
        firebaseUtils.where('uid', firebaseUtils.operators.equal, mentorId)
      ]);
      const mentor = mentors[0] || null;

      if (!student || !mentor) {
        throw new Error("Student or mentor profile not found");
      }

      // Create session (2 hours duration)
      const sessionDate = new Date(dateTime);
      const startTime = dateUtils.formatTime(sessionDate, {
        hour: "2-digit",
        minute: "2-digit",
      });
      const endTime = this.calculateEndTime(startTime, 120); // 2 hours = 120 minutes

      const sessionData: Omit<MentorSession, "id" | "createdAt" | "updatedAt"> =
        {
          studentId,
          mentorId,
          subject:
            student.subjectsOfInterest.split(",")[0]?.trim() || "General",
          educationLevel: student.currentEducationLevel,
          sessionDate,
          startTime,
          endTime,
          duration: 120,
          status: SessionStatus.PENDING,
          paymentStatus: PaymentStatus.PENDING,
          bankSlipUrl: slipUrl,
        };

      const sessionService = new SessionService();
      await sessionService.create(sessionData);
    } catch (error) {
      console.error("Error booking mentor session:", error);
      throw error;
    }
  }

  /**
   * Get all sessions booked by a specific student
   * @param uid - Student's unique identifier
   * @returns Promise<MentorSession[]>
   */
  async getBookedSessionsByStudent(uid: string): Promise<MentorSession[]> {
    try {
      const sessionService = new SessionService();
      return await sessionService.query([
        firebaseUtils.where("studentId", firebaseUtils.operators.equal, uid),
        firebaseUtils.orderBy("sessionDate", "desc"),
      ]);
    } catch (error) {
      console.error("Error getting booked sessions by student:", error);
      throw error;
    }
  }

  /**
   * Get upcoming sessions for a student
   * @param uid - Student's unique identifier
   * @returns Promise<MentorSession[]>
   */
  async getUpcomingSessions(uid: string): Promise<MentorSession[]> {
    try {
      const sessionService = new SessionService();
      const now = new Date();

      return await sessionService.query([
        firebaseUtils.where("studentId", firebaseUtils.operators.equal, uid),
        firebaseUtils.where("sessionDate", ">=", now),
        firebaseUtils.orderBy("sessionDate", "asc"),
      ]);
    } catch (error) {
      console.error("Error getting upcoming sessions:", error);
      throw error;
    }
  }

  /**
   * Get past sessions for a student
   * @param uid - Student's unique identifier
   * @returns Promise<MentorSession[]>
   */
  async getPastSessions(uid: string): Promise<MentorSession[]> {
    try {
      const sessionService = new SessionService();
      const now = new Date();

      return await sessionService.query([
        firebaseUtils.where("studentId", firebaseUtils.operators.equal, uid),
        firebaseUtils.where("sessionDate", "<", now),
        firebaseUtils.orderBy("sessionDate", "desc"),
      ]);
    } catch (error) {
      console.error("Error getting past sessions:", error);
      throw error;
    }
  }

  /**
   * Get available mentors based on student preferences
   * @param student - Student profile
   * @returns Promise<MentorProfile[]>
   */
  async getAvailableMentors(student: StudentProfile): Promise<MentorProfile[]> {
    try {
      const mentorService = new MentorService();
      const studentSubjects = student.subjectsOfInterest
        .split(",")
        .map((s) => s.trim());

      // Get mentors who teach the student's subjects
      const mentors = await mentorService.query([
        firebaseUtils.where("isApproved", firebaseUtils.operators.equal, true),
        firebaseUtils.where("isVerified", firebaseUtils.operators.equal, true),
      ]);

      // Filter mentors based on subject compatibility
      return mentors.filter((mentor) =>
        mentor.teachingSubjects.some((subject) =>
          studentSubjects.some(
            (studentSubject) =>
              studentSubject.toLowerCase().includes(subject.toLowerCase()) ||
              subject.toLowerCase().includes(studentSubject.toLowerCase())
          )
        )
      );
    } catch (error) {
      console.error("Error getting available mentors:", error);
      throw error;
    }
  }

  /**
   * Check if mentor is available at specified time
   * @param mentorId - Mentor's unique identifier
   * @param dateTime - Date and time to check
   * @returns Promise<boolean>
   */
  async checkMentorAvailability(
    mentorId: string,
    dateTime: string
  ): Promise<boolean> {
    try {
      const sessionService = new SessionService();
      const sessionDate = new Date(dateTime);
      const startTime = dateUtils.formatTime(sessionDate, {
        hour: "2-digit",
        minute: "2-digit",
      });
      const endTime = this.calculateEndTime(startTime, 120);

      // Check for conflicting sessions
      const conflictingSessions = await sessionService.query([
        firebaseUtils.where(
          "mentorId",
          firebaseUtils.operators.equal,
          mentorId
        ),
        firebaseUtils.where("sessionDate", "==", sessionDate),
        firebaseUtils.where("status", "in", [
          SessionStatus.PENDING,
          SessionStatus.CONFIRMED,
        ]),
      ]);

      // Check for time conflicts
      const hasConflict = conflictingSessions.some((session) => {
        const sessionStart = session.startTime;
        const sessionEnd = session.endTime;
        return (
          (startTime >= sessionStart && startTime < sessionEnd) ||
          (endTime > sessionStart && endTime <= sessionEnd) ||
          (startTime <= sessionStart && endTime >= sessionEnd)
        );
      });

      return !hasConflict;
    } catch (error) {
      console.error("Error checking mentor availability:", error);
      throw error;
    }
  }

  /**
   * Update student profile
   * @param uid - Student's unique identifier
   * @param updates - Profile updates
   * @returns Promise<void>
   */
  async updateStudentProfile(
    uid: string,
    updates: Partial<StudentProfile>
  ): Promise<void> {
    try {
      await this.update(uid, updates);
    } catch (error) {
      console.error("Error updating student profile:", error);
      throw error;
    }
  }

  /**
   * Get student by email
   * @param email - Student's email address
   * @returns Promise<StudentProfile | null>
   */
  async getStudentByEmail(email: string): Promise<StudentProfile | null> {
    try {
      const students = await this.query([
        firebaseUtils.where(
          "emailAddress",
          firebaseUtils.operators.equal,
          email
        ),
      ]);
      return students.length > 0 ? students[0] : null;
    } catch (error) {
      console.error("Error getting student by email:", error);
      throw error;
    }
  }

  // Helper methods

  /**
   * Calculate end time based on start time and duration
   * @param startTime - Start time in HH:MM format
   * @param durationMinutes - Duration in minutes
   * @returns string - End time in HH:MM format
   */
  private calculateEndTime(startTime: string, durationMinutes: number): string {
    const [hours, minutes] = startTime.split(":").map(Number);
    const startDate = new Date();
    startDate.setHours(hours, minutes, 0, 0);

    const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
    return dateUtils.formatTime(endDate, {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  /**
   * Calculate total amount spent on sessions
   * @param sessions - Array of completed sessions
   * @returns number - Total amount spent
   */
  private calculateTotalSpent(sessions: MentorSession[]): number {
    // Assuming fixed rate per session (you can modify this based on your pricing model)
    const ratePerHour = 25; // $25 per hour
    return sessions.reduce((total, session) => {
      return total + (session.duration / 60) * ratePerHour;
    }, 0);
  }

  /**
   * Extract favorite subjects from session history
   * @param sessions - Array of past sessions
   * @returns string[] - Array of favorite subjects
   */
  private extractFavoriteSubjects(sessions: MentorSession[]): string[] {
    const subjectCount: { [key: string]: number } = {};

    sessions.forEach((session) => {
      subjectCount[session.subject] = (subjectCount[session.subject] || 0) + 1;
    });

    return Object.entries(subjectCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([subject]) => subject);
  }

  /**
   * Calculate learning progress by subject
   * @param sessions - Array of past sessions
   * @returns Array of learning progress objects
   */
  private calculateLearningProgress(sessions: MentorSession[]): {
    subject: string;
    sessionsCompleted: number;
    averageRating: number;
  }[] {
    const progress: { [key: string]: { sessions: number; ratings: number[] } } =
      {};

    sessions.forEach((session) => {
      if (!progress[session.subject]) {
        progress[session.subject] = { sessions: 0, ratings: [] };
      }
      progress[session.subject].sessions++;
      if (session.studentRating) {
        progress[session.subject].ratings.push(session.studentRating);
      }
    });

    return Object.entries(progress).map(([subject, data]) => ({
      subject,
      sessionsCompleted: data.sessions,
      averageRating:
        data.ratings.length > 0
          ? data.ratings.reduce((a, b) => a + b, 0) / data.ratings.length
          : 0,
    }));
  }
}

// Export singleton instance
export const studentService = new StudentService();
