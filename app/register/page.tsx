"use client";

import { useState, useRef } from "react";
import { studentService } from "@/lib/services/studentService";
import { mentorService } from "@/lib/services/mentorService";
import {
  StudentEducationLevel,
  MentorEducationLevel,
  TeachingExperience,
  PreferredLanguage,
  LearningStyle,
  SkillLevel,
} from "@/lib/types/eduvibe";

export default function RegisterPage() {
  const [activeTab, setActiveTab] = useState("student");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Base64 image handling
  const [profileImage, setProfileImage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Convert file to base64 with compression
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({
          type: "error",
          text: "Image size must be less than 5MB",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;

        // Compress image if it's too large
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          // Calculate new dimensions (max 500x500)
          let { width, height } = img;
          const maxSize = 500;

          if (width > height) {
            if (width > maxSize) {
              height = (height * maxSize) / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width = (width * maxSize) / height;
              height = maxSize;
            }
          }

          canvas.width = width;
          canvas.height = height;

          ctx?.drawImage(img, 0, 0, width, height);

          // Convert to base64 with quality 0.8
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.8);
          setProfileImage(compressedBase64);
        };
        img.src = result;
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove profile image
  const removeProfileImage = () => {
    setProfileImage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Get base64 size in KB
  const getBase64Size = (base64String: string): number => {
    const stringLength = base64String.length;
    const sizeInBytes = 4 * Math.ceil(stringLength / 3) * 0.75;
    return Math.round(sizeInBytes / 1024);
  };

  // Student form state
  const [studentForm, setStudentForm] = useState({
    fullName: "",
    age: 16,
    emailAddress: "",
    contactNumber: "",
    currentEducationLevel: StudentEducationLevel.GRADE_9,
    school: "",
    subjectsOfInterest: "",
    currentYear: 2024,
    preferredLearningStyle: LearningStyle.VISUAL,
    hasLearningDisabilities: false,
    learningDisabilitiesDescription: "",
  });

  // Mentor form state
  const [mentorForm, setMentorForm] = useState({
    fullName: "",
    age: 25,
    emailAddress: "",
    contactNumber: "",
    preferredLanguage: PreferredLanguage.ENGLISH,
    currentLocation: "",
    shortBio: "",
    professionalRole: "",
    teachingSubjects: [] as string[],
    teachingExperience: TeachingExperience.NONE,
    preferredStudentLevels: [] as MentorEducationLevel[],
    linkedinProfile: "",
    githubOrPortfolio: "",
  });

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Create subject skill levels based on subjects of interest
      const subjects = studentForm.subjectsOfInterest
        .split(",")
        .map((s) => s.trim());
      const subjectSkillLevels = subjects.map((subject) => ({
        subject,
        skillLevel: SkillLevel.BEGINNER,
      }));

      await studentService.registerStudentProfile({
        ...studentForm,
        uid: `student_${Date.now()}`, // Mock UID
        email: studentForm.emailAddress,
        displayName: studentForm.fullName,
        subjectSkillLevels,
      });

      setMessage({
        type: "success",
        text: "Student profile registered successfully!",
      });
      setStudentForm({
        fullName: "",
        age: 16,
        emailAddress: "",
        contactNumber: "",
        currentEducationLevel: StudentEducationLevel.GRADE_9,
        school: "",
        subjectsOfInterest: "",
        currentYear: 2024,
        preferredLearningStyle: LearningStyle.VISUAL,
        hasLearningDisabilities: false,
        learningDisabilitiesDescription: "",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMentorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await mentorService.registerMentorProfile({
        ...mentorForm,
        uid: `mentor_${Date.now()}`, // Mock UID
        email: mentorForm.emailAddress,
        displayName: mentorForm.fullName,
        profilePictureUrl: profileImage || undefined,
      });

      setMessage({
        type: "success",
        text: "Mentor profile registered successfully!",
      });
      setMentorForm({
        fullName: "",
        age: 25,
        emailAddress: "",
        contactNumber: "",
        preferredLanguage: PreferredLanguage.ENGLISH,
        currentLocation: "",
        shortBio: "",
        professionalRole: "",
        teachingSubjects: [],
        teachingExperience: TeachingExperience.NONE,
        preferredStudentLevels: [],
        linkedinProfile: "",
        githubOrPortfolio: "",
      });
      setProfileImage("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1
          style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "10px" }}
        >
          EduVibe Registration
        </h1>
        <p style={{ color: "#666" }}>
          Join our platform as a student or mentor
        </p>
      </div>

      {message && (
        <div
          style={{
            marginBottom: "20px",
            padding: "15px",
            borderRadius: "8px",
            border: "1px solid",
            backgroundColor: message.type === "success" ? "#d4edda" : "#f8d7da",
            color: message.type === "success" ? "#155724" : "#721c24",
            borderColor: message.type === "success" ? "#c3e6cb" : "#f5c6cb",
          }}
        >
          {message.text}
        </div>
      )}

      {/* Tab Navigation */}
      <div
        style={{
          display: "flex",
          marginBottom: "20px",
          borderBottom: "1px solid #ddd",
        }}
      >
        <button
          onClick={() => setActiveTab("student")}
          style={{
            padding: "10px 20px",
            border: "none",
            background: activeTab === "student" ? "#007bff" : "transparent",
            color: activeTab === "student" ? "white" : "#666",
            cursor: "pointer",
            borderBottom:
              activeTab === "student" ? "2px solid #007bff" : "none",
          }}
        >
          Student Registration
        </button>
        <button
          onClick={() => setActiveTab("mentor")}
          style={{
            padding: "10px 20px",
            border: "none",
            background: activeTab === "mentor" ? "#007bff" : "transparent",
            color: activeTab === "mentor" ? "white" : "#666",
            cursor: "pointer",
            borderBottom: activeTab === "mentor" ? "2px solid #007bff" : "none",
          }}
        >
          Mentor Registration
        </button>
      </div>

      {/* Student Registration Form */}
      {activeTab === "student" && (
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "20px",
          }}
        >
          <h2 style={{ marginBottom: "20px" }}>Student Profile Registration</h2>
          <p style={{ color: "#666", marginBottom: "20px" }}>
            Complete your student profile to start learning with our mentors
          </p>

          <form
            onSubmit={handleStudentSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "15px" }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "15px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "bold",
                  }}
                >
                  Full Name *
                </label>
                <input
                  type="text"
                  value={studentForm.fullName}
                  onChange={(e) =>
                    setStudentForm({ ...studentForm, fullName: e.target.value })
                  }
                  required
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "bold",
                  }}
                >
                  Age *
                </label>
                <input
                  type="number"
                  min="13"
                  max="25"
                  value={studentForm.age}
                  onChange={(e) =>
                    setStudentForm({
                      ...studentForm,
                      age: parseInt(e.target.value),
                    })
                  }
                  required
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                  }}
                />
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "15px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "bold",
                  }}
                >
                  Email Address *
                </label>
                <input
                  type="email"
                  value={studentForm.emailAddress}
                  onChange={(e) =>
                    setStudentForm({
                      ...studentForm,
                      emailAddress: e.target.value,
                    })
                  }
                  required
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "bold",
                  }}
                >
                  Contact Number *
                </label>
                <input
                  type="tel"
                  value={studentForm.contactNumber}
                  onChange={(e) =>
                    setStudentForm({
                      ...studentForm,
                      contactNumber: e.target.value,
                    })
                  }
                  required
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                  }}
                />
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "15px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "bold",
                  }}
                >
                  Current Education Level *
                </label>
                <select
                  value={studentForm.currentEducationLevel}
                  onChange={(e) =>
                    setStudentForm({
                      ...studentForm,
                      currentEducationLevel: e.target
                        .value as StudentEducationLevel,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                  }}
                >
                  <option value={StudentEducationLevel.GRADE_9}>Grade 9</option>
                  <option value={StudentEducationLevel.ORDINARY_LEVEL}>
                    Ordinary Level
                  </option>
                  <option value={StudentEducationLevel.ADVANCED_LEVEL}>
                    Advanced Level
                  </option>
                </select>
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "bold",
                  }}
                >
                  School *
                </label>
                <input
                  type="text"
                  value={studentForm.school}
                  onChange={(e) =>
                    setStudentForm({ ...studentForm, school: e.target.value })
                  }
                  required
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                  }}
                />
              </div>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: "bold",
                }}
              >
                Subjects of Interest * (comma separated)
              </label>
              <input
                type="text"
                placeholder="e.g., Mathematics, Physics, English"
                value={studentForm.subjectsOfInterest}
                onChange={(e) =>
                  setStudentForm({
                    ...studentForm,
                    subjectsOfInterest: e.target.value,
                  })
                }
                required
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "15px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "bold",
                  }}
                >
                  Current Year *
                </label>
                <input
                  type="number"
                  min="2020"
                  max="2030"
                  value={studentForm.currentYear}
                  onChange={(e) =>
                    setStudentForm({
                      ...studentForm,
                      currentYear: parseInt(e.target.value),
                    })
                  }
                  required
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "bold",
                  }}
                >
                  Preferred Learning Style *
                </label>
                <select
                  value={studentForm.preferredLearningStyle}
                  onChange={(e) =>
                    setStudentForm({
                      ...studentForm,
                      preferredLearningStyle: e.target.value as LearningStyle,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                  }}
                >
                  <option value={LearningStyle.VISUAL}>Visual</option>
                  <option value={LearningStyle.HANDS_ON}>Hands-on</option>
                  <option value={LearningStyle.THEORETICAL}>Theoretical</option>
                  <option value={LearningStyle.MIXED}>Mixed</option>
                </select>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <input
                type="checkbox"
                id="student-disabilities"
                checked={studentForm.hasLearningDisabilities}
                onChange={(e) =>
                  setStudentForm({
                    ...studentForm,
                    hasLearningDisabilities: e.target.checked,
                  })
                }
              />
              <label htmlFor="student-disabilities">
                I have learning disabilities
              </label>
            </div>

            {studentForm.hasLearningDisabilities && (
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "bold",
                  }}
                >
                  Learning Disabilities Description
                </label>
                <textarea
                  value={studentForm.learningDisabilitiesDescription}
                  onChange={(e) =>
                    setStudentForm({
                      ...studentForm,
                      learningDisabilitiesDescription: e.target.value,
                    })
                  }
                  placeholder="Please describe your learning disabilities..."
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    minHeight: "100px",
                  }}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "12px",
                backgroundColor: loading ? "#ccc" : "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: "16px",
              }}
            >
              {loading ? "Registering..." : "Register as Student"}
            </button>
          </form>
        </div>
      )}

      {/* Mentor Registration Form */}
      {activeTab === "mentor" && (
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "20px",
          }}
        >
          <h2 style={{ marginBottom: "20px" }}>Mentor Profile Registration</h2>
          <p style={{ color: "#666", marginBottom: "20px" }}>
            Complete your mentor profile to start teaching students
          </p>

          <form
            onSubmit={handleMentorSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "15px" }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "15px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "bold",
                  }}
                >
                  Full Name *
                </label>
                <input
                  type="text"
                  value={mentorForm.fullName}
                  onChange={(e) =>
                    setMentorForm({ ...mentorForm, fullName: e.target.value })
                  }
                  required
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "bold",
                  }}
                >
                  Age *
                </label>
                <input
                  type="number"
                  min="18"
                  max="100"
                  value={mentorForm.age}
                  onChange={(e) =>
                    setMentorForm({
                      ...mentorForm,
                      age: parseInt(e.target.value),
                    })
                  }
                  required
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                  }}
                />
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "15px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "bold",
                  }}
                >
                  Email Address *
                </label>
                <input
                  type="email"
                  value={mentorForm.emailAddress}
                  onChange={(e) =>
                    setMentorForm({
                      ...mentorForm,
                      emailAddress: e.target.value,
                    })
                  }
                  required
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "bold",
                  }}
                >
                  Contact Number *
                </label>
                <input
                  type="tel"
                  value={mentorForm.contactNumber}
                  onChange={(e) =>
                    setMentorForm({
                      ...mentorForm,
                      contactNumber: e.target.value,
                    })
                  }
                  required
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                  }}
                />
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "15px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "bold",
                  }}
                >
                  Preferred Language *
                </label>
                <select
                  value={mentorForm.preferredLanguage}
                  onChange={(e) =>
                    setMentorForm({
                      ...mentorForm,
                      preferredLanguage: e.target.value as PreferredLanguage,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                  }}
                >
                  <option value={PreferredLanguage.ENGLISH}>English</option>
                  <option value={PreferredLanguage.SINHALA}>Sinhala</option>
                  <option value={PreferredLanguage.TAMIL}>Tamil</option>
                  <option value={PreferredLanguage.OTHER}>Other</option>
                </select>
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "bold",
                  }}
                >
                  Current Location *
                </label>
                <input
                  type="text"
                  value={mentorForm.currentLocation}
                  onChange={(e) =>
                    setMentorForm({
                      ...mentorForm,
                      currentLocation: e.target.value,
                    })
                  }
                  required
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                  }}
                />
              </div>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: "bold",
                }}
              >
                Short Bio *
              </label>
              <textarea
                value={mentorForm.shortBio}
                onChange={(e) =>
                  setMentorForm({ ...mentorForm, shortBio: e.target.value })
                }
                placeholder="Tell us about yourself..."
                required
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  minHeight: "100px",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: "bold",
                }}
              >
                Professional Role *
              </label>
              <input
                type="text"
                value={mentorForm.professionalRole}
                onChange={(e) =>
                  setMentorForm({
                    ...mentorForm,
                    professionalRole: e.target.value,
                  })
                }
                placeholder="e.g., Software Engineer, Teacher, Student"
                required
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              />
            </div>

            {/* Profile Picture Upload */}
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: "bold",
                }}
              >
                Profile Picture (Optional)
              </label>
              <div
                style={{ display: "flex", gap: "10px", alignItems: "center" }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{
                    padding: "8px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    flex: 1,
                  }}
                />
                {profileImage && (
                  <button
                    type="button"
                    onClick={removeProfileImage}
                    style={{
                      padding: "8px 12px",
                      backgroundColor: "#dc3545",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
              {profileImage && (
                <div style={{ marginTop: "10px" }}>
                  <img
                    src={profileImage}
                    alt="Profile Preview"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      borderRadius: "50%",
                      border: "2px solid #ddd",
                    }}
                  />
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#666",
                      marginTop: "5px",
                    }}
                  >
                    Image will be stored as base64 (
                    {getBase64Size(profileImage)} KB)
                  </p>
                </div>
              )}
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: "bold",
                }}
              >
                Teaching Subjects * (comma separated)
              </label>
              <input
                type="text"
                placeholder="e.g., Mathematics, Physics, Computer Science"
                value={mentorForm.teachingSubjects.join(", ")}
                onChange={(e) =>
                  setMentorForm({
                    ...mentorForm,
                    teachingSubjects: e.target.value
                      .split(",")
                      .map((s) => s.trim()),
                  })
                }
                required
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "15px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "bold",
                  }}
                >
                  Teaching Experience *
                </label>
                <select
                  value={mentorForm.teachingExperience}
                  onChange={(e) =>
                    setMentorForm({
                      ...mentorForm,
                      teachingExperience: e.target.value as TeachingExperience,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                  }}
                >
                  <option value={TeachingExperience.NONE}>No experience</option>
                  <option value={TeachingExperience.ONE_TO_THREE_YEARS}>
                    1-3 years
                  </option>
                  <option value={TeachingExperience.THREE_TO_FIVE_YEARS}>
                    3-5 years
                  </option>
                  <option value={TeachingExperience.FIVE_PLUS_YEARS}>
                    5+ years
                  </option>
                </select>
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "bold",
                  }}
                >
                  Preferred Student Levels *
                </label>
                <select
                  value={mentorForm.preferredStudentLevels.join(",")}
                  onChange={(e) =>
                    setMentorForm({
                      ...mentorForm,
                      preferredStudentLevels: e.target.value.split(
                        ","
                      ) as MentorEducationLevel[],
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                  }}
                >
                  <option value="">Select levels</option>
                  <option value={MentorEducationLevel.GRADE_3_5}>
                    Grade 3-5
                  </option>
                  <option value={MentorEducationLevel.GRADE_6_9}>
                    Grade 6-9
                  </option>
                  <option value={MentorEducationLevel.GRADE_10_11}>
                    Grade 10-11
                  </option>
                  <option value={MentorEducationLevel.ADVANCED_LEVEL}>
                    Advanced Level
                  </option>
                </select>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "15px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "bold",
                  }}
                >
                  LinkedIn Profile *
                </label>
                <input
                  type="url"
                  value={mentorForm.linkedinProfile}
                  onChange={(e) =>
                    setMentorForm({
                      ...mentorForm,
                      linkedinProfile: e.target.value,
                    })
                  }
                  placeholder="https://linkedin.com/in/yourprofile"
                  required
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "bold",
                  }}
                >
                  GitHub/Portfolio (Optional)
                </label>
                <input
                  type="url"
                  value={mentorForm.githubOrPortfolio}
                  onChange={(e) =>
                    setMentorForm({
                      ...mentorForm,
                      githubOrPortfolio: e.target.value,
                    })
                  }
                  placeholder="https://github.com/yourusername"
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "12px",
                backgroundColor: loading ? "#ccc" : "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: "16px",
              }}
            >
              {loading ? "Registering..." : "Register as Mentor"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
