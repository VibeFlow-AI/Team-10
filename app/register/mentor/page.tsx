"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface MentorFormData {
  // Step 1: Personal Information
  fullName: string;
  age: string;
  email: string;
  contactNumber: string;
  preferredLanguage: string;
  currentLocation: string;
  shortBio: string;
  professionalRole: string;
  
  // Step 2: Expertise
  subjectsToTeach: string;
  experience: string;
  preferredStudentLevels: string[];
  
  // Step 3: Links & Profile
  linkedinProfile: string;
  githubPortfolio: string;
  profilePicture: File | null;
}

export default function MentorRegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<MentorFormData>({
    fullName: "",
    age: "",
    email: "",
    contactNumber: "",
    preferredLanguage: "",
    currentLocation: "",
    shortBio: "",
    professionalRole: "",
    subjectsToTeach: "",
    experience: "",
    preferredStudentLevels: [],
    linkedinProfile: "",
    githubPortfolio: "",
    profilePicture: null,
  });

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem("mentorOnboardingData");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      // File objects can't be serialized, so we need to handle this
      setFormData({
        ...parsed,
        profilePicture: null // Reset file input on reload
      });
    }
  }, []);

  // Save data to localStorage whenever formData changes
  useEffect(() => {
    const dataToSave = {
      ...formData,
      profilePicture: null // Don't save file object
    };
    localStorage.setItem("mentorOnboardingData", JSON.stringify(dataToSave));
  }, [formData]);

  const handleInputChange = (field: keyof MentorFormData, value: string | string[] | File | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCheckboxChange = (level: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      preferredStudentLevels: checked
        ? [...prev.preferredStudentLevels, level]
        : prev.preferredStudentLevels.filter(l => l !== level)
    }));
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Clear localStorage after successful submission
    localStorage.removeItem("mentorOnboardingData");
    // Navigate to mentor dashboard
    router.push("/dashboard/mentor");
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.fullName && formData.age && formData.email && formData.contactNumber && 
               formData.preferredLanguage && formData.currentLocation && formData.shortBio && formData.professionalRole;
      case 2:
        return formData.subjectsToTeach && formData.experience && formData.preferredStudentLevels.length > 0;
      case 3:
        return formData.linkedinProfile;
      default:
        return false;
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="fullName">Full Name *</Label>
        <Input
          id="fullName"
          type="text"
          value={formData.fullName}
          onChange={(e) => handleInputChange("fullName", e.target.value)}
          placeholder="Enter your full name"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="age">Age *</Label>
        <Input
          id="age"
          type="number"
          value={formData.age}
          onChange={(e) => handleInputChange("age", e.target.value)}
          placeholder="Enter your age"
          min="18"
          max="100"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          placeholder="Enter your email address"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="contactNumber">Contact Number *</Label>
        <Input
          id="contactNumber"
          type="tel"
          value={formData.contactNumber}
          onChange={(e) => handleInputChange("contactNumber", e.target.value)}
          placeholder="Enter your contact number"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="preferredLanguage">Preferred Language *</Label>
        <select
          id="preferredLanguage"
          value={formData.preferredLanguage}
          onChange={(e) => handleInputChange("preferredLanguage", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select preferred language</option>
          <option value="English">English</option>
          <option value="Sinhala">Sinhala</option>
          <option value="Tamil">Tamil</option>
          <option value="Other">Other</option>
        </select>
      </div>
      
      <div>
        <Label htmlFor="currentLocation">Current Location *</Label>
        <Input
          id="currentLocation"
          type="text"
          value={formData.currentLocation}
          onChange={(e) => handleInputChange("currentLocation", e.target.value)}
          placeholder="Enter your current location"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="shortBio">Short Bio *</Label>
        <Textarea
          id="shortBio"
          value={formData.shortBio}
          onChange={(e) => handleInputChange("shortBio", e.target.value)}
          placeholder="Tell us a bit about yourself..."
          rows={3}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="professionalRole">Professional Role *</Label>
        <Input
          id="professionalRole"
          type="text"
          value={formData.professionalRole}
          onChange={(e) => handleInputChange("professionalRole", e.target.value)}
          placeholder="e.g., Software Engineer, Teacher, Consultant"
          required
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="subjectsToTeach">Subjects you plan to teach *</Label>
        <Input
          id="subjectsToTeach"
          type="text"
          value={formData.subjectsToTeach}
          onChange={(e) => handleInputChange("subjectsToTeach", e.target.value)}
          placeholder="e.g., Mathematics, Programming, English (comma-separated)"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="experience">Experience *</Label>
        <select
          id="experience"
          value={formData.experience}
          onChange={(e) => handleInputChange("experience", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select experience level</option>
          <option value="None">None</option>
          <option value="1–3 years">1–3 years</option>
          <option value="3–5 years">3–5 years</option>
          <option value="5+ years">5+ years</option>
        </select>
      </div>
      
      <div>
        <Label>Preferred Student Levels *</Label>
        <div className="space-y-2">
          {["Grade 3–5", "Grade 6–9", "Grade 10–11", "A/L"].map((level) => (
            <label key={level} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.preferredStudentLevels.includes(level)}
                onChange={(e) => handleCheckboxChange(level, e.target.checked)}
                required={formData.preferredStudentLevels.length === 0}
              />
              <span>{level}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="linkedinProfile">LinkedIn Profile *</Label>
        <Input
          id="linkedinProfile"
          type="url"
          value={formData.linkedinProfile}
          onChange={(e) => handleInputChange("linkedinProfile", e.target.value)}
          placeholder="https://linkedin.com/in/your-profile"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="githubPortfolio">GitHub or Portfolio (Optional)</Label>
        <Input
          id="githubPortfolio"
          type="url"
          value={formData.githubPortfolio}
          onChange={(e) => handleInputChange("githubPortfolio", e.target.value)}
          placeholder="https://github.com/your-username or portfolio URL"
        />
      </div>
      
      <div>
        <Label htmlFor="profilePicture">Profile Picture</Label>
        <Input
          id="profilePicture"
          type="file"
          accept="image/*"
          onChange={(e) => handleInputChange("profilePicture", e.target.files?.[0] || null)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-sm text-gray-500 mt-1">
          Accepted formats: JPG, PNG, GIF (Max 5MB)
        </p>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Mentor Onboarding - Step {currentStep} of 3
            </CardTitle>
            <CardDescription className="text-center">
              {currentStep === 1 && "Personal Information"}
              {currentStep === 2 && "Expertise"}
              {currentStep === 3 && "Links & Profile"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="flex justify-between items-center">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step <= currentStep
                        ? "bg-green-600 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {step}
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={(e) => e.preventDefault()}>
              {renderCurrentStep()}

              <div className="flex justify-between mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>
                
                {currentStep < 3 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={!isStepValid()}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!isStepValid()}
                  >
                    Complete Registration
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 