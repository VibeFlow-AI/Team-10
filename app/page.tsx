export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              EduVibe
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Connect with qualified mentors for personalized learning
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* For Students */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                For Students
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Find the perfect mentor to help you excel in your studies. Book
                personalized 2-hour sessions with qualified educators.
              </p>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li>• Multi-step onboarding process</li>
                <li>• Subject and skill level assessment</li>
                <li>• Flexible scheduling</li>
                <li>• Progress tracking</li>
              </ul>
            </div>

            {/* For Mentors */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                For Mentors
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Share your expertise and help students succeed. Build your
                teaching portfolio and earn income.
              </p>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li>• Professional profile creation</li>
                <li>• Student matching system</li>
                <li>• Session management tools</li>
                <li>• Earnings tracking</li>
              </ul>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Platform Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                    📚
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Smart Matching
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  AI-powered mentor-student matching based on subjects, skill
                  levels, and preferences.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                    ⏰
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Flexible Scheduling
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Book 2-hour sessions at your convenience with real-time
                  availability checking.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                    📊
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Progress Tracking
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Monitor learning progress with detailed analytics and feedback
                  systems.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <div className="bg-indigo-600 text-white rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-4">
                Ready to Start Learning?
              </h2>
              <p className="text-indigo-100 mb-6">
                Join thousands of students and mentors already using EduVibe
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Get Started as Student
                </button>
                <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors">
                  Become a Mentor
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
