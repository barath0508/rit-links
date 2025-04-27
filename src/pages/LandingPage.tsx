import React from 'react';
import { Link } from 'react-router-dom';
import { Lightbulb, GraduationCap, LibraryBig } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-blue-100 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <LibraryBig className="text-blue-600 h-8 w-8" />
            <h1 className="text-2xl font-bold text-gray-800">
              RIT Links <span className="text-blue-600">In</span>
            </h1>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-grow flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 bg-gradient-to-r from-blue-500 to-blue-400 text-white p-8 md:p-16 flex flex-col justify-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">RIT Links In</h2>
          <p className="text-xl mb-8">
            A verified skill-based student selection system for faculty projects at Rajalakshmi Institute of Technology.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center bg-white text-blue-600 rounded-lg shadow-md py-3 px-6 font-medium transition-transform hover:scale-105">
              <GraduationCap className="mr-2" />
              Are you a
              <Link to="/login?role=student" className="ml-2 underline font-semibold">
                Student
              </Link>
            </div>
            <div className="flex items-center bg-yellow-400 text-gray-800 rounded-lg shadow-md py-3 px-6 font-medium transition-transform hover:scale-105">
              <Lightbulb className="mr-2" />
              Are you a
              <Link to="/login?role=faculty" className="ml-2 underline font-semibold">
                Faculty
              </Link>
            </div>
          </div>
        </div>
        
        <div className="w-full md:w-1/2 bg-blue-50 p-8 md:p-16 flex items-center justify-center">
          <img 
            src="https://images.pexels.com/photos/3184436/pexels-photo-3184436.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
            alt="Students working together" 
            className="rounded-lg shadow-lg max-w-full h-auto object-cover"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center p-6">
              <div className="bg-blue-100 p-4 rounded-full inline-flex items-center justify-center mb-4">
                <GraduationCap className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Skill Verification</h3>
              <p className="text-gray-600">
                Upload certifications and projects to verify your skills and increase your chances of selection.
              </p>
            </div>
            
            <div className="card text-center p-6">
              <div className="bg-purple-100 p-4 rounded-full inline-flex items-center justify-center mb-4">
                <Lightbulb className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Project Matching</h3>
              <p className="text-gray-600">
                Faculty can find the most skilled students for their projects based on verified credentials.
              </p>
            </div>
            
            <div className="card text-center p-6">
              <div className="bg-yellow-100 p-4 rounded-full inline-flex items-center justify-center mb-4">
                <LibraryBig className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Seminar Management</h3>
              <p className="text-gray-600">
                Stay updated with ongoing seminars and register directly through the platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 RIT Links In. All rights reserved.</p>
          <p className="mt-2 text-gray-400">
            Rajalakshmi Institute of Technology
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;