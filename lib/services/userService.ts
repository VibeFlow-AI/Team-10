import { FirebaseService, firebaseUtils } from "../firebase-utils";
import { User } from "../types/firebase";

export class UserService extends FirebaseService<User> {
  constructor() {
    super("users");
  }

  // Get user by email
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const users = await this.query([
        firebaseUtils.where("email", firebaseUtils.operators.equal, email),
      ]);
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      console.error("Error getting user by email:", error);
      throw error;
    }
  }

  // Get users by role
  async getUsersByRole(role: "user" | "admin"): Promise<User[]> {
    try {
      return await this.query([
        firebaseUtils.where("role", firebaseUtils.operators.equal, role),
        firebaseUtils.orderBy("createdAt", "desc"),
      ]);
    } catch (error) {
      console.error("Error getting users by role:", error);
      throw error;
    }
  }

  // Get recent users
  async getRecentUsers(limit: number = 10): Promise<User[]> {
    try {
      return await this.query([
        firebaseUtils.orderBy("createdAt", "desc"),
        firebaseUtils.limit(limit),
      ]);
    } catch (error) {
      console.error("Error getting recent users:", error);
      throw error;
    }
  }

  // Update user role
  async updateUserRole(userId: string, role: "user" | "admin"): Promise<void> {
    try {
      await this.update(userId, { role, updatedAt: new Date() });
    } catch (error) {
      console.error("Error updating user role:", error);
      throw error;
    }
  }

  // Search users by display name
  async searchUsersByName(searchTerm: string): Promise<User[]> {
    try {
      // Note: Firestore doesn't support full-text search natively
      // This is a simple prefix search - consider using Algolia or similar for better search
      const users = await this.getAll();
      return users.filter((user) =>
        user.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } catch (error) {
      console.error("Error searching users:", error);
      throw error;
    }
  }

  // Get user statistics
  async getUserStats(): Promise<{
    totalUsers: number;
    activeUsers: number;
    adminUsers: number;
  }> {
    try {
      const allUsers = await this.getAll();
      const activeUsers = allUsers.filter(
        (user) =>
          user.lastSignInAt &&
          new Date(user.lastSignInAt) >
            new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
      );
      const adminUsers = allUsers.filter((user) => user.role === "admin");

      return {
        totalUsers: allUsers.length,
        activeUsers: activeUsers.length,
        adminUsers: adminUsers.length,
      };
    } catch (error) {
      console.error("Error getting user stats:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const userService = new UserService();
