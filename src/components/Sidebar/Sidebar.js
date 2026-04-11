import React from 'react';
import { LayoutDashboard, FileBarChart, LogOut } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ activeTab, setActiveTab, onLogout, isSidebarOpen, isCollapsed, closeSidebar }) => {
  return (
    <aside className={`sidebar ${isSidebarOpen ? 'show' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-content">
        <nav className="nav-menu">
          <button 
            type="button"
            className={`nav-item ${activeTab === 'reelstockmanagement' ? 'active' : ''}`}
            onClick={() => { setActiveTab('reelstockmanagement'); closeSidebar(); }}
          >
            <div className="nav-icon">
              <LayoutDashboard size={20} />
            </div>
            <span className="nav-label">Reel Stock Management</span>
            <div className="nav-indicator"></div>
          </button>
          <button 
            type="button"
            className={`nav-item ${activeTab === 'report' ? 'active' : ''}`}
            onClick={() => { setActiveTab('report'); closeSidebar(); }}
          >
            <div className="nav-icon">
              <FileBarChart size={20} />
            </div>
            <span className="nav-label">Reports</span>
            <div className="nav-indicator"></div>
          </button>
        </nav>

        <div className="sidebar-footer">
          <button 
            onClick={onLogout}
            className="logout-action"
          >
            <div className="logout-icon">
              <LogOut size={18} />
            </div>
            <span className="nav-label">Logout </span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
