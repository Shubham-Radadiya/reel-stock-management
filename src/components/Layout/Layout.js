import React, { useState } from 'react';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import './Layout.css';

const Layout = ({ activeTab, setActiveTab, onLogout, userName, children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggle = () => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(!isSidebarOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className={`app-container ${isSidebarOpen ? 'sidebar-open' : ''} ${isCollapsed ? 'app-collapsed' : ''}`}>
      {/* Backdrop overlay for mobile sidebar */}
      {isSidebarOpen && <div className="sidebar-backdrop" onClick={closeSidebar}></div>}

      <Header 
        userName={userName} 
        isSidebarOpen={isSidebarOpen} 
        onToggle={handleToggle} 
      />

      <div className="layout-body">
        <Sidebar 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onLogout={onLogout}
          isSidebarOpen={isSidebarOpen}
          isCollapsed={isCollapsed}
          closeSidebar={closeSidebar}
        />

        {/* Main Content Area */}
        <main className={`main-content ${isCollapsed ? 'collapsed' : ''}`}>
          <div className="page-wrapper">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
