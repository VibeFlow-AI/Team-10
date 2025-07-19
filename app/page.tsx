"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import GetStartedModal from "@/components/GetStartedModal";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6">
        <div className="text-2xl font-bold text-indigo-600">EduVibe</div>
        <Button onClick={openModal} size="lg">
          Get Started
        </Button>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center min-h-[80vh] text-center px-6">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Welcome to EduVibe
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl">
          AI-powered mentorship to help you learn better, faster.
        </p>
        <Button onClick={openModal} size="lg" className="text-lg px-8 py-3">
          Get Started
        </Button>
      </main>

      {/* Modal */}
      <GetStartedModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}
