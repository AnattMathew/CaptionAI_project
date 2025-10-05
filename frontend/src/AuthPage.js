import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthPage.css'; // We'll create this CSS file next

function AuthPage({ setAuthToken }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [password2, setPassword2] = useState(''); // New state for confirm password

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setError(null); // Clear errors when toggling
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const url = isLogin ? "/api/auth/login/" : "/api/auth/registration/";
    const body = isLogin
      ? { email, password, username: '' } // Explicitly include blank username for login
      : { username: '', email, password1: password, password2: password2 }; // Explicitly send empty username for registration

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || errorData.error || 'Authentication failed.');
      }

      const data = await response.json();
      const token = data.token || data.key || data.access || data.auth_token;
      if (!token) {
        throw new Error('No auth token returned by server.');
      }
      localStorage.setItem('authToken', token);
      setAuthToken(token);
      navigate('/dashboard/upload');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLogin ? 'Login' : 'Register'}</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                
                disabled={loading}
              />
            </div>
          )}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="password2">Confirm Password</label>
              <input
                type="password"
                id="password2"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          )}
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? (isLogin ? 'Logging in...' : 'Registering...') : (isLogin ? 'Login' : 'Register')}
          </button>
        </form>
        <p onClick={handleToggle} className="toggle-link">
          {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
        </p>
      </div>
    </div>
  );
}

export default AuthPage;
