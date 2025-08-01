import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

// Mock data for videos
const mockVideos = [
  {
    id: 1,
    title: "How to Build Amazing React Apps in 2025",
    thumbnail: "https://images.unsplash.com/photo-1678138091203-0ef330f790ec",
    channel: "TechMaster Pro",
    views: "2.1M",
    timestamp: "3 hours ago",
    duration: "15:32",
    description: "Learn the latest React features and best practices for building modern web applications. This comprehensive tutorial covers hooks, context, and performance optimization.",
    likes: "45K",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    id: 2,
    title: "EPIC Gaming Moments That Will SHOCK You!",
    thumbnail: "https://images.unsplash.com/photo-1678138091230-518b1c2ab824",
    channel: "GameMaster",
    views: "5.8M",
    timestamp: "1 day ago",
    duration: "20:45",
    description: "The most incredible gaming moments you've ever seen! Featuring insane plays, funny fails, and mind-blowing tricks.",
    likes: "123K",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    id: 3,
    title: "You Won't BELIEVE What Happens Next!",
    thumbnail: "https://images.unsplash.com/photo-1678138092285-683a875cb2d0",
    channel: "Comedy Central",
    views: "12M",
    timestamp: "2 days ago",
    duration: "8:15",
    description: "The funniest compilation of unexpected moments that will make you laugh until you cry!",
    likes: "567K",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    id: 4,
    title: "Mind-Blowing Science Experiments at Home",
    thumbnail: "https://images.unsplash.com/photo-1673767297353-0a4c8ad61b05",
    channel: "Science Lab",
    views: "3.2M",
    timestamp: "5 days ago",
    duration: "12:30",
    description: "Amazing science experiments you can do at home with simple materials. Perfect for kids and adults who love learning!",
    likes: "89K",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    id: 5,
    title: "Professional Video Production Setup 2025",
    thumbnail: "https://images.unsplash.com/photo-1616412875447-096e932d893c",
    channel: "FilmMaker Hub",
    views: "1.5M",
    timestamp: "1 week ago",
    duration: "18:20",
    description: "Complete guide to setting up a professional video production studio on any budget. Camera, lighting, and audio tips included.",
    likes: "34K",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    id: 6,
    title: "Behind the Scenes: Content Creator Life",
    thumbnail: "https://images.unsplash.com/photo-1525828024186-5294af6c926d",
    channel: "VlogMaster",
    views: "4.7M",
    timestamp: "3 days ago",
    duration: "14:55",
    description: "What it's really like being a full-time content creator. The good, the bad, and everything in between.",
    likes: "156K",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    id: 7,
    title: "The Future of Technology in 2025",
    thumbnail: "https://images.unsplash.com/photo-1678138092286-c9eb8a3e692d",
    channel: "Tech Today",
    views: "8.3M",
    timestamp: "6 hours ago",
    duration: "22:10",
    description: "Exploring the latest technological innovations that will change our world. AI, VR, and quantum computing explained.",
    likes: "234K",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    id: 8,
    title: "YouTube Algorithm Secrets REVEALED!",
    thumbnail: "https://images.unsplash.com/photo-1640725804478-ebf80960a3f4",
    channel: "Creator Academy",
    views: "6.1M",
    timestamp: "4 days ago",
    duration: "16:40",
    description: "Everything you need to know about how the YouTube algorithm works and how to get your videos recommended.",
    likes: "178K",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    id: 9,
    title: "Ultimate Home Studio Setup Guide",
    thumbnail: "https://images.pexels.com/photos/7595266/pexels-photo-7595266.jpeg",
    channel: "Studio Pro",
    views: "2.8M",
    timestamp: "1 week ago",
    duration: "19:25",
    description: "Build the perfect home studio for recording, streaming, and content creation. Equipment recommendations and setup tips.",
    likes: "67K",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    id: 10,
    title: "Professional Camera Techniques Masterclass",
    thumbnail: "https://images.pexels.com/photos/26803904/pexels-photo-26803904.jpeg",
    channel: "Camera Academy",
    views: "3.9M",
    timestamp: "2 weeks ago",
    duration: "25:15",
    description: "Master professional camera techniques used by Hollywood filmmakers. Composition, lighting, and movement explained.",
    likes: "112K",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  }
];

// Header Component
export const Header = ({ sidebarOpen, setSidebarOpen, darkMode, setDarkMode }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 h-14 flex items-center px-4">
      <div className="flex items-center">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full mr-4"
        >
          <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
          </svg>
        </button>
        <div 
          className="flex items-center cursor-pointer"
          onClick={() => navigate('/')}
        >
          <svg className="w-8 h-8 text-red-600 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
          <span className="text-xl font-bold text-gray-900 dark:text-white">YouTube</span>
        </div>
      </div>

      <div className="flex-1 max-w-2xl mx-8">
        <form onSubmit={handleSearch} className="flex">
          <div className="flex-1 flex">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="px-6 py-2 border border-l-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-r-full hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
            </button>
          </div>
        </form>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
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
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
          <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </button>
        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
          U
        </div>
      </div>
    </header>
  );
};

// Sidebar Component
export const Sidebar = ({ sidebarOpen }) => {
  const navigate = useNavigate();

  const menuItems = [
    { icon: '🏠', label: 'Home', path: '/' },
    { icon: '🔥', label: 'Trending' },
    { icon: '📺', label: 'Subscriptions' },
    { icon: '📚', label: 'Library' },
    { icon: '📜', label: 'History' },
    { icon: '⏰', label: 'Watch Later' },
    { icon: '👍', label: 'Liked Videos' },
    { icon: '🎵', label: 'Music' },
    { icon: '🎮', label: 'Gaming' },
    { icon: '📰', label: 'News' },
    { icon: '⚽', label: 'Sports' },
    { icon: '🎓', label: 'Learning' }
  ];

  return (
    <aside className={`fixed left-0 top-14 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-40 ${
      sidebarOpen ? 'w-60' : 'w-16'
    }`}>
      <div className="py-4">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className={`flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer ${
              item.path === '/' ? 'bg-gray-100 dark:bg-gray-800' : ''
            }`}
            onClick={() => item.path && navigate(item.path)}
          >
            <span className="text-xl">{item.icon}</span>
            {sidebarOpen && (
              <span className="ml-6 text-gray-700 dark:text-gray-300">{item.label}</span>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
};

// Video Card Component
const VideoCard = ({ video }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/watch?v=${video.id}`);
  };

  return (
    <div className="cursor-pointer group" onClick={handleClick}>
      <div className="relative mb-3">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full aspect-video object-cover rounded-lg group-hover:scale-105 transition-transform duration-200"
        />
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-1 py-0.5 rounded">
          {video.duration}
        </div>
      </div>
      <div className="flex">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-1">
            {video.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">{video.channel}</p>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {video.views} views • {video.timestamp}
          </p>
        </div>
      </div>
    </div>
  );
};

// Home Page Component
export const HomePage = () => {
  return (
    <div className="pt-14 p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mockVideos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
};

// Video Page Component
export const VideoPage = () => {
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get('v');
  const video = mockVideos.find(v => v.id === parseInt(videoId)) || mockVideos[0];
  const [liked, setLiked] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const recommendedVideos = mockVideos.filter(v => v.id !== video.id).slice(0, 5);

  return (
    <div className="pt-14 flex flex-col lg:flex-row gap-6 p-6">
      <div className="flex-1">
        {/* Video Player */}
        <div className="aspect-video bg-black rounded-lg mb-4">
          <iframe
            width="100%"
            height="100%"
            src={video.videoUrl}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-lg"
          ></iframe>
        </div>

        {/* Video Info */}
        <div className="mb-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {video.title}
          </h1>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                {video.channel[0]}
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{video.channel}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">1.2M subscribers</p>
              </div>
              <button
                onClick={() => setSubscribed(!subscribed)}
                className={`ml-4 px-4 py-2 rounded-full font-semibold ${
                  subscribed
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                {subscribed ? 'Subscribed' : 'Subscribe'}
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setLiked(!liked)}
                className={`flex items-center px-4 py-2 rounded-full ${
                  liked
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <svg className="w-5 h-5 mr-1" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558-.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777zM2.331 10.977a11.969 11.969 0 00-.831 4.398 12 12 0 00.52 3.507c.26.85 1.084 1.368 1.973 1.368H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 01-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227z"/>
                </svg>
                {video.likes}
              </button>
              <button className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                <svg className="w-5 h-5 mr-1" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"/>
                </svg>
                Share
              </button>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-6">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>{video.views} views</span>
            <span className="mx-2">•</span>
            <span>{video.timestamp}</span>
          </div>
          <p className="text-gray-900 dark:text-white">{video.description}</p>
        </div>

        {/* Comments Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Comments (1,234)
          </h3>
          <div className="space-y-4">
            {[1, 2, 3].map((comment) => (
              <div key={comment} className="flex">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                  U{comment}
                </div>
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <span className="font-semibold text-gray-900 dark:text-white">User{comment}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">2 hours ago</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    This is an amazing video! Thanks for sharing this content.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Videos Sidebar */}
      <div className="w-full lg:w-96">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recommended
        </h3>
        <div className="space-y-4">
          {recommendedVideos.map((recVideo) => (
            <div
              key={recVideo.id}
              className="flex cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg p-2"
              onClick={() => window.location.href = `/watch?v=${recVideo.id}`}
            >
              <div className="relative mr-3">
                <img
                  src={recVideo.thumbnail}
                  alt={recVideo.title}
                  className="w-40 aspect-video object-cover rounded-lg"
                />
                <div className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-xs px-1 py-0.5 rounded">
                  {recVideo.duration}
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2 mb-1">
                  {recVideo.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{recVideo.channel}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {recVideo.views} views
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};