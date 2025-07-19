"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createStudentProfile } from "@/server/actions/sample";
import { AuthService } from "@/lib/auth";

interface StudentFormData {
  // Step 1: Basic Info
  fullName: string;
  age: string;
  email: string;
  contactNumber: string;
  
  // Step 2: Academic Background
  educationLevel: string;
  school: string;
  
  // Step 3: Subject & Skills
  subjectsOfInterest: string;
  currentYear: string;
  skillLevel: string;
  learningStyle: string;
  learningDisabilities: string;
  learningDisabilitiesDescription: string;
  password: string; // Add password field
}

export default function StudentRegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<StudentFormData>({
    fullName: "",
    age: "",
    email: "",
    contactNumber: "",
    educationLevel: "",
    school: "",
    subjectsOfInterest: "",
    currentYear: "",
    skillLevel: "",
    learningStyle: "",
    learningDisabilities: "",
    learningDisabilitiesDescription: "",
    password: "", // Add password field
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem("studentOnboardingData");
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  // Save data to localStorage whenever formData changes
  useEffect(() => {
    localStorage.setItem("studentOnboardingData", JSON.stringify(formData));
  }, [formData]);

  const handleInputChange = (field: keyof StudentFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
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

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      // 1. Create user in Firebase Auth
      const user = await AuthService.signUpWithEmail(formData.email, formData.password, formData.fullName);
      if (!user || !user.uid) {
        throw new Error("Failed to create user account.");
      }
      // 2. Create student profile in Firestore with uid
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "password") form.append(key, value); // Don't send password to backend
      });
      form.append("uid", user.uid);
      const result = await createStudentProfile(form);
      if (result && result.success) {
        setSuccess(true);
        localStorage.removeItem("studentOnboardingData");
        router.push("/dashboard/student");
      } else {
        setError(result?.error || "Registration failed. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.fullName && formData.age && formData.email && formData.contactNumber;
      case 2:
        return formData.educationLevel && formData.school;
      case 3:
        return formData.subjectsOfInterest && formData.currentYear && formData.skillLevel && formData.learningStyle;
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
          min="1"
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
        <Label htmlFor="password">Password *</Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => handleInputChange("password", e.target.value)}
          placeholder="Enter a password"
          required
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="educationLevel">Current Education Level *</Label>
        <select
          id="educationLevel"
          value={formData.educationLevel}
          onChange={(e) => handleInputChange("educationLevel", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select education level</option>
          <option value="Grade 9">Grade 9</option>
          <option value="Ordinary Level">Ordinary Level</option>
          <option value="Advanced Level">Advanced Level</option>
        </select>
      </div>
      
      <div>
        <Label htmlFor="school">School *</Label>
        <Input
          id="school"
          type="text"
          value={formData.school}
          onChange={(e) => handleInputChange("school", e.target.value)}
          placeholder="Enter your school name"
          required
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="subjectsOfInterest">Subjects of Interest *</Label>
        <Input
          id="subjectsOfInterest"
          type="text"
          value={formData.subjectsOfInterest}
          onChange={(e) => handleInputChange("subjectsOfInterest", e.target.value)}
          placeholder="e.g., Mathematics, Science, English (comma-separated)"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="currentYear">Current Year *</Label>
        <Input
          id="currentYear"
          type="number"
          value={formData.currentYear}
          onChange={(e) => handleInputChange("currentYear", e.target.value)}
          placeholder="Enter your current year"
          min="1"
          max="13"
          required
        />
      </div>
      
      <div>
        <Label>Skill Level *</Label>
        <div className="space-y-2">
          {["Beginner", "Intermediate", "Advanced"].map((level) => (
            <label key={level} className="flex items-center space-x-2">
              <input
                type="radio"
                name="skillLevel"
                value={level}
                checked={formData.skillLevel === level}
                onChange={(e) => handleInputChange("skillLevel", e.target.value)}
                required
              />
              <span>{level}</span>
            </label>
          ))}
        </div>
      </div>
      
      <div>
        <Label htmlFor="learningStyle">Preferred Learning Style *</Label>
        <select
          id="learningStyle"
          value={formData.learningStyle}
          onChange={(e) => handleInputChange("learningStyle", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select learning style</option>
          <option value="Visual">Visual</option>
          <option value="Hands-On">Hands-On</option>
          <option value="Theoretical">Theoretical</option>
          <option value="Mixed">Mixed</option>
        </select>
      </div>
      
      <div>
        <Label>Learning Disabilities?</Label>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="learningDisabilities"
              value="No"
              checked={formData.learningDisabilities === "No"}
              onChange={(e) => handleInputChange("learningDisabilities", e.target.value)}
            />
            <span>No</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="learningDisabilities"
              value="Yes"
              checked={formData.learningDisabilities === "Yes"}
              onChange={(e) => handleInputChange("learningDisabilities", e.target.value)}
            />
            <span>Yes</span>
          </label>
        </div>
      </div>
      
      {formData.learningDisabilities === "Yes" && (
        <div>
          <Label htmlFor="learningDisabilitiesDescription">Description</Label>
          <Textarea
            id="learningDisabilitiesDescription"
            value={formData.learningDisabilitiesDescription}
            onChange={(e) => handleInputChange("learningDisabilitiesDescription", e.target.value)}
            placeholder="Please describe your learning disabilities..."
            rows={3}
          />
        </div>
      )}
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
              Student Onboarding - Step {currentStep} of 3
            </CardTitle>
            <CardDescription className="text-center">
              {currentStep === 1 && "Basic Information"}
              {currentStep === 2 && "Academic Background"}
              {currentStep === 3 && "Subject & Skills"}
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
                        ? "bg-blue-600 text-white"
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
              {error && <div className="text-red-600 mt-4 text-center">{error}</div>}
              {success && <div className="text-green-600 mt-4 text-center">Registration successful!</div>}
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
                    disabled={!isStepValid() || loading}
                  >
                    {loading ? "Registering..." : "Complete Registration"}
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