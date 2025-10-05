import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md p-4 w-full flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">📸 CaptionAI</h1>
        <div className="space-x-4">
          <Link to="/auth" className="text-indigo-600 hover:text-indigo-800 font-medium">
            Login
          </Link>
          <Link
            to="/auth"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Register
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center p-4 w-full">
        <div className="bg-gray-700 p-8 rounded-lg shadow-md w-full max-w-4xl text-center flex flex-col md:flex-row items-center justify-between">
          {/* Text Content */}
          <div className="md:w-1/2 md:pr-8 mb-6 md:mb-0 text-left">
            <h2 className="text-4xl font-extrabold mb-4 text-gray-100">Unleash Your Creativity with AI Captions</h2>
            <p className="text-lg text-gray-200 mb-6">
              Generate creative and engaging captions for your images with the power of Artificial Intelligence. 
              Perfect for social media, blogs, and more!
            </p>
            <Link
              to="/auth"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Get Started Now
            </Link>
          </div>

          {/* Image Section */}
          <div className="md:w-1/2 md:pl-8">
            <img
              src="https://via.placeholder.com/600x400?text=AI+Caption+Generation"
              alt="AI Caption Generation"
              className="rounded-lg shadow-lg w-full h-auto object-cover"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default HomePage;
