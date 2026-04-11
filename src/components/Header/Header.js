import React from 'react';
import { Menu, X, Package, User } from 'lucide-react';
import './Header.css';

const Header = ({ userName, isSidebarOpen, onToggle }) => {
  return (
    <header className="top-header">
      <div className="header-content">
        <div className="header-left">
          <button className="hamburger-btn" onClick={onToggle}>
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="logo-box">
            <Package size={24} color="white" />
          </div>
          <h2 className="header-title">Reel Stock Management</h2>
        </div>
        
        <div className="header-right">
          <div className="profile-section">
            <div className="user-details text-end me-3">
              <div className="user-name">{userName || 'User'}</div>
            </div>
            <div className="avatar-box">
              <User size={20} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
