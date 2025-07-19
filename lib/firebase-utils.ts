import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  DocumentData,
  QueryConstraint,
  FirestoreError,
  Timestamp,
  writeBatch,
  runTransaction,
  QuerySnapshot,
  DocumentSnapshot,
  setDoc,
} from "firebase/firestore";
import { db } from "./firebase";

// Enhanced Firebase service with EduVibe-specific functionality
export class FirebaseService<T extends DocumentData> {
  constructor(private collectionName: string) {}

  // Create a new document with automatic timestamps
  async create(
    data: Omit<T, "id" | "createdAt" | "updatedAt">
  ): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.collectionName), {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return docRef.id;
    } catch (error) {
      console.error(`Error creating ${this.collectionName}:`, error);
      throw error;
    }
  }

  // Create a new document with a specified ID
  async createWithId(
    id: string,
    data: Omit<T, "id" | "createdAt" | "updatedAt">
  ): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await setDoc(docRef, {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error(`Error creating ${this.collectionName} with ID:`, error);
      throw error;
    }
  }

  // Get a single document by ID
  async getById(id: string): Promise<T | null> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as unknown as T;
      }
      return null;
    } catch (error) {
      console.error(`Error getting ${this.collectionName} by ID:`, error);
      throw error;
    }
  }

  // Get all documents with optional constraints
  async getAll(constraints: QueryConstraint[] = []): Promise<T[]> {
    try {
      const q = query(collection(db, this.collectionName), ...constraints);
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as unknown as T[];
    } catch (error) {
      console.error(`Error getting all ${this.collectionName}:`, error);
      throw error;
    }
  }

  // Update a document
  async update(id: string, data: Partial<T>): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error(`Error updating ${this.collectionName}:`, error);
      throw error;
    }
  }

  // Delete a document
  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error(`Error deleting ${this.collectionName}:`, error);
      throw error;
    }
  }

  // Query documents with filters
  async query(constraints: QueryConstraint[]): Promise<T[]> {
    return this.getAll(constraints);
  }

  // Real-time listener for documents
  subscribeToCollection(
    constraints: QueryConstraint[] = [],
    callback: (data: T[]) => void,
    onError?: (error: FirestoreError) => void
  ): () => void {
    const q = query(collection(db, this.collectionName), ...constraints);

    return onSnapshot(
      q,
      (querySnapshot: QuerySnapshot) => {
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as unknown as T[];
        callback(data);
      },
      (error: FirestoreError) => {
        console.error(`Error listening to ${this.collectionName}:`, error);
        if (onError) onError(error);
      }
    );
  }

  // Real-time listener for a single document
  subscribeToDocument(
    id: string,
    callback: (data: T | null) => void,
    onError?: (error: FirestoreError) => void
  ): () => void {
    const docRef = doc(db, this.collectionName, id);

    return onSnapshot(
      docRef,
      (docSnapshot: DocumentSnapshot) => {
        if (docSnapshot.exists()) {
          const data = {
            id: docSnapshot.id,
            ...docSnapshot.data(),
          } as unknown as T;
          callback(data);
        } else {
          callback(null);
        }
      },
      (error: FirestoreError) => {
        console.error(
          `Error listening to ${this.collectionName} document:`,
          error
        );
        if (onError) onError(error);
      }
    );
  }

  // Batch operations
  async batchCreate(
    documents: Omit<T, "id" | "createdAt" | "updatedAt">[]
  ): Promise<string[]> {
    try {
      const batch = writeBatch(db);
      const docRefs: any[] = [];

      documents.forEach((docData) => {
        const docRef = doc(collection(db, this.collectionName));
        batch.set(docRef, {
          ...docData,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        docRefs.push(docRef);
      });

      await batch.commit();
      return docRefs.map((ref) => ref.id);
    } catch (error) {
      console.error(`Error batch creating ${this.collectionName}:`, error);
      throw error;
    }
  }

  async batchUpdate(
    updates: { id: string; data: Partial<T> }[]
  ): Promise<void> {
    try {
      const batch = writeBatch(db);

      updates.forEach(({ id, data }) => {
        const docRef = doc(db, this.collectionName, id);
        batch.update(docRef, {
          ...data,
          updatedAt: new Date(),
        });
      });

      await batch.commit();
    } catch (error) {
      console.error(`Error batch updating ${this.collectionName}:`, error);
      throw error;
    }
  }

  async batchDelete(ids: string[]): Promise<void> {
    try {
      const batch = writeBatch(db);

      ids.forEach((id) => {
        const docRef = doc(db, this.collectionName, id);
        batch.delete(docRef);
      });

      await batch.commit();
    } catch (error) {
      console.error(`Error batch deleting ${this.collectionName}:`, error);
      throw error;
    }
  }

  // Transaction operations
  async runTransaction<TResult>(
    updateFunction: (transaction: any) => Promise<TResult>
  ): Promise<TResult> {
    try {
      return await runTransaction(db, updateFunction);
    } catch (error) {
      console.error(
        `Error running transaction on ${this.collectionName}:`,
        error
      );
      throw error;
    }
  }
}

// Enhanced helper functions for common queries
export const firebaseUtils = {
  // Query by field
  where: (field: string, operator: any, value: any) =>
    where(field, operator, value),

  // Order by field
  orderBy: (field: string, direction: "asc" | "desc" = "asc") =>
    orderBy(field, direction),

  // Limit results
  limit: (count: number) => limit(count),

  // Common operators
  operators: {
    equal: "==",
    notEqual: "!=",
    lessThan: "<",
    lessThanOrEqual: "<=",
    greaterThan: ">",
    greaterThanOrEqual: ">=",
    arrayContains: "array-contains",
    arrayContainsAny: "array-contains-any",
    in: "in",
    notIn: "not-in",
  },

  // Date range queries
  dateRange: (field: string, startDate: Date, endDate: Date) => [
    where(field, ">=", startDate),
    where(field, "<=", endDate),
  ],

  // Array contains queries
  arrayContains: (field: string, value: any) =>
    where(field, "array-contains", value),

  // Array contains any queries
  arrayContainsAny: (field: string, values: any[]) =>
    where(field, "array-contains-any", values),

  // In queries
  in: (field: string, values: any[]) => where(field, "in", values),
};

// Enhanced error handling utility
export const handleFirebaseError = (error: FirestoreError): string => {
  switch (error.code) {
    case "permission-denied":
      return "You do not have permission to perform this action.";
    case "not-found":
      return "The requested resource was not found.";
    case "already-exists":
      return "The resource already exists.";
    case "resource-exhausted":
      return "The request was rejected due to resource exhaustion.";
    case "failed-precondition":
      return "The operation was rejected because the system is not in a state required for the operation's execution.";
    case "aborted":
      return "The operation was aborted.";
    case "out-of-range":
      return "The operation was attempted past the valid range.";
    case "unimplemented":
      return "The operation is not implemented or not supported/enabled.";
    case "internal":
      return "Internal errors.";
    case "unavailable":
      return "The service is currently unavailable.";
    case "data-loss":
      return "Unrecoverable data loss or corruption.";
    case "unauthenticated":
      return "The request does not have valid authentication credentials.";
    case "invalid-argument":
      return "The request contains an invalid argument.";
    case "deadline-exceeded":
      return "The request deadline was exceeded.";
    case "cancelled":
      return "The operation was cancelled.";
    default:
      return `An unexpected error occurred: ${error.message}`;
  }
};

// Utility functions for date handling
export const dateUtils = {
  // Convert Firestore Timestamp to Date
  fromFirestore: (timestamp: any): Date => {
    if (timestamp instanceof Timestamp) {
      return timestamp.toDate();
    }
    if (timestamp instanceof Date) {
      return timestamp;
    }
    if (typeof timestamp === "string") {
      return new Date(timestamp);
    }
    return new Date();
  },

  // Convert Date to Firestore Timestamp
  toFirestore: (date: Date): Timestamp => {
    return Timestamp.fromDate(date);
  },

  // Check if date is today
  isToday: (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  },

  // Check if date is in the future
  isFuture: (date: Date): boolean => {
    return date > new Date();
  },

  // Check if date is in the past
  isPast: (date: Date): boolean => {
    return date < new Date();
  },

  // Format date for display
  formatDate: (date: Date, options?: Intl.DateTimeFormatOptions): string => {
    return date.toLocaleDateString("en-US", options);
  },

  // Format time for display
  formatTime: (date: Date, options?: Intl.DateTimeFormatOptions): string => {
    return date.toLocaleTimeString("en-US", options);
  },
};

// Utility functions for data validation
export const validationUtils = {
  // Validate email format
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validate phone number format
  isValidPhone: (phone: string): boolean => {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  },

  // Validate required fields
  validateRequired: (data: any, requiredFields: string[]): string[] => {
    const missingFields: string[] = [];
    requiredFields.forEach((field) => {
      if (
        !data[field] ||
        (typeof data[field] === "string" && data[field].trim() === "")
      ) {
        missingFields.push(field);
      }
    });
    return missingFields;
  },

  // Sanitize string input
  sanitizeString: (input: string): string => {
    return input.trim().replace(/[<>]/g, "");
  },
};
