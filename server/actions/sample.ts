"use server";

import { revalidatePath } from "next/cache";
import { StudentService } from "@/lib/services/studentService";
import { UserRole, StudentEducationLevel, LearningStyle, SkillLevel } from "@/lib/types/eduvibe";

// Firebase-compatible sample actions for EduVibe
// These can be used as templates for student/mentor actions

export async function addSample(formData: FormData) {
  const id = formData.get("id") as string;

  if (!id || !id.trim()) {
    return { error: "Sample ID is required" };
  }

  try {
    // TODO: Replace with Firebase Firestore operations
    // Example: await addDoc(collection(db, 'samples'), { id: id.trim() });

    console.log("Sample would be created with ID:", id.trim());

    revalidatePath("/");
    return { success: true, sample: { id: id.trim() } };
  } catch (error) {
    console.error("Error creating sample:", error);
    return { error: "Failed to create sample. ID might already exist." };
  }
}

export async function deleteSample(id: string) {
  try {
    // TODO: Replace with Firebase Firestore operations
    // Example: await deleteDoc(doc(db, 'samples', id));

    console.log("Sample would be deleted with ID:", id);

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting sample:", error);
    return { error: "Failed to delete sample" };
  }
}

// Example EduVibe-specific actions (templates)

export async function createStudentProfile(formData: FormData) {
  try {
    // Map frontend fields to backend StudentProfile fields
    const fullName = formData.get("fullName") as string;
    const age = Number(formData.get("age"));
    const email = formData.get("email") as string;
    const contactNumber = formData.get("contactNumber") as string;
    const educationLevel = formData.get("educationLevel") as string;
    const school = formData.get("school") as string;
    const subjectsOfInterest = formData.get("subjectsOfInterest") as string;
    const currentYear = Number(formData.get("currentYear"));
    const skillLevel = formData.get("skillLevel") as string;
    const learningStyle = formData.get("learningStyle") as string;
    const learningDisabilities = formData.get("learningDisabilities") as string;
    const learningDisabilitiesDescription = formData.get("learningDisabilitiesDescription") as string;
    const uid = formData.get("uid") as string;

    // Map to backend enums/fields
    const currentEducationLevel =
      educationLevel === "Grade 9"
        ? StudentEducationLevel.GRADE_9
        : educationLevel === "Ordinary Level"
        ? StudentEducationLevel.ORDINARY_LEVEL
        : StudentEducationLevel.ADVANCED_LEVEL;
    const preferredLearningStyle =
      learningStyle === "Visual"
        ? LearningStyle.VISUAL
        : learningStyle === "Hands-On"
        ? LearningStyle.HANDS_ON
        : learningStyle === "Theoretical"
        ? LearningStyle.THEORETICAL
        : LearningStyle.MIXED;
    const parsedSkillLevel =
      skillLevel === "Beginner"
        ? SkillLevel.BEGINNER
        : skillLevel === "Intermediate"
        ? SkillLevel.INTERMEDIATE
        : SkillLevel.ADVANCED;
    const hasLearningDisabilities = learningDisabilities === "Yes";

    // Compose subjectSkillLevels (all subjects get the same skill level for now)
    const subjectSkillLevels = subjectsOfInterest
      .split(",")
      .map((subject) => ({ subject: subject.trim(), skillLevel: parsedSkillLevel }));

    // Compose the profile object (omit id, createdAt, updatedAt, role, isEmailVerified, isProfileComplete, onboardingStep)
    const profile: any = {
      fullName,
      age,
      emailAddress: email,
      contactNumber,
      currentEducationLevel,
      school,
      subjectsOfInterest,
      currentYear,
      subjectSkillLevels,
      preferredLearningStyle,
      hasLearningDisabilities,
      email: email,
      displayName: fullName,
      uid: uid || "",
    };
    if (hasLearningDisabilities && learningDisabilitiesDescription) {
      profile.learningDisabilitiesDescription = learningDisabilitiesDescription;
    }

    const studentService = new StudentService();
    await studentService.registerStudentProfile(profile);
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error creating student profile:", error);
    return { error: (error as Error).message || "Failed to create student profile." };
  }
}

export async function createMentorProfile(formData: FormData) {
  try {
    // TODO: Implement mentor profile creation with Firebase
    // This would use the mentorService.registerMentorProfile()

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error creating mentor profile:", error);
    return { error: "Failed to create mentor profile." };
  }
}

export async function bookSession(formData: FormData) {
  try {
    // TODO: Implement session booking with Firebase
    // This would use the sessionService.createSession()

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error booking session:", error);
    return { error: "Failed to book session." };
  }
}
