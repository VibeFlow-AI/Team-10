import {
  FirebaseService,
  firebaseUtils,
  dateUtils,
  validationUtils,
} from "../firebase-utils";
import {
  MentorSession,
  SessionStatus,
  PaymentStatus,
  StudentProfile,
  MentorProfile,
} from "../types/eduvibe";

/**
 * Session Service - Handles all session-related operations
 * Manages booking, scheduling, and session lifecycle
 */
export class SessionService extends FirebaseService<MentorSession> {
  constructor() {
    super("sessions");
  }

  /**
   * Create a new session booking
   * @param sessionData - Session data without system fields
   * @returns Promise<string> - Session ID
   */
  async createSession(
    sessionData: Omit<MentorSession, "id" | "createdAt" | "updatedAt">
  ): Promise<string> {
    try {
      // Validate required fields
      const requiredFields = [
        "studentId",
        "mentorId",
        "subject",
        "educationLevel",
        "sessionDate",
        "startTime",
        "endTime",
        "duration",
      ];
      const missingFields = validationUtils.validateRequired(
        sessionData,
        requiredFields
      );

      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
      }

      // Validate session date is in the future
      if (dateUtils.isPast(sessionData.sessionDate)) {
        throw new Error("Session date must be in the future");
      }

      // Validate session duration (2 hours = 120 minutes)
      if (sessionData.duration !== 120) {
        throw new Error(
          "Session duration must be exactly 2 hours (120 minutes)"
        );
      }

      // Check for double booking
      const isAvailable = await this.checkMentorAvailability(
        sessionData.mentorId,
        sessionData.sessionDate,
        sessionData.startTime,
        sessionData.endTime
      );

      if (!isAvailable) {
        throw new Error("Mentor is not available at the selected time");
      }

      // Create session with default status
      const session: Omit<MentorSession, "id" | "createdAt" | "updatedAt"> = {
        ...sessionData,
        status: SessionStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
      };

      return await this.create(session);
    } catch (error) {
      console.error("Error creating session:", error);
      throw error;
    }
  }

  /**
   * Confirm a session after payment verification
   * @param sessionId - Session ID
   * @param bankSlipUrl - URL to bank slip
   * @returns Promise<void>
   */
  async confirmSession(sessionId: string, bankSlipUrl: string): Promise<void> {
    try {
      const session = await this.getById(sessionId);
      if (!session) {
        throw new Error("Session not found");
      }

      if (session.status !== SessionStatus.PENDING) {
        throw new Error("Session is not in pending status");
      }

      await this.update(sessionId, {
        status: SessionStatus.CONFIRMED,
        paymentStatus: PaymentStatus.CONFIRMED,
        bankSlipUrl,
        confirmedAt: new Date(),
      });
    } catch (error) {
      console.error("Error confirming session:", error);
      throw error;
    }
  }

  /**
   * Complete a session
   * @param sessionId - Session ID
   * @returns Promise<void>
   */
  async completeSession(sessionId: string): Promise<void> {
    try {
      const session = await this.getById(sessionId);
      if (!session) {
        throw new Error("Session not found");
      }

      if (session.status !== SessionStatus.CONFIRMED) {
        throw new Error("Session must be confirmed before completion");
      }

      await this.update(sessionId, {
        status: SessionStatus.COMPLETED,
        completedAt: new Date(),
      });
    } catch (error) {
      console.error("Error completing session:", error);
      throw error;
    }
  }

  /**
   * Cancel a session
   * @param sessionId - Session ID
   * @param cancelledBy - User ID who cancelled
   * @param reason - Cancellation reason
   * @returns Promise<void>
   */
  async cancelSession(
    sessionId: string,
    cancelledBy: string,
    reason?: string
  ): Promise<void> {
    try {
      const session = await this.getById(sessionId);
      if (!session) {
        throw new Error("Session not found");
      }

      if (session.status === SessionStatus.COMPLETED) {
        throw new Error("Cannot cancel completed session");
      }

      await this.update(sessionId, {
        status: SessionStatus.CANCELLED,
        cancelledAt: new Date(),
        cancelledBy,
        cancellationReason: reason,
      });
    } catch (error) {
      console.error("Error cancelling session:", error);
      throw error;
    }
  }

  /**
   * Mark session as no-show
   * @param sessionId - Session ID
   * @returns Promise<void>
   */
  async markSessionAsNoShow(sessionId: string): Promise<void> {
    try {
      const session = await this.getById(sessionId);
      if (!session) {
        throw new Error("Session not found");
      }

      if (session.status !== SessionStatus.CONFIRMED) {
        throw new Error("Session must be confirmed to mark as no-show");
      }

      await this.update(sessionId, {
        status: SessionStatus.NO_SHOW,
      });
    } catch (error) {
      console.error("Error marking session as no-show:", error);
      throw error;
    }
  }

  /**
   * Add student feedback to session
   * @param sessionId - Session ID
   * @param rating - Student rating (1-5)
   * @param feedback - Student feedback text
   * @returns Promise<void>
   */
  async addStudentFeedback(
    sessionId: string,
    rating: number,
    feedback?: string
  ): Promise<void> {
    try {
      if (rating < 1 || rating > 5) {
        throw new Error("Rating must be between 1 and 5");
      }

      const session = await this.getById(sessionId);
      if (!session) {
        throw new Error("Session not found");
      }

      if (session.status !== SessionStatus.COMPLETED) {
        throw new Error("Session must be completed to add feedback");
      }

      await this.update(sessionId, {
        studentRating: rating,
        studentFeedback: feedback,
      });

      // Update mentor rating
      const mentorService = new (
        await import("./mentorService")
      ).MentorService();
      await mentorService.updateMentorRating(session.mentorId, rating);
    } catch (error) {
      console.error("Error adding student feedback:", error);
      throw error;
    }
  }

  /**
   * Add mentor feedback to session
   * @param sessionId - Session ID
   * @param rating - Mentor rating (1-5)
   * @param feedback - Mentor feedback text
   * @returns Promise<void>
   */
  async addMentorFeedback(
    sessionId: string,
    rating: number,
    feedback?: string
  ): Promise<void> {
    try {
      if (rating < 1 || rating > 5) {
        throw new Error("Rating must be between 1 and 5");
      }

      const session = await this.getById(sessionId);
      if (!session) {
        throw new Error("Session not found");
      }

      if (session.status !== SessionStatus.COMPLETED) {
        throw new Error("Session must be completed to add feedback");
      }

      await this.update(sessionId, {
        mentorRating: rating,
        mentorFeedback: feedback,
      });
    } catch (error) {
      console.error("Error adding mentor feedback:", error);
      throw error;
    }
  }

  /**
   * Get sessions by status
   * @param status - Session status
   * @returns Promise<MentorSession[]>
   */
  async getSessionsByStatus(status: SessionStatus): Promise<MentorSession[]> {
    try {
      return await this.query([
        firebaseUtils.where("status", firebaseUtils.operators.equal, status),
        firebaseUtils.orderBy("sessionDate", "asc"),
      ]);
    } catch (error) {
      console.error("Error getting sessions by status:", error);
      throw error;
    }
  }

  /**
   * Get sessions by date range
   * @param startDate - Start date
   * @param endDate - End date
   * @returns Promise<MentorSession[]>
   */
  async getSessionsByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<MentorSession[]> {
    try {
      return await this.query([
        firebaseUtils.where("sessionDate", ">=", startDate),
        firebaseUtils.where("sessionDate", "<=", endDate),
        firebaseUtils.orderBy("sessionDate", "asc"),
      ]);
    } catch (error) {
      console.error("Error getting sessions by date range:", error);
      throw error;
    }
  }

  /**
   * Get sessions by mentor and date
   * @param mentorId - Mentor ID
   * @param date - Session date
   * @returns Promise<MentorSession[]>
   */
  async getSessionsByMentorAndDate(
    mentorId: string,
    date: Date
  ): Promise<MentorSession[]> {
    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      return await this.query([
        firebaseUtils.where(
          "mentorId",
          firebaseUtils.operators.equal,
          mentorId
        ),
        firebaseUtils.where("sessionDate", ">=", startOfDay),
        firebaseUtils.where("sessionDate", "<=", endOfDay),
        firebaseUtils.orderBy("startTime", "asc"),
      ]);
    } catch (error) {
      console.error("Error getting sessions by mentor and date:", error);
      throw error;
    }
  }

  /**
   * Get sessions by student and date
   * @param studentId - Student ID
   * @param date - Session date
   * @returns Promise<MentorSession[]>
   */
  async getSessionsByStudentAndDate(
    studentId: string,
    date: Date
  ): Promise<MentorSession[]> {
    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      return await this.query([
        firebaseUtils.where(
          "studentId",
          firebaseUtils.operators.equal,
          studentId
        ),
        firebaseUtils.where("sessionDate", ">=", startOfDay),
        firebaseUtils.where("sessionDate", "<=", endOfDay),
        firebaseUtils.orderBy("startTime", "asc"),
      ]);
    } catch (error) {
      console.error("Error getting sessions by student and date:", error);
      throw error;
    }
  }

  /**
   * Get upcoming sessions for a user (student or mentor)
   * @param userId - User ID
   * @param userType - 'student' or 'mentor'
   * @returns Promise<MentorSession[]>
   */
  async getUpcomingSessions(
    userId: string,
    userType: "student" | "mentor"
  ): Promise<MentorSession[]> {
    try {
      const field = userType === "student" ? "studentId" : "mentorId";
      const now = new Date();

      return await this.query([
        firebaseUtils.where(field, firebaseUtils.operators.equal, userId),
        firebaseUtils.where("sessionDate", ">=", now),
        firebaseUtils.where("status", "in", [
          SessionStatus.PENDING,
          SessionStatus.CONFIRMED,
        ]),
        firebaseUtils.orderBy("sessionDate", "asc"),
      ]);
    } catch (error) {
      console.error("Error getting upcoming sessions:", error);
      throw error;
    }
  }

  /**
   * Get past sessions for a user (student or mentor)
   * @param userId - User ID
   * @param userType - 'student' or 'mentor'
   * @returns Promise<MentorSession[]>
   */
  async getPastSessions(
    userId: string,
    userType: "student" | "mentor"
  ): Promise<MentorSession[]> {
    try {
      const field = userType === "student" ? "studentId" : "mentorId";
      const now = new Date();

      return await this.query([
        firebaseUtils.where(field, firebaseUtils.operators.equal, userId),
        firebaseUtils.where("sessionDate", "<", now),
        firebaseUtils.orderBy("sessionDate", "desc"),
      ]);
    } catch (error) {
      console.error("Error getting past sessions:", error);
      throw error;
    }
  }

  /**
   * Check mentor availability for a specific time slot
   * @param mentorId - Mentor ID
   * @param date - Session date
   * @param startTime - Start time
   * @param endTime - End time
   * @returns Promise<boolean> - True if available
   */
  async checkMentorAvailability(
    mentorId: string,
    date: Date,
    startTime: string,
    endTime: string
  ): Promise<boolean> {
    try {
      // Get all sessions for the mentor on the specified date
      const sessions = await this.getSessionsByMentorAndDate(mentorId, date);

      // Check for time conflicts
      const hasConflict = sessions.some((session) => {
        if (
          session.status === SessionStatus.CANCELLED ||
          session.status === SessionStatus.NO_SHOW
        ) {
          return false; // Cancelled sessions don't block the time slot
        }

        const sessionStart = session.startTime;
        const sessionEnd = session.endTime;

        // Check for overlap
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
   * Get session statistics
   * @param userId - User ID
   * @param userType - 'student' or 'mentor'
   * @returns Promise<Session statistics>
   */
  async getSessionStatistics(
    userId: string,
    userType: "student" | "mentor"
  ): Promise<{
    total: number;
    completed: number;
    cancelled: number;
    pending: number;
    noShow: number;
  }> {
    try {
      const field = userType === "student" ? "studentId" : "mentorId";
      const sessions = await this.query([
        firebaseUtils.where(field, firebaseUtils.operators.equal, userId),
      ]);

      return {
        total: sessions.length,
        completed: sessions.filter((s) => s.status === SessionStatus.COMPLETED)
          .length,
        cancelled: sessions.filter((s) => s.status === SessionStatus.CANCELLED)
          .length,
        pending: sessions.filter((s) => s.status === SessionStatus.PENDING)
          .length,
        noShow: sessions.filter((s) => s.status === SessionStatus.NO_SHOW)
          .length,
      };
    } catch (error) {
      console.error("Error getting session statistics:", error);
      throw error;
    }
  }

  /**
   * Get sessions with student and mentor details
   * @param sessionId - Session ID
   * @returns Promise<Session with user details>
   */
  async getSessionWithDetails(sessionId: string): Promise<
    MentorSession & {
      student?: StudentProfile;
      mentor?: MentorProfile;
    }
  > {
    try {
      const session = await this.getById(sessionId);
      if (!session) {
        throw new Error("Session not found");
      }

      // Get student and mentor details
      const studentService = new (
        await import("./studentService")
      ).StudentService();
      const mentorService = new (
        await import("./mentorService")
      ).MentorService();

      const [student, mentor] = await Promise.all([
        studentService.getById(session.studentId),
        mentorService.getById(session.mentorId),
      ]);

      return {
        ...session,
        student,
        mentor,
      };
    } catch (error) {
      console.error("Error getting session with details:", error);
      throw error;
    }
  }

  /**
   * Real-time listener for session updates
   * @param sessionId - Session ID
   * @param callback - Callback function
   * @returns Unsubscribe function
   */
  subscribeToSession(
    sessionId: string,
    callback: (session: MentorSession | null) => void
  ): () => void {
    return this.subscribeToDocument(sessionId, callback);
  }

  /**
   * Real-time listener for user sessions
   * @param userId - User ID
   * @param userType - 'student' or 'mentor'
   * @param callback - Callback function
   * @returns Unsubscribe function
   */
  subscribeToUserSessions(
    userId: string,
    userType: "student" | "mentor",
    callback: (sessions: MentorSession[]) => void
  ): () => void {
    const field = userType === "student" ? "studentId" : "mentorId";

    return this.subscribeToCollection(
      [
        firebaseUtils.where(field, firebaseUtils.operators.equal, userId),
        firebaseUtils.orderBy("sessionDate", "desc"),
      ],
      callback
    );
  }
}

// Export singleton instance
export const sessionService = new SessionService();
