import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff } from 'lucide-react';
import './Login.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin@123') {
      onLogin(username);
    } else {
      alert('Invalid credentials! Use: admin / admin@123');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="text-center mb-4">
          <div className="bg-primary text-white d-inline-flex p-3 rounded-circle mb-3">
            <Lock size={32} />
          </div>
          <h2 className="fw-bold mb-1">Welcome</h2>
          <p className="text-muted small">Reels Stock Management System</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold small">Username</label>
            <div className="input-group">
              <span className="input-group-text bg-light">
                <User size={18} />
              </span>
              <input 
                type="text" 
                className="form-control bg-light" 
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-2">
            <label className="form-label fw-semibold small">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-light">
                <Lock size={18} />
              </span>
              <input 
                type={showPassword ? "text" : "password"} 
                className="form-control bg-light" 
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button"
                className="btn btn-light border"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Hint directly visible */}
          <div className="mb-3 small text-muted">
            <span className="text-warning">💡 Hint:</span> Password is <strong>admin@123</strong>
          </div>

          <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;