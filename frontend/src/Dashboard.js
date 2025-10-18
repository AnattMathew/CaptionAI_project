import React from "react";
import { Link, Outlet, useLocation } from 'react-router-dom';

function Dashboard({ handleLogout, authToken }) {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname.includes(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
        <div className="px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl font-bold">📸</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              CaptionAI Dashboard
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </header>

      {/* Main Content Area with Sidebar */}
      <div className="flex">
        {/* Sidebar Navigation */}
        <nav className="w-72 bg-gradient-to-b from-gray-800 to-gray-900 text-white min-h-screen shadow-xl">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-8 text-gray-200">Features</h2>
            <div className="space-y-2">
              <Link 
                to="upload" 
                className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                  isActive('upload') 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg' 
                    : 'hover:bg-gray-700/50'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="font-medium">Image Upload</span>
              </Link>
              
              <Link 
                to="generate-caption" 
                className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                  isActive('generate-caption') 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg' 
                    : 'hover:bg-gray-700/50'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span className="font-medium">Caption Generation</span>
              </Link>
              
              <Link 
                to="style-caption" 
                className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                  isActive('style-caption') 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg' 
                    : 'hover:bg-gray-700/50'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
                <span className="font-medium">Caption Styling</span>
              </Link>
              
              <Link 
                to="translate-caption" 
                className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                  isActive('translate-caption') 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg' 
                    : 'hover:bg-gray-700/50'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                <span className="font-medium">Caption Translation</span>
              </Link>
              
              <Link 
                to="resize-image" 
                className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                  isActive('resize-image') 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg' 
                    : 'hover:bg-gray-700/50'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                <span className="font-medium">Image Resizing</span>
              </Link>
              
              <Link 
                to="share-social" 
                className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                  isActive('share-social') 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg' 
                    : 'hover:bg-gray-700/50'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.632-2.684 3 3 0 00-5.632 2.684zm0 9.316a3 3 0 105.632 2.684 3 3 0 00-5.632-2.684z" />
                </svg>
                <span className="font-medium">Social Sharing</span>
              </Link>
            </div>
          </div>
        </nav>

        {/* Page Content (Outlet) */}
        <main className="flex-grow p-8">
          <div className="max-w-6xl mx-auto">
            <Outlet context={{ authToken, handleLogout }} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
