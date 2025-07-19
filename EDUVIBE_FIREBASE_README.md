# EduVibe Firebase Setup - Complete Documentation

## 🎓 Overview

EduVibe is an EdTech platform that connects students with qualified mentors for personalized learning sessions. This Firebase setup provides a complete backend solution with real-time data synchronization, authentication, and comprehensive booking management.

## 🏗️ Architecture

### Collections Structure

```
firestore/
├── students/          # Student profiles and onboarding data
├── mentors/           # Mentor profiles and verification data
├── sessions/          # Booking sessions and metadata
└── users/             # Common authentication metadata
```

### Key Features

- ✅ **Multi-step Student Onboarding** (3 parts)
- ✅ **Multi-step Mentor Onboarding** (3 parts)
- ✅ **Real-time Session Booking** (2-hour sessions)
- ✅ **Bank Slip Payment Integration**
- ✅ **Double Booking Prevention**
- ✅ **Comprehensive Dashboard Data**
- ✅ **Rating & Feedback System**
- ✅ **Real-time Updates**

## 📋 Student Onboarding Form Structure

### Part 1: Who Are You? (Basic Information)

- **Full Name** (text input)
- **Age** (number input)
- **Email Address** (email input)
- **Contact Number** (tel input)

### Part 2: Academic Background

- **Current Education Level** (dropdown: Grade 9, Ordinary Level, Advanced Level)
- **School** (text input)

### Part 3: Subject & Skill Assessment

- **Subjects of Interest** (text input, comma separated)
- **Current Year** (number input)
- **Current Skill Level (Per Subject)** (radio buttons: Beginner/Intermediate/Advanced)
- **Preferred Learning Style** (dropdown: Visual, Hands-On, Theoretical, Mixed)
- **Learning Disabilities** (Yes/No with description)

## 👨‍🏫 Mentor Onboarding Form Structure

### Part 1: Personal Information

- **Full Name** (text input)
- **Age** (number input)
- **Email Address** (email input)
- **Contact Number** (tel input)
- **Preferred Language** (dropdown: English, Sinhala, Tamil, Other)
- **Current Location** (text input)
- **Short Bio** (textarea)
- **Professional Role** (text input)

### Part 2: Areas of Expertise

- **Teaching Subjects** (text inputs)
- **Teaching Experience** (dropdown: None, 1-3 years, 3-5 years, 5+ years)
- **Preferred Student Levels** (checkboxes: Grade 3-5, Grade 6-9, Grade 10-11, Advanced Level)

### Part 3: Social & Professional Links

- **LinkedIn Profile** (URL input - mandatory)
- **GitHub or Portfolio** (URL input - optional)
- **Profile Picture** (image upload - base64 encoded)

## 🖼️ Base64 Image Handling

### Profile Picture Upload

The registration form includes base64 image handling for profile pictures:

#### Features:

- ✅ **File Size Validation** (max 5MB)
- ✅ **Image Compression** (max 500x500px)
- ✅ **Quality Optimization** (JPEG 80% quality)
- ✅ **Real-time Preview** (circular crop)
- ✅ **Size Display** (shows KB size)
- ✅ **Remove Functionality** (clear uploaded image)

#### Implementation:

```typescript
// Convert file to base64 with compression
const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (file) {
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: "error", text: "Image size must be less than 5MB" });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;

      // Compress image using Canvas API
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Resize to max 500x500
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
```

#### Storage:

- Images are stored as base64 strings in the `profilePictureUrl` field
- Typical compressed size: 50-200 KB
- Format: `data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...`

## 🔧 Services Implementation

### 1. Student Service (`lib/services/studentService.ts`)

#### Core Functions:

```typescript
// Register student profile with multi-step onboarding
await studentService.registerStudentProfile(profileData);

// Get comprehensive dashboard data
const dashboard = await studentService.getStudentDashboard(uid);

// Book mentor session with bank slip
await studentService.bookMentorSession(studentId, mentorId, dateTime, slipUrl);

// Get all booked sessions
const sessions = await studentService.getBookedSessionsByStudent(uid);
```

#### Features:

- ✅ Multi-step form validation
- ✅ Email and phone number validation
- ✅ Age validation (5-100 years)
- ✅ Mentor availability checking
- ✅ Double booking prevention
- ✅ Dashboard statistics calculation

### 2. Mentor Service (`lib/services/mentorService.ts`)

#### Core Functions:

```typescript
// Register mentor profile with multi-step onboarding
await mentorService.registerMentorProfile(profileData);

// Get comprehensive dashboard data
const dashboard = await mentorService.getMentorDashboard(uid);

// Get mentors matching student preferences
const mentors =
  await mentorService.getMentorsMatchingStudentPreferences(student);

// Get all sessions for mentor
const sessions = await mentorService.getSessionsByMentor(uid);
```

#### Features:

- ✅ Multi-step form validation
- ✅ LinkedIn URL validation
- ✅ GitHub/Portfolio URL validation
- ✅ Age validation (18-100 years)
- ✅ Student preference matching
- ✅ Rating system integration

### 3. Session Service (`lib/services/sessionService.ts`)

#### Core Functions:

```typescript
// Create new session booking
const sessionId = await sessionService.createSession(sessionData);

// Confirm session after payment
await sessionService.confirmSession(sessionId, bankSlipUrl);

// Complete session
await sessionService.completeSession(sessionId);

// Add feedback and ratings
await sessionService.addStudentFeedback(sessionId, rating, feedback);
await sessionService.addMentorFeedback(sessionId, rating, feedback);
```

#### Features:

- ✅ 2-hour session validation
- ✅ Double booking prevention
- ✅ Session lifecycle management
- ✅ Payment status tracking
- ✅ Feedback and rating system
- ✅ Real-time availability checking

## 📊 Dashboard Data Structures

### Student Dashboard

```typescript
interface StudentDashboardData {
  upcomingSessions: MentorSession[];
  pastSessions: MentorSession[];
  availableMentors: MentorProfile[];
  totalSessions: number;
  totalSpent: number;
  favoriteSubjects: string[];
  learningProgress: {
    subject: string;
    sessionsCompleted: number;
    averageRating: number;
  }[];
}
```

### Mentor Dashboard

```typescript
interface MentorDashboardData {
  upcomingSessions: MentorSession[];
  pastSessions: MentorSession[];
  totalStudents: number;
  totalEarnings: number;
  averageRating: number;
  sessionStats: {
    total: number;
    completed: number;
    cancelled: number;
    pending: number;
  };
  earningsByMonth: {
    month: string;
    amount: number;
  }[];
  popularSubjects: {
    subject: string;
    sessions: number;
  }[];
}
```

## 🔐 Authentication Setup

### Supported Providers:

- ✅ **Email/Password**
- ✅ **Google OAuth**
- ✅ **Facebook OAuth**
- ✅ **GitHub OAuth**

### Usage:

```typescript
import { AuthService } from "@/lib/auth";

// Email/Password
const user = await AuthService.signInWithEmail(email, password);
const user = await AuthService.signUpWithEmail(email, password, displayName);

// Social Authentication
const user = await AuthService.signInWithGoogle();
const user = await AuthService.signInWithFacebook();
const user = await AuthService.signInWithGithub();

// Real-time auth state
const { user, loading } = useAuth();
```

## 📅 Session Booking Flow

### 1. Student Books Session

```typescript
// 1. Check mentor availability
const isAvailable = await studentService.checkMentorAvailability(
  mentorId,
  dateTime
);

// 2. Book session with bank slip
await studentService.bookMentorSession(studentId, mentorId, dateTime, slipUrl);
```

### 2. Session Lifecycle

```typescript
// PENDING → CONFIRMED → COMPLETED
await sessionService.confirmSession(sessionId, bankSlipUrl);
await sessionService.completeSession(sessionId);

// Or CANCELLED/NO_SHOW
await sessionService.cancelSession(sessionId, userId, reason);
await sessionService.markSessionAsNoShow(sessionId);
```

### 3. Feedback System

```typescript
// Add ratings and feedback
await sessionService.addStudentFeedback(sessionId, 5, "Great session!");
await sessionService.addMentorFeedback(sessionId, 4, "Student was engaged");
```

## 🔄 Real-time Features

### Session Updates

```typescript
// Subscribe to session changes
const unsubscribe = sessionService.subscribeToSession(sessionId, (session) => {
  console.log("Session updated:", session);
});

// Subscribe to user sessions
const unsubscribe = sessionService.subscribeToUserSessions(
  userId,
  "student",
  (sessions) => {
    console.log("Sessions updated:", sessions);
  }
);
```

### Authentication State

```typescript
// Real-time auth state in React components
function MyComponent() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please sign in</div>;

  return <div>Welcome, {user.displayName}!</div>;
}
```

## 🛡️ Security Rules

### Firestore Rules

```javascript
// Students can only access their own data
match /students/{userId} {
  allow read, write: if request.auth.uid == userId;
}

// Mentors can only access their own data
match /mentors/{userId} {
  allow read, write: if request.auth.uid == userId;
}

// Sessions: students and mentors can access their sessions
match /sessions/{sessionId} {
  allow read, write: if request.auth.uid == resource.data.studentId ||
                           request.auth.uid == resource.data.mentorId;
}
```

## 📱 Usage Examples

### Complete Student Registration Flow

```typescript
import { studentService } from "@/lib/services/studentService";

// 1. Register student profile
await studentService.registerStudentProfile({
  uid: "user123",
  fullName: "John Doe",
  age: 16,
  emailAddress: "john@example.com",
  contactNumber: "+1234567890",
  currentEducationLevel: "ordinary_level",
  school: "ABC High School",
  subjectsOfInterest: "Mathematics, Physics, Chemistry",
  currentYear: 11,
  subjectSkillLevels: [
    { subject: "Mathematics", skillLevel: "intermediate" },
    { subject: "Physics", skillLevel: "beginner" },
  ],
  preferredLearningStyle: "visual",
  hasLearningDisabilities: false,
});

// 2. Get dashboard
const dashboard = await studentService.getStudentDashboard("user123");

// 3. Book session
await studentService.bookMentorSession(
  "user123",
  "mentor456",
  "2024-01-15T14:00:00Z",
  "https://example.com/slip.jpg"
);
```

### Complete Mentor Registration Flow

```typescript
import { mentorService } from "@/lib/services/mentorService";

// 1. Register mentor profile
await mentorService.registerMentorProfile({
  uid: "mentor456",
  fullName: "Dr. Jane Smith",
  age: 28,
  emailAddress: "jane@example.com",
  contactNumber: "+1234567890",
  preferredLanguage: "english",
  currentLocation: "Colombo, Sri Lanka",
  shortBio: "Experienced physics teacher with 5+ years of experience",
  professionalRole: "Physics Teacher",
  teachingSubjects: ["Physics", "Mathematics"],
  teachingExperience: "5_plus_years",
  preferredStudentLevels: ["grade_10_11", "advanced_level"],
  linkedinProfile: "https://linkedin.com/in/janesmith",
});

// 2. Get dashboard
const dashboard = await mentorService.getMentorDashboard("mentor456");
```

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install firebase
```

### 2. Configure Environment Variables

```bash
# Copy env.example to .env.local
cp env.example .env.local

# Fill in your Firebase configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
# ... other config values
```

### 3. Deploy Security Rules

```bash
firebase deploy --only firestore:rules
```

### 4. Start Development

```bash
npm run dev
```

## 📈 Performance Optimizations

### 1. Indexed Queries

- Session queries by date and status
- User queries by email
- Mentor queries by approval status

### 2. Real-time Listeners

- Efficient subscription management
- Automatic cleanup on component unmount

### 3. Batch Operations

- Bulk session updates
- Batch profile updates

## 🔧 Customization

### Pricing Model

Update the rate calculation in services:

```typescript
// In studentService.ts and mentorService.ts
const ratePerHour = 25; // Modify this value
```

### Session Duration

Update session validation:

```typescript
// In sessionService.ts
if (sessionData.duration !== 120) {
  // 2 hours = 120 minutes
  throw new Error("Session duration must be exactly 2 hours");
}
```

### Education Levels

Add new levels in `lib/types/eduvibe.ts`:

```typescript
export enum StudentEducationLevel {
  GRADE_9 = "grade_9",
  ORDINARY_LEVEL = "ordinary_level",
  ADVANCED_LEVEL = "advanced_level",
  // Add new levels here
}
```

## 🐛 Troubleshooting

### Common Issues

1. **"Mentor not available" error**
   - Check mentor's existing sessions
   - Verify time slot conflicts

2. **"Invalid email format" error**
   - Ensure email follows standard format
   - Check for extra spaces

3. **"Session duration must be 2 hours" error**
   - Sessions are fixed at 2 hours (120 minutes)
   - Cannot be modified without code changes

4. **Real-time updates not working**
   - Check Firebase connection
   - Verify security rules
   - Ensure proper cleanup of listeners

## 📞 Support

For issues or questions:

1. Check the Firebase Console for errors
2. Review security rules configuration
3. Verify environment variables
4. Test with Firebase emulators locally

---

**EduVibe Firebase Setup** - Complete, scalable, and production-ready EdTech platform backend.
