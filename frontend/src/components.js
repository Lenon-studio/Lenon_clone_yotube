import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  updateProfile
} from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  increment
} from 'firebase/firestore';
import { auth, firestore } from './firebase';

// Enhanced mock data with more social features
const mockVideos = [
  {
    id: 1,
    title: "How to Build Amazing React Apps in 2025 🚀",
    thumbnail: "https://images.unsplash.com/photo-1678138091203-0ef330f790ec",
    channel: "TechMaster Pro",
    channelAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
    views: "2.1M",
    timestamp: "3 hours ago",
    duration: "15:32",
    description: "Learn everything about building modern React applications with the latest features and best practices. We'll cover hooks, context, performance optimization, and so much more!",
    likes: 45000,
    dislikes: 1200,
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    tags: ["React", "JavaScript", "Frontend", "Tutorial"],
    isLive: false,
    comments: 1234
  },
  {
    id: 2,
    title: "EPIC Gaming Moments That Will SHOCK You! 😱",
    thumbnail: "https://images.unsplash.com/photo-1678138091230-518b1c2ab824",
    channel: "GameMaster",
    channelAvatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d",
    views: "5.8M",
    timestamp: "1 day ago",
    duration: "20:45",
    description: "The most incredible gaming moments you've ever seen! Featuring insane plays, funny fails, and mind-blowing tricks from top streamers.",
    likes: 123000,
    dislikes: 8000,
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    tags: ["Gaming", "Entertainment", "Funny", "Compilation"],
    isLive: false,
    comments: 5678
  },
  {
    id: 3,
    title: "🔴 LIVE: Breaking Tech News & Community Chat",
    thumbnail: "https://images.unsplash.com/photo-1678138092285-683a875cb2d0",
    channel: "Tech News Live",
    channelAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    views: "12K watching",
    timestamp: "Started 2 hours ago",
    duration: "LIVE",
    description: "Join us for live breaking tech news and interactive community discussion!",
    likes: 567,
    dislikes: 23,
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    tags: ["Live", "Tech News", "Discussion"],
    isLive: true,
    comments: 450
  },
  {
    id: 4,
    title: "Mind-Blowing Science Experiments at Home 🧪",
    thumbnail: "https://images.unsplash.com/photo-1673767297353-0a4c8ad61b05",
    channel: "Science Lab",
    channelAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    views: "3.2M",
    timestamp: "5 days ago",
    duration: "12:30",
    description: "Amazing science experiments you can do at home with simple materials. Perfect for kids and adults who love learning!",
    likes: 89000,
    dislikes: 2300,
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    tags: ["Science", "Education", "DIY", "Experiments"],
    isLive: false,
    comments: 3421
  }
];

const mockStories = [
  {
    id: 1,
    username: "techmaster",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
    thumbnail: "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a",
    isViewed: false,
    timestamp: "2h ago"
  },
  {
    id: 2,
    username: "gamemaster",
    avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d",
    thumbnail: "https://images.unsplash.com/photo-1600096194534-95cf5ece04cf",
    isViewed: true,
    timestamp: "5h ago"
  },
  {
    id: 3,
    username: "sciencelab",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    thumbnail: "https://images.unsplash.com/photo-1603145733146-ae562a55031e",
    isViewed: false,
    timestamp: "1d ago"
  }
];

// Login Modal Component
export const LoginModal = ({ onClose, setUser }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        setUser(userCredential.user);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName });
        setUser(userCredential.user);
      }
      onClose();
    } catch (error) {
      console.error('Auth error:', error);
      alert(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg w-96">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="Ad Soyad"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
              required
            />
          )}
          <input
            type="email"
            placeholder="E-posta"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
            required
          />
          <input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? 'Lütfen bekleyin...' : (isLogin ? 'Giriş Yap' : 'Kayıt Ol')}
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-red-600 hover:text-red-700"
          >
            {isLogin ? 'Hesabın yok mu? Kayıt ol' : 'Hesabın var mı? Giriş yap'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Enhanced Header Component
export const Header = ({ sidebarOpen, setSidebarOpen, darkMode, setDarkMode, user, setShowLogin, chatOpen, setChatOpen }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 h-16 flex items-center px-4 shadow-sm">
      <div className="flex items-center">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full mr-4 transition-colors"
        >
          <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
          </svg>
        </button>
        <div 
          className="flex items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-2 transition-colors"
          onClick={() => navigate('/')}
        >
          <svg className="w-9 h-9 text-red-600 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
          <span className="text-xl font-bold text-gray-900 dark:text-white">YuTube</span>
          <span className="text-xs bg-gradient-to-r from-pink-500 to-purple-600 text-white px-2 py-1 rounded-full ml-2">Social</span>
        </div>
      </div>

      <div className="flex-1 max-w-2xl mx-8">
        <form onSubmit={handleSearch} className="flex">
          <div className="flex-1 flex relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Video, kanal veya kullanıcı ara..."
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-l-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
            />
            <button
              type="submit"
              className="px-6 py-3 border border-l-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-r-full hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
            </button>
          </div>
        </form>
      </div>

      <div className="flex items-center space-x-3">
        {/* Chat Toggle */}
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className={`p-2 rounded-full transition-colors relative ${
            chatOpen ? 'bg-red-100 text-red-600' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
          }`}
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
          </svg>
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
        >
          {darkMode ? (
            <svg className="w-6 h-6 text-yellow-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"/>
            </svg>
          ) : (
            <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"/>
            </svg>
          )}
        </button>

        {/* Notifications */}
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full relative transition-colors">
          <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
          </svg>
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">5</span>
        </button>

        {/* User Profile */}
        {user ? (
          <div className="flex items-center space-x-3">
            <div 
              className="w-8 h-8 rounded-full overflow-hidden cursor-pointer ring-2 ring-red-500"
              onClick={() => navigate(`/profile/${user.uid}`)}
            >
              <img 
                src={user.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"} 
                alt={user.displayName || "Profile"}
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-red-600"
            >
              Çıkış
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowLogin(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full font-medium transition-colors"
          >
            Giriş Yap
          </button>
        )}
      </div>
    </header>
  );
};

// Stories Section Component
export const StoriesSection = () => {
  const [selectedStory, setSelectedStory] = useState(null);

  return (
    <>
      <div className="pt-16 pb-4 px-6 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4 overflow-x-auto scrollbar-hide">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-0.5 cursor-pointer">
              <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 7v2.99s-1.99.01-2 0V7h-3s.01-1.99 0-2h3V2h2v3h3v2h-3zm-3 4V8h-3V5H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8h-3zM5 19l3-4 2 3 3-4 4 5H5z"/>
                </svg>
              </div>
            </div>
            <p className="text-xs text-center mt-1 text-gray-600 dark:text-gray-400">Hikaye Ekle</p>
          </div>
          
          {mockStories.map((story) => (
            <div 
              key={story.id} 
              className="flex-shrink-0 cursor-pointer"
              onClick={() => setSelectedStory(story)}
            >
              <div className={`w-16 h-16 rounded-full p-0.5 ${
                story.isViewed 
                  ? 'bg-gray-300' 
                  : 'bg-gradient-to-r from-purple-500 via-red-500 to-yellow-500'
              }`}>
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-white">
                  <img 
                    src={story.avatar} 
                    alt={story.username}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <p className="text-xs text-center mt-1 text-gray-600 dark:text-gray-400 truncate w-16">
                @{story.username}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Story Modal */}
      {selectedStory && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <button
            onClick={() => setSelectedStory(null)}
            className="absolute top-4 right-4 text-white text-2xl z-10"
          >
            ×
          </button>
          <div className="relative w-full max-w-md">
            <img 
              src={selectedStory.thumbnail} 
              alt="Story"
              className="w-full h-screen object-cover"
            />
            <div className="absolute bottom-4 left-4 text-white">
              <p className="font-semibold">@{selectedStory.username}</p>
              <p className="text-sm opacity-75">{selectedStory.timestamp}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Enhanced Sidebar Component
export const Sidebar = ({ sidebarOpen, user }) => {
  const navigate = useNavigate();

  const menuItems = [
    { icon: '🏠', label: 'Ana Sayfa', path: '/', color: 'text-red-600' },
    { icon: '🔥', label: 'Trending', color: 'text-orange-500' },
    { icon: '📺', label: 'Abonelikler', color: 'text-blue-600' },
    { icon: '🎮', label: 'Oyun', color: 'text-purple-600' },
    { icon: '🎵', label: 'Müzik', color: 'text-green-600' },
    { icon: '📰', label: 'Haberler', color: 'text-gray-600' },
    { icon: '⚽', label: 'Spor', color: 'text-yellow-600' },
    { icon: '🎓', label: 'Eğitim', color: 'text-indigo-600' },
  ];

  const libraryItems = [
    { icon: '📚', label: 'Kitaplığım' },
    { icon: '📜', label: 'Geçmiş' },
    { icon: '⏰', label: 'Daha Sonra İzle' },
    { icon: '👍', label: 'Beğendiklerim' },
    { icon: '📥', label: 'İndirilenler' },
  ];

  return (
    <aside className={`fixed left-0 top-16 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-40 overflow-y-auto ${
      sidebarOpen ? 'w-60' : 'w-16'
    }`}>
      <div className="py-4">
        {/* Main Menu */}
        <div className={`${sidebarOpen ? 'px-4' : 'px-2'}`}>
          {menuItems.map((item, index) => (
            <div
              key={index}
              className={`flex items-center py-3 px-3 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer rounded-lg mb-1 transition-colors ${
                item.path === '/' ? 'bg-gray-100 dark:bg-gray-800' : ''
              }`}
              onClick={() => item.path && navigate(item.path)}
            >
              <span className={`text-xl ${item.color || 'text-gray-600'}`}>{item.icon}</span>
              {sidebarOpen && (
                <span className="ml-6 text-gray-700 dark:text-gray-300 font-medium">{item.label}</span>
              )}
            </div>
          ))}
        </div>

        {sidebarOpen && (
          <>
            <hr className="my-4 border-gray-200 dark:border-gray-700" />
            
            {/* Library Section */}
            <div className="px-4">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
                Kitaplık
              </h3>
              {libraryItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer rounded-lg mb-1 transition-colors"
                >
                  <span className="text-lg text-gray-600">{item.icon}</span>
                  <span className="ml-6 text-gray-700 dark:text-gray-300">{item.label}</span>
                </div>
              ))}
            </div>

            <hr className="my-4 border-gray-200 dark:border-gray-700" />
            
            {/* Subscriptions */}
            <div className="px-4">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
                Abonelikler
              </h3>
              {mockVideos.slice(0, 3).map((video) => (
                <div key={video.id} className="flex items-center py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer rounded-lg mb-1 transition-colors">
                  <img 
                    src={video.channelAvatar} 
                    alt={video.channel}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="ml-3 text-gray-700 dark:text-gray-300 text-sm truncate">{video.channel}</span>
                  {video.isLive && (
                    <span className="ml-auto w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </aside>
  );
};

// Enhanced Video Card Component
const VideoCard = ({ video, user }) => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleClick = () => {
    navigate(`/watch?v=${video.id}`);
  };

  const formatViews = (views) => {
    if (typeof views === 'string') return views;
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  return (
    <div className="group cursor-pointer">
      <div className="relative mb-3" onClick={handleClick}>
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full aspect-video object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded-md font-medium">
          {video.duration}
        </div>
        {video.isLive && (
          <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded-md font-bold">
            🔴 CANLI
          </div>
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300 rounded-xl"></div>
      </div>
      
      <div className="flex">
        <img 
          src={video.channelAvatar} 
          alt={video.channel}
          className="w-10 h-10 rounded-full object-cover mr-3 cursor-pointer hover:ring-2 hover:ring-red-500 transition-all"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-1 group-hover:text-red-600 transition-colors cursor-pointer" onClick={handleClick}>
            {video.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm hover:text-gray-800 dark:hover:text-gray-200 cursor-pointer">
            {video.channel}
          </p>
          <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mt-1">
            <span>{formatViews(video.views)} görüntüleme</span>
            <span className="mx-2">•</span>
            <span>{video.timestamp}</span>
          </div>
          
          {/* Interaction buttons */}
          <div className="flex items-center space-x-4 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsLiked(!isLiked);
              }}
              className={`flex items-center space-x-1 text-xs ${isLiked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'}`}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>{formatViews(video.likes)}</span>
            </button>
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsSaved(!isSaved);
              }}
              className={`text-xs ${isSaved ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'}`}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Home Page Component
export const HomePage = ({ user }) => {
  const [filter, setFilter] = useState('all');
  
  const filters = [
    { id: 'all', label: 'Tümü', icon: '🌟' },
    { id: 'live', label: 'Canlı', icon: '🔴' },
    { id: 'gaming', label: 'Oyun', icon: '🎮' },
    { id: 'music', label: 'Müzik', icon: '🎵' },
    { id: 'education', label: 'Eğitim', icon: '🎓' },
    { id: 'tech', label: 'Teknoloji', icon: '💻' },
  ];

  const filteredVideos = filter === 'all' 
    ? mockVideos 
    : filter === 'live' 
      ? mockVideos.filter(v => v.isLive)
      : mockVideos;

  return (
    <div className="p-6">
      {/* Filter Pills */}
      <div className="flex items-center space-x-3 mb-6 overflow-x-auto scrollbar-hide">
        {filters.map((filterItem) => (
          <button
            key={filterItem.id}
            onClick={() => setFilter(filterItem.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              filter === filterItem.id
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <span>{filterItem.icon}</span>
            <span className="font-medium">{filterItem.label}</span>
          </button>
        ))}
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {filteredVideos.map((video) => (
          <VideoCard key={video.id} video={video} user={user} />
        ))}
      </div>
    </div>
  );
};

// Chat Sidebar Component
export const ChatSidebar = ({ user, activeChat, setActiveChat, setChatOpen }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([
    { id: 1, name: 'TechMaster', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde', isOnline: true },
    { id: 2, name: 'GameMaster', avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d', isOnline: true },
    { id: 3, name: 'Science Lab', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80', isOnline: false },
  ]);

  const mockMessages = [
    { id: 1, user: 'TechMaster', message: 'Harika video! React konusunda çok yararlı bilgiler var.', timestamp: '10:30', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde' },
    { id: 2, user: 'GameMaster', message: 'Bu kodları deneyeceğim kesinlikle 🚀', timestamp: '10:32', avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d' },
    { id: 3, user: user?.displayName || 'Sen', message: 'Bende çok beğendim, sürekli takip ediyorum', timestamp: '10:35', avatar: user?.photoURL || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330', isCurrentUser: true },
  ];

  useEffect(() => {
    setMessages(mockMessages);
  }, [activeChat]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      user: user?.displayName || 'Sen',
      message: newMessage,
      timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      avatar: user?.photoURL || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
      isCurrentUser: true
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  return (
    <div className="fixed right-0 top-16 h-full w-80 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 dark:text-white">Sohbet</h3>
        <button 
          onClick={() => setChatOpen(false)}
          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>

      {/* Online Users */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Çevrimiçi ({onlineUsers.filter(u => u.isOnline).length})</h4>
        <div className="space-y-2">
          {onlineUsers.map((user) => (
            <div key={user.id} className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg p-2">
              <div className="relative">
                <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                {user.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300">{user.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isCurrentUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-start space-x-2 max-w-xs ${msg.isCurrentUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <img src={msg.avatar} alt={msg.user} className="w-6 h-6 rounded-full object-cover" />
              <div className={`rounded-lg p-3 ${
                msg.isCurrentUser 
                  ? 'bg-red-600 text-white' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
              }`}>
                <p className="text-sm">{msg.message}</p>
                <p className={`text-xs mt-1 ${msg.isCurrentUser ? 'text-red-100' : 'text-gray-500 dark:text-gray-400'}`}>
                  {msg.timestamp}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <form onSubmit={sendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Mesaj yaz..."
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:border-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

// Enhanced Video Page Component
export const VideoPage = ({ user, setActiveChat }) => {
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get('v');
  const video = mockVideos.find(v => v.id === parseInt(videoId)) || mockVideos[0];
  const [liked, setLiked] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [comments, setComments] = useState([
    { id: 1, user: 'TechMaster', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde', comment: 'Harika anlatım! Çok faydalı oldu.', likes: 12, timestamp: '2 saat önce' },
    { id: 2, user: 'CodeGuru', avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d', comment: 'Bu kodları kendi projemde deneyeceğim 🚀', likes: 8, timestamp: '4 saat önce' },
    { id: 3, user: 'WebDev', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80', comment: 'Sürekli takip ediyorum, her videoyu bekliyorum!', likes: 15, timestamp: '1 gün önce' },
  ]);
  const [newComment, setNewComment] = useState('');

  const recommendedVideos = mockVideos.filter(v => v.id !== video.id).slice(0, 5);

  const addComment = (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    const comment = {
      id: Date.now(),
      user: user.displayName || 'Anonim',
      avatar: user.photoURL || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
      comment: newComment,
      likes: 0,
      timestamp: 'Şimdi',
      isCurrentUser: true
    };

    setComments([comment, ...comments]);
    setNewComment('');
  };

  return (
    <div className="pt-4 flex flex-col lg:flex-row gap-6 p-6">
      <div className="flex-1">
        {/* Video Player */}
        <div className="aspect-video bg-black rounded-xl mb-4 overflow-hidden shadow-2xl">
          <iframe
            width="100%"
            height="100%"
            src={video.videoUrl}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-xl"
          ></iframe>
        </div>

        {/* Video Info */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            {video.title}
          </h1>
          
          {/* Channel Info & Actions */}
          <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
            <div className="flex items-center">
              <img 
                src={video.channelAvatar} 
                alt={video.channel}
                className="w-12 h-12 rounded-full object-cover mr-4 ring-2 ring-gray-200 dark:ring-gray-700"
              />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-lg">{video.channel}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">1.2M abone</p>
              </div>
              <button
                onClick={() => setSubscribed(!subscribed)}
                className={`ml-6 px-6 py-2 rounded-full font-semibold transition-colors ${
                  subscribed
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                {subscribed ? '✓ Abone oldun' : 'Abone ol'}
              </button>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setLiked(!liked)}
                className={`flex items-center px-4 py-2 rounded-full transition-colors ${
                  liked
                    ? 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {video.likes > 1000 ? `${(video.likes/1000).toFixed(1)}K` : video.likes}
              </button>
              
              <button className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                Paylaş
              </button>
              
              <button className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                İndir
              </button>
            </div>
          </div>

          {/* Video Stats */}
          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
            <span>{video.views} görüntüleme</span>
            <span>•</span>
            <span>{video.timestamp}</span>
            <span>•</span>
            <span>{video.tags.map(tag => `#${tag}`).join(' ')}</span>
          </div>
        </div>

        {/* Description */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 mb-6">
          <p className="text-gray-900 dark:text-white leading-relaxed">{video.description}</p>
        </div>

        {/* Comments Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Yorumlar ({comments.length})
            </h3>
            <button 
              onClick={() => setActiveChat('video-chat')}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
              </svg>
              <span>Canlı Sohbet</span>
            </button>
          </div>
          
          {/* Add Comment */}
          {user && (
            <form onSubmit={addComment} className="mb-6">
              <div className="flex space-x-3">
                <img 
                  src={user.photoURL || "https://images.unsplash.com/photo-1494790108377-be9c29b29330"} 
                  alt="Your avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Yorum ekle..."
                    className="w-full p-3 border-b-2 border-gray-300 dark:border-gray-600 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:border-red-500 resize-none"
                    rows="2"
                  />
                  <div className="flex justify-end space-x-2 mt-2">
                    <button
                      type="button"
                      onClick={() => setNewComment('')}
                      className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                    >
                      İptal
                    </button>
                    <button
                      type="submit"
                      disabled={!newComment.trim()}
                      className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Yorum Yap
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}
          
          {/* Comments List */}
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="flex space-x-3">
                <img 
                  src={comment.avatar} 
                  alt={comment.user}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-semibold text-gray-900 dark:text-white">{comment.user}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{comment.timestamp}</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">{comment.comment}</p>
                  <div className="flex items-center space-x-4 text-sm">
                    <button className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-red-600">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                      </svg>
                      <span>{comment.likes}</span>
                    </button>
                    <button className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
                      Yanıtla
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Videos Sidebar */}
      <div className="w-full lg:w-96">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Önerilen Videolar
        </h3>
        <div className="space-y-4">
          {recommendedVideos.map((recVideo) => (
            <div
              key={recVideo.id}
              className="flex cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg p-2 transition-colors"
              onClick={() => window.location.href = `/watch?v=${recVideo.id}`}
            >
              <div className="relative mr-3 flex-shrink-0">
                <img
                  src={recVideo.thumbnail}
                  alt={recVideo.title}
                  className="w-40 aspect-video object-cover rounded-lg"
                />
                <div className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-xs px-1 py-0.5 rounded">
                  {recVideo.duration}
                </div>
                {recVideo.isLive && (
                  <div className="absolute top-1 left-1 bg-red-600 text-white text-xs px-1 py-0.5 rounded">
                    🔴 CANLI
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2 mb-1">
                  {recVideo.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{recVideo.channel}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {recVideo.views} görüntüleme • {recVideo.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Profile Page Component
export const ProfilePage = ({ user }) => {
  const [activeTab, setActiveTab] = useState('videos');
  
  const tabs = [
    { id: 'videos', label: 'Videolar', icon: '🎬' },
    { id: 'playlists', label: 'Oynatma Listeleri', icon: '📋' },
    { id: 'community', label: 'Topluluk', icon: '👥' },
    { id: 'about', label: 'Hakkında', icon: 'ℹ️' }
  ];

  return (
    <div className="pt-4 p-6">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-red-500 to-purple-600 rounded-xl p-8 mb-6 text-white">
        <div className="flex items-center space-x-6">
          <img 
            src={user?.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"} 
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
          />
          <div>
            <h1 className="text-3xl font-bold mb-2">{user?.displayName || 'Kullanici Adı'}</h1>
            <p className="opacity-90 mb-2">@{user?.displayName?.toLowerCase().replace(' ', '') || 'kullanici'}</p>
            <div className="flex items-center space-x-6 text-sm">
              <span>1.2M abone</span>
              <span>•</span>
              <span>156 video</span>
              <span>•</span>
              <span>Katıldığı tarih: Ocak 2020</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-6 py-3 font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-red-600 border-b-2 border-red-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'videos' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mockVideos.slice(0, 8).map((video) => (
              <VideoCard key={video.id} video={video} user={user} />
            ))}
          </div>
        )}
        
        {activeTab === 'about' && (
          <div className="max-w-4xl">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Kanal Hakkında</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Bu kanalda teknoloji, programlama ve dijital içerik oluşturma hakkında videolar paylaşıyorum. 
                Amacım kaliteli ve eğitici içerikler sunarak topluma fayda sağlamak.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h3 className="font-semibold mb-2">İstatistikler</h3>
                  <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <li>Toplam görüntüleme: 50M+</li>
                    <li>Yüklenen video: 156</li>
                    <li>Abone sayısı: 1.2M</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Sosyal Medya</h3>
                  <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <li>Twitter: @kullanici</li>
                    <li>Instagram: @kullanici</li>
                    <li>Web: kullanici.com</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Live Stream Page Component  
export const LiveStreamPage = ({ user }) => {
  return (
    <div className="pt-4 p-6">
      <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white p-6 rounded-xl mb-6">
        <h1 className="text-2xl font-bold mb-2">🔴 Canlı Yayın</h1>
        <p>Bu özellik yakında aktif olacak!</p>
      </div>
    </div>
  );
};