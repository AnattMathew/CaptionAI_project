import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import ImageUploadPage from './components/ImageUploadPage';
import CaptionGenerationPage from './components/CaptionGenerationPage';
import CaptionStylingPage from './components/CaptionStylingPage';
import CaptionTranslationPage from './components/CaptionTranslationPage';
import ImageResizingPage from './components/ImageResizingPage';
import SocialSharingPage from './components/SocialSharingPage';
import AuthPage from './AuthPage';
import Dashboard from './Dashboard';
import ProtectedRoute from './ProtectedRoute';
import HomePage from './HomePage';

function App() {
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage setAuthToken={setAuthToken} />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isAuthenticated={!!localStorage.getItem('authToken')}>
              <Dashboard authToken={authToken} handleLogout={() => { localStorage.removeItem('authToken'); setAuthToken(null); }} />
            </ProtectedRoute>
          }
        >
          <Route path="upload" element={<ImageUploadPage />} />
          <Route path="generate-caption" element={<CaptionGenerationPage />} />
          <Route path="style-caption" element={<CaptionStylingPage />} />
          <Route path="translate-caption" element={<CaptionTranslationPage />} />
          <Route path="resize-image" element={<ImageResizingPage />} />
          <Route path="share-social" element={<SocialSharingPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
