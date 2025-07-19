"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bookmark } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import GetStartedModal from "@/components/GetStartedModal"

export default function HomePage() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isUserInteracting, setIsUserInteracting] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer) return

    let scrollInterval: NodeJS.Timeout

    const startAutoScroll = () => {
      if (isUserInteracting) return
      
      scrollInterval = setInterval(() => {
        if (scrollContainer && !isUserInteracting) {
          // Calculate the height of one complete set of profiles
          const singleSetHeight = scrollContainer.scrollHeight / 2
          
          if (scrollContainer.scrollTop >= singleSetHeight) {
            // Reset to top seamlessly for infinite loop effect
            scrollContainer.scrollTop = 0
          } else {
            scrollContainer.scrollBy({ top: 2, behavior: 'auto' })
          }
        }
      }, 50)
    }

    const stopAutoScroll = () => {
      clearInterval(scrollInterval)
    }

    const handleUserInteraction = () => {
      setIsUserInteracting(true)
      stopAutoScroll()
    }

    const handleUserLeave = () => {
      setIsUserInteracting(false)
      startAutoScroll()
    }

    // Start auto-scroll initially
    startAutoScroll()

    // Add event listeners
    scrollContainer.addEventListener('mouseenter', handleUserInteraction)
    scrollContainer.addEventListener('mouseleave', handleUserLeave)
    scrollContainer.addEventListener('touchstart', handleUserInteraction)
    scrollContainer.addEventListener('touchend', () => {
      setTimeout(handleUserLeave, 1000) // Resume after 1 second of no touch
    })

    return () => {
      stopAutoScroll()
      scrollContainer.removeEventListener('mouseenter', handleUserInteraction)
      scrollContainer.removeEventListener('mouseleave', handleUserLeave)
      scrollContainer.removeEventListener('touchstart', handleUserInteraction)
      scrollContainer.removeEventListener('touchend', handleUserLeave)
    }
  }, [isUserInteracting])

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="z-50">
        <div className="container mx-auto px-4">
          <div className="bg-transparent rounded-t-2xl border border-gray-200 px-6 py-3 flex items-center justify-between max-w-4xl mx-auto">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
                <div className="flex flex-col space-y-1">
                  <div className="w-4 h-0.5 bg-white rounded"></div>
                  <div className="w-4 h-0.5 bg-white rounded"></div>
                  <div className="w-4 h-0.5 bg-white rounded"></div>
                </div>
              </div>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <Link href="#" className="text-gray-700 hover:text-black font-medium">
                Home
              </Link>
              <Link href="#" className="text-gray-700 hover:text-black font-medium">
                Sessions
              </Link>
              <Link href="#" className="text-gray-700 hover:text-black font-medium">
                About
              </Link>
      </nav>

            <Button onClick={openModal} className="bg-black text-white hover:bg-gray-800">Get Started</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-transparent border-x border-gray-200 mx-4">
        <div className="container mx-auto px-4 py-8 lg:py-12">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold text-black leading-tight">
                  Empowering Students with Personalized Mentorship
        </h1>
                <p className="text-xl text-black max-w-lg">
                  EduVibe connects students with experienced mentors to guide them through their academic journey.
        </p>
              </div>
                            <Button onClick={openModal} size="lg" className="bg-black text-white hover:bg-gray-800">
                Get Started
              </Button>
            </div>

            <div className="relative">
              {/* Top fade gradient for entire section */}
              <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-gray-100 via-gray-100/80 to-transparent z-10 pointer-events-none"></div>
              
              {/* Bottom fade gradient for entire section */}
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-100 via-gray-100/80 to-transparent z-10 pointer-events-none"></div>
              
              <div 
                ref={scrollContainerRef}
                className="h-[600px] overflow-y-auto scrollbar-hide relative"
              >
                <div className="space-y-6 py-12">
                  {/* First set of profiles */}
                  {/* Profile 1 - Young man with leather jacket (Large) */}
                  <div className="w-24 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto flex items-center justify-center text-white font-semibold text-xl">
                    <span>👨‍🎓</span>
                  </div>
                  {/* Profile 2 - Young woman with sunglasses (Small) */}
                  <div className="w-16 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full mx-auto flex items-center justify-center text-white font-semibold text-sm">
                    <span>👩‍🎓</span>
                  </div>
                  {/* Profile 3 - Man with curly hair (Medium) */}
                  <div className="w-20 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full mx-auto flex items-center justify-center text-white font-semibold text-lg">
                    <span>👨‍💼</span>
                  </div>
                  {/* Profile 4 - Young woman in orange hoodie (Large) */}
                  <div className="w-28 h-22 bg-gradient-to-br from-green-400 to-green-600 rounded-full mx-auto flex items-center justify-center text-white font-semibold text-2xl">
                    <span>👩‍💼</span>
                  </div>
                  {/* Profile 5 - Man with beard (Small) */}
                  <div className="w-18 h-15 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full mx-auto flex items-center justify-center text-white font-semibold text-base">
                    <span>🧔‍♂️</span>
                  </div>
                  {/* Profile 6 - Man in sports jersey (Large) */}
                  <div className="w-26 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-full mx-auto flex items-center justify-center text-white font-semibold text-xl">
                    <span>🏃‍♂️</span>
                  </div>
                  {/* Profile 7 - Young woman with blonde hair (Medium) */}
                  <div className="w-22 h-18 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full mx-auto flex items-center justify-center text-white font-semibold text-lg">
                    <span>👱‍♀️</span>
                  </div>
                  {/* Profile 8 - Another young man (Small) */}
                  <div className="w-16 h-14 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full mx-auto flex items-center justify-center text-white font-semibold text-sm">
                    <span>👨‍🔬</span>
                  </div>
                  {/* Profile 9 - Woman with glasses (Large) */}
                  <div className="w-24 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full mx-auto flex items-center justify-center text-white font-semibold text-xl">
                    <span>👩‍🏫</span>
                  </div>
                  {/* Profile 10 - Man with hat (Small) */}
                  <div className="w-18 h-15 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full mx-auto flex items-center justify-center text-white font-semibold text-base">
                    <span>👨‍🎨</span>
                  </div>
                  
                  {/* Duplicate set for infinite loop effect */}
                  {/* Profile 1 - Young man with leather jacket (Large) */}
                  <div className="w-24 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto flex items-center justify-center text-white font-semibold text-xl">
                    <span>👨‍🎓</span>
                  </div>
                  {/* Profile 2 - Young woman with sunglasses (Small) */}
                  <div className="w-16 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full mx-auto flex items-center justify-center text-white font-semibold text-sm">
                    <span>👩‍🎓</span>
                  </div>
                  {/* Profile 3 - Man with curly hair (Medium) */}
                  <div className="w-20 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full mx-auto flex items-center justify-center text-white font-semibold text-lg">
                    <span>👨‍💼</span>
                  </div>
                  {/* Profile 4 - Young woman in orange hoodie (Large) */}
                  <div className="w-28 h-22 bg-gradient-to-br from-green-400 to-green-600 rounded-full mx-auto flex items-center justify-center text-white font-semibold text-2xl">
                    <span>👩‍💼</span>
                  </div>
                  {/* Profile 5 - Man with beard (Small) */}
                  <div className="w-18 h-15 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full mx-auto flex items-center justify-center text-white font-semibold text-base">
                    <span>🧔‍♂️</span>
                  </div>
                  {/* Profile 6 - Man in sports jersey (Large) */}
                  <div className="w-26 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-full mx-auto flex items-center justify-center text-white font-semibold text-xl">
                    <span>🏃‍♂️</span>
                  </div>
                  {/* Profile 7 - Young woman with blonde hair (Medium) */}
                  <div className="w-22 h-18 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full mx-auto flex items-center justify-center text-white font-semibold text-lg">
                    <span>👱‍♀️</span>
                  </div>
                  {/* Profile 8 - Another young man (Small) */}
                  <div className="w-16 h-14 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full mx-auto flex items-center justify-center text-white font-semibold text-sm">
                    <span>👨‍🔬</span>
                  </div>
                  {/* Profile 9 - Woman with glasses (Large) */}
                  <div className="w-24 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full mx-auto flex items-center justify-center text-white font-semibold text-xl">
                    <span>👩‍🏫</span>
                  </div>
                  {/* Profile 10 - Man with hat (Small) */}
                  <div className="w-18 h-15 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full mx-auto flex items-center justify-center text-white font-semibold text-base">
                    <span>👨‍🎨</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What's in it for Students Section */}
      <section className="py-16 lg:py-24 bg-gray-100 border-x border-gray-200 mx-4">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-sm">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-5xl font-bold text-black mb-6">{"What's in it for Students?"}</h2>
              <p className="text-xl text-black max-w-4xl mx-auto">
                EduVibe is a student-mentor platform designed to personalize learning journeys. It connects students with
                mentors who offer guidance, support, and practical industry insights.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 h-[400px]">
              {/* Card 1 - Larger/Wider */}
              <Card className="bg-white border-0 shadow-lg lg:col-span-2">
                <CardHeader>
                  <div className="w-full h-48 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg mb-4 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl mb-2">👩‍💼</div>
                      <div className="text-xs text-purple-600">Career growth</div>
                    </div>
                  </div>
                  <CardTitle className="text-xl text-black">Growth & Career Readiness</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-black">
                    Develop essential skills and gain industry knowledge that prepares you for successful career
                    transitions and opportunities.
                  </CardDescription>
                </CardContent>
              </Card>

              {/* Card 2 - Slimmer */}
              <Card className="bg-white border-0 shadow-lg lg:col-span-1">
                <CardHeader>
                  <div className="w-full h-48 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg mb-4 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl mb-2">📊</div>
                      <div className="text-xs text-orange-600">Data insights</div>
                    </div>
                  </div>
                  <CardTitle className="text-xl text-black">Insights-Driven Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-black">
                    Receive data-driven feedback and personalized recommendations to track your progress and optimize your
                    learning path.
                  </CardDescription>
                </CardContent>
              </Card>

              {/* Card 3 - Slimmer */}
              <Card className="bg-white border-0 shadow-lg lg:col-span-1">
                <CardHeader>
                  <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg mb-4 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl mb-2">👥</div>
                      <div className="text-xs text-blue-600">Students collaborating</div>
                    </div>
                  </div>
                  <CardTitle className="text-xl text-black">Personalized Learning</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-black">
                    We tailor the mentorship experience to fit each student's unique goals, learning style, and pace
                    making every session impactful.
                  </CardDescription>
                </CardContent>
              </Card>

              {/* Card 4 - Slimmer */}
              <Card className="bg-white border-0 shadow-lg lg:col-span-1">
                <CardHeader>
                  <div className="w-full h-48 bg-gradient-to-br from-green-100 to-green-200 rounded-lg mb-4 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl mb-2">👩‍🏫</div>
                      <div className="text-xs text-green-600">Expert mentor</div>
                    </div>
                  </div>
                  <CardTitle className="text-xl text-black">Real Mentors, Real Guidance</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-black">
                    Connect with experienced professionals who provide authentic insights and practical advice for your
                    academic and career journey.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Session Highlights Section */}
      <section className="py-16 lg:py-24 bg-transparent border-x border-b border-gray-200 mx-4 rounded-b-2xl">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-black mb-6">Session Highlights – Trending Now</h2>
            <p className="text-xl text-black max-w-4xl mx-auto">
              Join the sessions students are raving about. These expert-led, high-impact sessions are designed to help
              you unlock your full potential whether you're polishing your resume, mapping out your career path, or
              getting ready to ace technical interviews.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <Card className="bg-white border-0 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold">RL</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-black">Rahul Lavan</h3>
                    <p className="text-sm text-gray-500">Colombo</p>
                  </div>
                </div>
                <div className="flex space-x-2 mb-4">
                  <Badge variant="secondary">Science</Badge>
                  <Badge variant="secondary">Physics</Badge>
                  <Badge variant="secondary">Biology</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                  industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and
                  scrambled
                </p>
                <div className="space-y-2 text-sm text-gray-500 mb-6">
                  <p>
                    <strong>Duration:</strong> 30 mins - 1 hour
                  </p>
                  <p>
                    <strong>Preferred Language:</strong> English, Tamil
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <Button className="bg-black text-white hover:bg-gray-800 flex-1 mr-2">Book a session</Button>
                  <Button variant="outline" size="icon">
                    <Bookmark className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-600 font-bold">CR</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-black">Chathum Rahal</h3>
                    <p className="text-sm text-gray-500">Galle</p>
                  </div>
                </div>
                <div className="flex space-x-2 mb-4">
                  <Badge variant="secondary">Mathematics</Badge>
                  <Badge variant="secondary">History</Badge>
                  <Badge variant="secondary">English</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                  industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and
                  scrambled
                </p>
                <div className="space-y-2 text-sm text-gray-500 mb-6">
                  <p>
                    <strong>Duration:</strong> 1 hour
                  </p>
                  <p>
                    <strong>Preferred Language:</strong> English
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <Button className="bg-black text-white hover:bg-gray-800 flex-1 mr-2">Book a session</Button>
                  <Button variant="outline" size="icon">
                    <Bookmark className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-bold">MF</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-black">Malsha Fernando</h3>
                    <p className="text-sm text-gray-500">Colombo</p>
                  </div>
                </div>
                <div className="flex space-x-2 mb-4">
                  <Badge variant="secondary">Chemistry</Badge>
                  <Badge variant="secondary">Art</Badge>
                  <Badge variant="secondary">Commerce</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                  industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and
                  scrambled
                </p>
                <div className="space-y-2 text-sm text-gray-500 mb-6">
                  <p>
                    <strong>Duration:</strong> 1 hour
                  </p>
                  <p>
                    <strong>Preferred Language:</strong> Sinhala
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <Button className="bg-black text-white hover:bg-gray-800 flex-1 mr-2">Book a session</Button>
                  <Button variant="outline" size="icon">
                    <Bookmark className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button variant="outline" size="lg" className="bg-gray-100 text-black border-gray-300">
              Load More Sessions
            </Button>
          </div>
        </div>
      </section>

      {/* Get Started Modal */}
      <GetStartedModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  )
}
