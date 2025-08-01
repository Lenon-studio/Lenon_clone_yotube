import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import './App.css';
import { 
  Header, 
  Sidebar, 
  HomePage, 
  VideoPage, 
  StoriesSection,
  ChatSidebar,
  ProfilePage,
  LiveStreamPage,
  LoginModal
} from './components';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [activeChat, setActiveChat] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className={`App ${darkMode ? 'dark' : ''}`}>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
          <Header 
            sidebarOpen={sidebarOpen} 
            setSidebarOpen={setSidebarOpen}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            user={user}
            setShowLogin={setShowLogin}
            chatOpen={chatOpen}
            setChatOpen={setChatOpen}
          />
          <div className="flex">
            <Sidebar sidebarOpen={sidebarOpen} user={user} />
            <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-60' : 'ml-16'} ${chatOpen ? 'mr-80' : ''}`}>
              <StoriesSection />
              <Routes>
                <Route path="/" element={<HomePage user={user} />} />
                <Route path="/watch" element={<VideoPage user={user} setActiveChat={setActiveChat} />} />
                <Route path="/profile/:userId" element={<ProfilePage user={user} />} />
                <Route path="/live/:streamId" element={<LiveStreamPage user={user} />} />
              </Routes>
            </div>
            {chatOpen && (
              <ChatSidebar 
                user={user} 
                activeChat={activeChat}
                setActiveChat={setActiveChat}
                setChatOpen={setChatOpen}
              />
            )}
          </div>
          {showLogin && (
            <LoginModal 
              onClose={() => setShowLogin(false)}
              setUser={setUser}
            />
          )}
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;