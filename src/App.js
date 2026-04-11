import React, { useState } from 'react';
import Login from './components/Login/Login';
import Layout from './components/Layout/Layout';
import ReelStockManagement from './components/ReelStockManagement/ReelStockManagement';
import Report from './components/Report/Report';
import { initialReels } from './data/mockData';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [activeTab, setActiveTab] = useState('reelstockmanagement');
  const [reels, setReels] = useState(initialReels);

  const handleLogin = (user) => {
    setUserName(user);
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      onLogout={() => setIsLoggedIn(false)}
      userName={userName}
    >
      {activeTab === 'reelstockmanagement' ? (
        <ReelStockManagement reels={reels} setReels={setReels} />
      ) : (
        <Report reels={reels} />
      )}
    </Layout>
  );
}

export default App;
