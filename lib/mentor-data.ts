export interface Mentor {
  id: string;
  name: string;
  subjects: string[];
  expertise: string[];
  languages: string[];
  gradeLevels: string[];
  photo: string;
  rating: number;
  experience: string;
  bio: string;
  hourlyRate: number;
}

export interface Student {
  id: string;
  name: string;
  subjects: string[];
  languages: string[];
  gradeLevel: string;
}

// Mock student data (this would come from user profile)
export const mockStudent: Student = {
  id: "student-1",
  name: "Alex Johnson",
  subjects: ["Mathematics", "Physics", "Computer Science"],
  languages: ["English", "Spanish"],
  gradeLevel: "High School",
};

export const mentors: Mentor[] = [
  {
    id: "mentor-1",
    name: "Dr. Sarah Chen",
    subjects: ["Mathematics", "Physics"],
    expertise: ["Calculus", "Linear Algebra", "Quantum Mechanics"],
    languages: ["English", "Mandarin"],
    gradeLevels: ["High School", "University"],
    photo: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    rating: 4.9,
    experience: "8 years",
    bio: "PhD in Physics with extensive experience in teaching advanced mathematics and physics concepts.",
    hourlyRate: 75,
  },
  {
    id: "mentor-2",
    name: "Prof. Michael Rodriguez",
    subjects: ["Computer Science", "Mathematics"],
    expertise: ["Programming", "Data Structures", "Algorithms"],
    languages: ["English", "Spanish"],
    gradeLevels: ["High School", "University"],
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    rating: 4.8,
    experience: "12 years",
    bio: "Senior software engineer and educator specializing in computer science fundamentals.",
    hourlyRate: 80,
  },
  {
    id: "mentor-3",
    name: "Dr. Emily Watson",
    subjects: ["Biology", "Chemistry"],
    expertise: ["Molecular Biology", "Organic Chemistry", "Genetics"],
    languages: ["English"],
    gradeLevels: ["High School", "University"],
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    rating: 4.7,
    experience: "6 years",
    bio: "Research scientist with a passion for making complex biological concepts accessible.",
    hourlyRate: 70,
  },
  {
    id: "mentor-4",
    name: "James Thompson",
    subjects: ["English", "Literature"],
    expertise: ["Creative Writing", "Essay Writing", "Shakespeare"],
    languages: ["English", "French"],
    gradeLevels: ["Middle School", "High School"],
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    rating: 4.6,
    experience: "10 years",
    bio: "Published author and English teacher with expertise in creative and academic writing.",
    hourlyRate: 65,
  },
  {
    id: "mentor-5",
    name: "Dr. Lisa Park",
    subjects: ["Chemistry", "Physics"],
    expertise: ["Physical Chemistry", "Thermodynamics", "Analytical Chemistry"],
    languages: ["English", "Korean"],
    gradeLevels: ["High School", "University"],
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    rating: 4.9,
    experience: "15 years",
    bio: "Chemistry professor with a focus on making complex chemical concepts understandable.",
    hourlyRate: 85,
  },
  {
    id: "mentor-6",
    name: "Robert Davis",
    subjects: ["History", "Social Studies"],
    expertise: ["World History", "American History", "Political Science"],
    languages: ["English"],
    gradeLevels: ["Middle School", "High School"],
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    rating: 4.5,
    experience: "9 years",
    bio: "History teacher passionate about making historical events engaging and relevant.",
    hourlyRate: 60,
  },
  {
    id: "mentor-7",
    name: "Dr. Maria Garcia",
    subjects: ["Mathematics", "Statistics"],
    expertise: ["Statistics", "Probability", "Data Analysis"],
    languages: ["English", "Spanish"],
    gradeLevels: ["High School", "University"],
    photo: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
    rating: 4.8,
    experience: "11 years",
    bio: "Data scientist and mathematics educator specializing in statistical analysis.",
    hourlyRate: 75,
  },
  {
    id: "mentor-8",
    name: "David Wilson",
    subjects: ["Computer Science", "Mathematics"],
    expertise: ["Web Development", "Machine Learning", "Calculus"],
    languages: ["English"],
    gradeLevels: ["High School", "University"],
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
    rating: 4.7,
    experience: "7 years",
    bio: "Full-stack developer and educator with expertise in modern web technologies.",
    hourlyRate: 70,
  },
  {
    id: "mentor-9",
    name: "Dr. Anna Kim",
    subjects: ["Physics", "Mathematics"],
    expertise: ["Mechanics", "Electromagnetism", "Calculus"],
    languages: ["English", "Korean"],
    gradeLevels: ["High School", "University"],
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    rating: 4.9,
    experience: "13 years",
    bio: "Physics professor with a talent for explaining complex concepts in simple terms.",
    hourlyRate: 80,
  },
  {
    id: "mentor-10",
    name: "Thomas Brown",
    subjects: ["Computer Science", "Physics"],
    expertise: ["Programming", "Robotics", "Electronics"],
    languages: ["English"],
    gradeLevels: ["Middle School", "High School"],
    photo: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face",
    rating: 4.6,
    experience: "8 years",
    bio: "Robotics engineer and educator passionate about STEM education.",
    hourlyRate: 65,
  },
  {
    id: "mentor-11",
    name: "Dr. Jennifer Lee",
    subjects: ["Biology", "Chemistry"],
    expertise: ["Cell Biology", "Biochemistry", "Microbiology"],
    languages: ["English", "Mandarin"],
    gradeLevels: ["High School", "University"],
    photo: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face",
    rating: 4.8,
    experience: "14 years",
    bio: "Biologist and educator with expertise in cellular and molecular biology.",
    hourlyRate: 75,
  },
  {
    id: "mentor-12",
    name: "Christopher Taylor",
    subjects: ["Mathematics", "Computer Science"],
    expertise: ["Algebra", "Geometry", "Python Programming"],
    languages: ["English", "French"],
    gradeLevels: ["Middle School", "High School"],
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
    rating: 4.5,
    experience: "6 years",
    bio: "Mathematics teacher and programming instructor with a focus on practical applications.",
    hourlyRate: 60,
  },
];

// Matching algorithm function
export function matchMentorsToStudent(student: Student, mentors: Mentor[]): Mentor[] {
  return mentors
    .map((mentor) => {
      let score = 0;
      
      // Subject match (highest priority)
      const subjectMatches = mentor.subjects.filter(subject => 
        student.subjects.includes(subject)
      );
      score += subjectMatches.length * 10;
      
      // Grade level match
      if (mentor.gradeLevels.includes(student.gradeLevel)) {
        score += 5;
      }
      
      // Language match
      const languageMatches = mentor.languages.filter(language => 
        student.languages.includes(language)
      );
      score += languageMatches.length * 3;
      
      // Rating bonus
      score += mentor.rating * 0.5;
      
      return { ...mentor, matchScore: score };
    })
    .sort((a, b) => (b as any).matchScore - (a as any).matchScore)
    .map(({ matchScore, ...mentor }) => mentor); // Remove matchScore from final result
} 