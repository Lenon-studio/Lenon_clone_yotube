import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { Header, Sidebar, HomePage, VideoPage } from './components';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`App ${darkMode ? 'dark' : ''}`}>
      <BrowserRouter>
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
          <Header 
            sidebarOpen={sidebarOpen} 
            setSidebarOpen={setSidebarOpen}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />
          <div className="flex">
            <Sidebar sidebarOpen={sidebarOpen} />
            <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-60' : 'ml-16'}`}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/watch" element={<VideoPage />} />
              </Routes>
            </div>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;