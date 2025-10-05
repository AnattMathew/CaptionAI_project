import React from "react";
import { Link, Outlet } from 'react-router-dom';

function Dashboard({ handleLogout, authToken }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">📸 CaptionAI Dashboard</h1>
        <button
          onClick={handleLogout}
          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Logout
        </button>
      </header>

      {/* Main Content Area with Sidebar */}
      <div className="flex flex-grow">
        {/* Sidebar Navigation */}
        <nav className="w-64 bg-gray-800 text-white p-4 space-y-2">
          <h2 className="text-lg font-semibold mb-4">Features</h2>
          <Link to="upload" className="block p-2 rounded-md hover:bg-gray-700">Image Upload</Link>
          <Link to="generate-caption" className="block p-2 rounded-md hover:bg-gray-700">Caption Generation</Link>
          <Link to="style-caption" className="block p-2 rounded-md hover:bg-gray-700">Caption Styling</Link>
          <Link to="translate-caption" className="block p-2 rounded-md hover:bg-gray-700">Caption Translation</Link>
          <Link to="resize-image" className="block p-2 rounded-md hover:bg-gray-700">Image Resizing</Link>
          <Link to="share-social" className="block p-2 rounded-md hover:bg-gray-700">Social Sharing</Link>
        </nav>

        {/* Page Content (Outlet) */}
        <main className="flex-grow p-4">
          <Outlet context={{ authToken, handleLogout }} />
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
