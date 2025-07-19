"use server";

import { mentorService } from "@/lib/services/mentorService";
import { AuthService } from "@/lib/auth";
import {
  MentorEducationLevel,
  TeachingExperience,
  PreferredLanguage,
} from "@/lib/types/eduvibe";
import { revalidatePath } from "next/cache";

export async function registerMentor(formData: FormData) {
  try {
    // Get current authenticated user
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) {
      return {
        success: false,
        error: "You must be logged in to register as a mentor.",
      };
    }

    // Extract form data
    const fullName = formData.get("fullName") as string;
    const age = parseInt(formData.get("age") as string);
    const email = formData.get("email") as string;
    const contactNumber = formData.get("contactNumber") as string;
    const preferredLanguage = formData.get("preferredLanguage") as string;
    const currentLocation = formData.get("currentLocation") as string;
    const shortBio = formData.get("shortBio") as string;
    const professionalRole = formData.get("professionalRole") as string;
    const subjectsToTeach = formData.get("subjectsToTeach") as string;
    const experience = formData.get("experience") as string;
    const preferredStudentLevels = formData.getAll(
      "preferredStudentLevels"
    ) as string[];
    const linkedinProfile = formData.get("linkedinProfile") as string;
    const githubPortfolio = formData.get("githubPortfolio") as string;

    // Validate required fields
    if (
      !fullName ||
      !age ||
      !email ||
      !contactNumber ||
      !preferredLanguage ||
      !currentLocation ||
      !shortBio ||
      !professionalRole ||
      !subjectsToTeach ||
      !experience ||
      !preferredStudentLevels.length ||
      !linkedinProfile
    ) {
      return { success: false, error: "All required fields must be filled." };
    }

    // Validate age
    if (age < 18 || age > 100) {
      return { success: false, error: "Age must be between 18 and 100." };
    }

    // Validate email matches current user
    if (email !== currentUser.email) {
      return {
        success: false,
        error: "Email must match your registered email address.",
      };
    }

    // Check if mentor already exists
    const existing = await mentorService.getById(currentUser.uid);
    if (existing) {
      return { success: false, error: "Mentor already registered." };
    }

    // Stricter LinkedIn URL validation
    const linkedInRegex =
      /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/;
    if (!linkedInRegex.test(linkedinProfile)) {
      return {
        success: false,
        error: "Please enter a valid LinkedIn profile URL.",
      };
    }

    // Map form data to service format
    const mentorProfile = {
      uid: currentUser.uid,
      fullName,
      age,
      emailAddress: email,
      email: email, // required by BaseUser
      displayName: fullName, // required by BaseUser
      contactNumber,
      preferredLanguage: preferredLanguage as PreferredLanguage,
      currentLocation,
      shortBio,
      professionalRole,
      teachingSubjects: subjectsToTeach.split(",").map((s) => s.trim()),
      teachingExperience: experience as TeachingExperience,
      preferredStudentLevels: preferredStudentLevels.map((level) => {
        switch (level) {
          case "Grade 3–5":
            return MentorEducationLevel.GRADE_3_5;
          case "Grade 6–9":
            return MentorEducationLevel.GRADE_6_9;
          case "Grade 10–11":
            return MentorEducationLevel.GRADE_10_11;
          case "A/L":
            return MentorEducationLevel.ADVANCED_LEVEL;
          default:
            return MentorEducationLevel.GRADE_6_9;
        }
      }),
      linkedinProfile,
      githubOrPortfolio: githubPortfolio || undefined,
    };

    // Register mentor profile
    await mentorService.registerMentorProfile(mentorProfile);

    // Revalidate relevant paths
    revalidatePath("/dashboard/mentor");
    revalidatePath("/");

    return {
      success: true,
      message: "Mentor registration completed successfully!",
    };
  } catch (error) {
    console.error("Error registering mentor:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to register mentor.",
    };
  }
}
