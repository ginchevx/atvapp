import React, { useState, useEffect, useRef } from 'react';
import { Play, Plus, Star, TrendingUp, Film, Tv, Newspaper, Settings, Edit, Trash2, X, Upload, ChevronDown, ChevronUp, Clock, Download, UploadCloud, Zap, Users, Calendar, Heart, Share2, Bookmark, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';
import { cloudStorage } from './utils/storage';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState('tvshows');
  const [selectedShow, setSelectedShow] = useState(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [showSignup, setShowSignup] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [expandedSeasons, setExpandedSeasons] = useState({});
  const [gradientPosition, setGradientPosition] = useState({ x: 50, y: 50 });
  const [editingEpisode, setEditingEpisode] = useState(null);
  const [episodeFormData, setEpisodeFormData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState('');
  const [activeSeason, setActiveSeason] = useState(null);
  const [videoPlayer, setVideoPlayer] = useState({ isPlaying: false, currentTime: 0, volume: 1 });
  
  // App version
  const APP_VERSION = "2.0.0";

  // Initial data structure
  const initialData = {
    shows: [
      {
        id: 1,
        title: "Stellar Horizons",
        type: "tvshow",
        category: "Sci-Fi",
        image: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&q=80",
        description: "A crew of explorers ventures into the unknown reaches of space, discovering ancient civilizations and facing cosmic threats.",
        rating: 9.2,
        seasons: 3,
        episodes: 24,
        cast: ["Emma Stone", "Oscar Isaac", "Tilda Swinton"],
        year: 2024,
        isTrending: true,
        isFeatured: true,
        tags: ["Space", "Adventure", "Mystery"],
        seasonsData: [
          {
            seasonNumber: 1,
            year: 2024,
            description: "The beginning of an epic space journey",
            episodes: [
              {
                id: 1,
                episodeNumber: 1,
                title: "The Final Frontier",
                description: "The crew embarks on their maiden voyage into deep space, encountering unexpected challenges.",
                duration: 52,
                rating: 8.9,
                image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&q=80",
                director: "Christopher Nolan",
                writer: "Jonathan Nolan",
                releaseDate: "2024-01-15"
              },
              {
                id: 2,
                episodeNumber: 2,
                title: "First Contact",
                description: "The team makes an incredible discovery that could change humanity forever.",
                duration: 48,
                rating: 9.1,
                image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&q=80",
                director: "Denis Villeneuve",
                writer: "Eric Heisserer",
                releaseDate: "2024-01-22"
              }
            ]
          }
        ]
      }
    ],
    news: [
      {
        id: 1,
        title: "Stellar Horizons Renewed for Season 4",
        date: "2 days ago",
        excerpt: "The hit sci-fi series gets the green light for another season following record-breaking viewership.",
        image: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&q=80",
        category: "Series News",
        author: "Entertainment Weekly"
      }
    ],
    actors: [
      { name: "Emma Stone", trending: 98, shows: ["Stellar Horizons"], image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80", bio: "Academy Award winning actress" },
      { name: "Oscar Isaac", trending: 95, shows: ["Stellar Horizons"], image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80", bio: "Golden Globe nominated actor" }
    ],
    userData: {
      watchlist: [],
      continueWatching: [],
      preferences: {}
    }
  };

  const [data, setData] = useState(initialData);
  const { shows, news, actors, userData } = data;

  const [adminMode, setAdminMode] = useState('shows');
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  const categories = ["Action", "Romance", "Comedy", "Drama", "Sci-Fi", "Fantasy", "Horror", "Thriller", "Crime", "Documentary", "Animation", "Family"];
  const colors = {
    primary: 'from-purple-600 to-pink-600',
    secondary: 'from-blue-500 to-cyan-500',
    accent: 'from-orange-500 to-red-500',
    success: 'from-green-500 to-emerald-500'
  };

  // Refs for dropdowns
  const seasonRefs = useRef({});

  // Enhanced gradient animation
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setGradientPosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Auto-animate gradient
  useEffect(() => {
    const interval = setInterval(() => {
      setGradientPosition(prev => ({
        x: Math.max(20, Math.min(80, prev.x + (Math.random() - 0.5) * 4)),
        y: Math.max(20, Math.min(80, prev.y + (Math.random() - 0.5) * 4))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Load data from cloud storage
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const savedData = await cloudStorage.loadAllData();
        if (savedData) {
          setData(prev => ({ ...prev, ...savedData }));
          console.log('Data loaded from cloud storage');
        } else {
          // Initialize with default data
          await cloudStorage.saveAllData(initialData);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Save data when it changes
  useEffect(() => {
    const saveData = async () => {
      if (!isLoading) {
        setSaveStatus('Saving...');
        const success = await cloudStorage.saveAllData(data);
        setSaveStatus(success ? 'Saved' : 'Error saving');
        setTimeout(() => setSaveStatus(''), 2000);
      }
    };

    const timeoutId = setTimeout(saveData, 1000);
    return () => clearTimeout(timeoutId);
  }, [data, isLoading]);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');
    
    try {
      const users = JSON.parse(localStorage.getItem('appletv_users') || '{}');
      const userData = users[loginEmail];
      
      if (!userData) {
        setLoginError('Account not found. Please sign up first.');
        return;
      }
      
      if (userData.password !== loginPassword) {
        setLoginError('Incorrect password. Please try again.');
        return;
      }
      
      setCurrentUser(userData);
      setIsLoggedIn(true);
      setIsAdmin(userData.isAdmin || false);
    } catch (error) {
      setLoginError('Error logging in. Please try again.');
      console.error('Login error:', error);
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    setLoginError('');
    
    if (signupPassword !== signupConfirmPassword) {
      setLoginError('Passwords do not match.');
      return;
    }
    
    if (signupPassword.length < 6) {
      setLoginError('Password must be at least 6 characters long.');
      return;
    }
    
    try {
      const users = JSON.parse(localStorage.getItem('appletv_users') || '{}');
      
      if (users[signupEmail]) {
        setLoginError('An account with this email already exists.');
        return;
      }
      
      const isAdminEmail = signupEmail === 'admin@apple.tv' || signupEmail === 'ginchevalex@gmail.com';
      
      const userData = {
        email: signupEmail,
        password: signupPassword,
        isAdmin: isAdminEmail,
        createdAt: new Date().toISOString()
      };
      
      users[signupEmail] = userData;
      localStorage.setItem('appletv_users', JSON.stringify(users));
      
      setCurrentUser(userData);
      setIsLoggedIn(true);
      setIsAdmin(userData.isAdmin);
    } catch (error) {
      setLoginError('Error creating account. Please try again.');
      console.error('Signup error:', error);
    }
  };

  // Enhanced season toggle with animation
  const toggleSeason = (seasonNumber, showId) => {
    setExpandedSeasons(prev => {
      const newState = { ...prev };
      const key = `${showId}-${seasonNumber}`;
      
      if (newState[key]) {
        // Close with animation
        const element = seasonRefs.current[key];
        if (element) {
          element.style.maxHeight = '0px';
          element.style.opacity = '0';
          setTimeout(() => {
            newState[key] = false;
            setExpandedSeasons({ ...newState });
          }, 300);
        } else {
          newState[key] = false;
        }
      } else {
        // Close other seasons in the same show
        Object.keys(newState).forEach(k => {
          if (k.startsWith(`${showId}-`) && k !== key) {
            newState[k] = false;
          }
        });
        newState[key] = true;
        
        // Open with animation
        setTimeout(() => {
          const element = seasonRefs.current[key];
          if (element) {
            element.style.maxHeight = `${element.scrollHeight}px`;
            element.style.opacity = '1';
          }
        }, 10);
      }
      
      return newState;
    });
  };

  // Data management functions
  const updateData = (key, value) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const handleAddShow = (e) => {
    e.preventDefault();
    const newShow = {
      id: Date.now(),
      title: formData.title,
      type: formData.type || 'tvshow',
      category: formData.category || 'Action',
      image: formData.image,
      description: formData.description,
      rating: parseFloat(formData.rating),
      year: parseInt(formData.year),
      cast: formData.cast ? formData.cast.split(',').map(c => c.trim()) : [],
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
      isTrending: formData.isTrending || false,
      isFeatured: formData.isFeatured || false,
      ...(formData.type === 'tvshow' ? {
        seasons: parseInt(formData.seasons),
        episodes: parseInt(formData.episodes),
        seasonsData: formData.seasonsData || []
      } : {
        runtime: parseInt(formData.runtime)
      })
    };

    if (editingItem) {
      updateData('shows', shows.map(s => s.id === editingItem.id ? { ...newShow, id: editingItem.id } : s));
      setEditingItem(null);
    } else {
      updateData('shows', [...shows, newShow]);
    }
    setFormData({});
  };

  // Episode management functions
  const handleEditEpisode = (episode) => {
    setEditingEpisode(episode);
    setEpisodeFormData({
      title: episode.title,
      description: episode.description,
      duration: episode.duration,
      rating: episode.rating,
      image: episode.image,
      director: episode.director || '',
      writer: episode.writer || '',
      releaseDate: episode.releaseDate || ''
    });
  };

  const handleSaveEpisode = (e) => {
    e.preventDefault();
    
    const updatedShows = shows.map(show => {
      if (!show.seasonsData) return show;
      
      const updatedSeasonsData = show.seasonsData.map(season => ({
        ...season,
        episodes: season.episodes.map(ep => 
          ep.id === editingEpisode.id 
            ? { 
                ...ep, 
                title: episodeFormData.title,
                description: episodeFormData.description,
                duration: parseInt(episodeFormData.duration),
                rating: parseFloat(episodeFormData.rating),
                image: episodeFormData.image,
                director: episodeFormData.director,
                writer: episodeFormData.writer,
                releaseDate: episodeFormData.releaseDate
              }
            : ep
        )
      }));
      
      return { ...show, seasonsData: updatedSeasonsData };
    });
    
    updateData('shows', updatedShows);
    setEditingEpisode(null);
    setEpisodeFormData({});
  };

  // Enhanced Show Card with dynamic colors
  const ShowCard = ({ show }) => {
    const categoryColors = {
      'Sci-Fi': 'from-purple-600 to-blue-600',
      'Action': 'from-red-500 to-orange-500',
      'Drama': 'from-green-500 to-emerald-600',
      'Comedy': 'from-yellow-500 to-amber-500',
      'Fantasy': 'from-indigo-500 to-purple-600',
      'Romance': 'from-pink-500 to-rose-500',
      'Crime': 'from-gray-600 to-slate-700',
      'Horror': 'from-red-600 to-rose-700',
      'Thriller': 'from-orange-600 to-red-600',
      'Documentary': 'from-teal-500 to-cyan-600'
    };

    const gradient = categoryColors[show.category] || 'from-blue-600 to-purple-600';

    return (
      <div 
        className="group relative cursor-pointer transition-all duration-500 hover:scale-105 hover:z-20"
        onClick={() => setSelectedShow(show)}
      >
        {/* Glow effect */}
        <div className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500 -z-10`}></div>
        
        <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-slate-800 border border-slate-700 group-hover:border-slate-500 transition-all duration-500">
          <img 
            src={show.image} 
            alt={show.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {show.isTrending && (
              <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Trending
              </span>
            )}
            {show.isFeatured && (
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                Featured
              </span>
            )}
          </div>
          
          <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-full border border-white/20">
            <span className="text-white text-xs font-semibold">{show.year}</span>
          </div>
          
          {/* Content overlay */}
          <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-white font-bold text-sm">{show.rating}</span>
              <span className="text-gray-300 text-sm">•</span>
              <span className="text-gray-300 text-sm">{show.category}</span>
            </div>
            
            <h3 className="text-white font-bold text-lg mb-2 leading-tight">{show.title}</h3>
            <p className="text-gray-300 text-xs line-clamp-2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
              {show.description}
            </p>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-1 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200">
              {show.tags?.slice(0, 2).map((tag, i) => (
                <span key={i} className="bg-white/20 text-white px-2 py-1 rounded text-xs">
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-300">
              <button className="flex-1 bg-white text-black rounded-lg py-2 px-3 text-sm font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-all duration-300 transform hover:scale-105">
                <Play className="w-4 h-4 fill-current" />
                Play
              </button>
              <button className="bg-white/20 backdrop-blur-sm text-white rounded-lg p-2 hover:bg-white/30 transition-all duration-300 transform hover:scale-105 border border-white/30">
                <Plus className="w-4 h-4" />
              </button>
              <button className="bg-white/20 backdrop-blur-sm text-white rounded-lg p-2 hover:bg-white/30 transition-all duration-300 transform hover:scale-105 border border-white/30">
                <Heart className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Enhanced Season Accordion with smooth animations
  const SeasonAccordion = ({ season, showId }) => {
    const key = `${showId}-${season.seasonNumber}`;
    const isExpanded = expandedSeasons[key];

    return (
      <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-lg rounded-2xl mb-4 overflow-hidden border border-slate-700/50 hover:border-slate-600/50 transition-all duration-500">
        <button
          onClick={() => toggleSeason(season.seasonNumber, showId)}
          className="w-full p-6 text-left flex items-center justify-between hover:bg-slate-700/30 transition-all duration-500 group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
              {season.seasonNumber}
            </div>
            <div>
              <h4 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 transition-all duration-500">
                Season {season.seasonNumber}
              </h4>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                {season.episodes.length} episodes • {season.year}
              </p>
              {season.description && (
                <p className="text-gray-500 text-sm mt-1">{season.description}</p>
              )}
            </div>
          </div>
          <div className={`transform transition-all duration-500 ${isExpanded ? 'rotate-180' : ''}`}>
            <ChevronDown className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors duration-300" />
          </div>
        </button>
        
        <div
          ref={el => seasonRefs.current[key] = el}
          className="transition-all duration-500 ease-in-out overflow-hidden"
          style={{
            maxHeight: isExpanded ? '0px' : '0px',
            opacity: isExpanded ? 0 : 0
          }}
        >
          <div className="px-6 pb-6 space-y-4">
            {season.episodes.map(episode => (
              <EpisodeCard 
                key={episode.id} 
                episode={episode} 
                onEdit={handleEditEpisode}
                isAdmin={isAdmin}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Episode Card Component
  const EpisodeCard = ({ episode, onEdit, isAdmin }) => (
    <div className="flex gap-4 p-4 bg-slate-800/40 rounded-xl hover:bg-slate-700/60 transition-all duration-500 group border border-slate-700/50 hover:border-slate-600/50">
      <img 
        src={episode.image} 
        alt={episode.title}
        className="w-32 h-20 object-cover rounded-lg flex-shrink-0 transition-transform duration-500 group-hover:scale-105"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h5 className="text-lg font-semibold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-500">
              Episode {episode.episodeNumber}: {episode.title}
            </h5>
            <div className="flex items-center gap-3 mt-1">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-white text-sm font-medium">{episode.rating}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-400 text-sm">
                <Clock className="w-3 h-3" />
                <span>{episode.duration} min</span>
              </div>
              {episode.releaseDate && (
                <div className="flex items-center gap-1 text-gray-400 text-sm">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(episode.releaseDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
          
          {isAdmin && (
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(episode);
                }}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-110"
              >
                <Edit className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
        
        <p className="text-gray-300 text-sm mb-3 leading-relaxed">{episode.description}</p>
        
        {(episode.director || episode.writer) && (
          <div className="flex flex-wrap gap-4 text-xs text-gray-400 mb-3">
            {episode.director && <span>Director: {episode.director}</span>}
            {episode.writer && <span>Writer: {episode.writer}</span>}
          </div>
        )}
        
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors duration-300 group/play">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center group-hover/play:bg-blue-500 transition-colors duration-300">
              <Play className="w-3 h-3 fill-current text-white" />
            </div>
            <span className="text-sm font-medium">Play Episode</span>
          </button>
          
          <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300">
            <Bookmark className="w-4 h-4" />
            <span className="text-sm">Save</span>
          </button>
          
          <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300">
            <Share2 className="w-4 h-4" />
            <span className="text-sm">Share</span>
          </button>
        </div>
      </div>
    </div>
  );

  // ... Rest of the components (Modal, AdminPanel, EpisodeEditor, Footer) remain similar but enhanced
  // Due to length, I'll show the enhanced versions in the next message

  if (!isLoggedIn) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
        style={{
          background: `
            radial-gradient(circle at ${gradientPosition.x}% ${gradientPosition.y}%, 
              rgba(147, 51, 234, 0.3) 0%, 
              transparent 50%),
            radial-gradient(circle at ${100 - gradientPosition.x}% ${100 - gradientPosition.y}%, 
              rgba(59, 130, 246, 0.3) 0%, 
              transparent 50%),
            radial-gradient(circle at ${gradientPosition.x}% ${100 - gradientPosition.y}%, 
              rgba(236, 72, 153, 0.2) 0%, 
              transparent 50%),
            radial-gradient(circle at ${100 - gradientPosition.x}% ${gradientPosition.y}%, 
              rgba(34, 197, 94, 0.2) 0%, 
              transparent 50%),
            linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)
          `,
          transition: 'background 0.5s ease'
        }}
      >
        {/* Enhanced animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full opacity-10 animate-float"
              style={{
                width: `${Math.random() * 200 + 50}px`,
                height: `${Math.random() * 200 + 50}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                background: `radial-gradient(circle, ${
                  ['#8b5cf6', '#3b82f6', '#ec4899', '#10b981'][i % 4]
                } 0%, transparent 70%)`,
                animationDelay: `${i * 2}s`,
                animationDuration: `${15 + i * 5}s`
              }}
            />
          ))}
        </div>

        <div className="relative z-10 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-7xl font-black text-white mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient">
              Apple TV
            </h1>
            <p className="text-gray-300 text-xl font-light">The future of entertainment is here</p>
          </div>

          {/* Enhanced login form */}
          <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-white/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500"></div>
            
            <h2 className="text-3xl font-bold text-white mb-2 text-center">
              {showSignup ? 'Join the Experience' : 'Welcome Back'}
            </h2>
            <p className="text-gray-300 text-center mb-8">
              {showSignup ? 'Create your account to start streaming' : 'Sign in to continue your journey'}
            </p>

            {loginError && (
              <div className="mb-6 bg-red-500/20 border border-red-500/50 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-red-300 text-sm text-center">{loginError}</p>
              </div>
            )}

            {/* Login/Signup forms remain similar but with enhanced styling */}
            {/* ... */}
          </div>
        </div>

        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
          }
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-float { animation: float 20s ease-in-out infinite; }
          .animate-gradient { 
            background-size: 200% 200%;
            animation: gradient 3s ease infinite;
          }
        `}</style>
      </div>
    );
  }

  // Enhanced main app return with status indicator
  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Dynamic background */}
      <div 
        className="fixed inset-0 transition-all duration-1000"
        style={{
          background: `
            radial-gradient(circle at ${gradientPosition.x}% ${gradientPosition.y}%, 
              rgba(147, 51, 234, 0.15) 0%, 
              transparent 50%),
            radial-gradient(circle at ${100 - gradientPosition.x}% ${100 - gradientPosition.y}%, 
              rgba(59, 130, 246, 0.15) 0%, 
              transparent 50%),
            linear-gradient(to bottom right, #0f172a, #1e1b4b, #0f172a)
          `
        }}
      />
      
      {/* Floating particles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/5 animate-float"
            style={{
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 3}s`,
              animationDuration: `${20 + i * 10}s`
            }}
          />
        ))}
      </div>

      {/* Status indicator */}
      {saveStatus && (
        <div className="fixed top-4 right-4 z-50 bg-slate-800/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm border border-slate-600">
          {saveStatus} {saveStatus === 'Saved' ? '✓' : '⏳'}
        </div>
      )}

      {/* Enhanced header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-b from-slate-900/95 to-transparent backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-[1600px] mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-12">
              <h1 className="text-2xl font-black text-white bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Apple TV+
              </h1>
              
              <nav className="flex gap-8">
                {['tvshows', 'movies', 'news', 'chart'].map((tab) => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex items-center gap-3 text-lg font-semibold transition-all duration-500 px-4 py-2 rounded-2xl ${
                      activeTab === tab 
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-600/25' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {tab === 'tvshows' && <Tv className="w-5 h-5" />}
                    {tab === 'movies' && <Film className="w-5 h-5" />}
                    {tab === 'news' && <Newspaper className="w-5 h-5" />}
                    {tab === 'chart' && <TrendingUp className="w-5 h-5" />}
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </nav>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Data management buttons */}
              <div className="flex gap-2">
                <button 
                  onClick={() => cloudStorage.exportData()}
                  className="flex items-center gap-2 bg-slate-800/80 text-white px-3 py-2 rounded-xl hover:bg-slate-700/80 transition-all duration-300 border border-slate-700"
                  title="Export data"
                >
                  <Download className="w-4 h-4" />
                </button>
                <input
                  type="file"
                  accept=".json"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      cloudStorage.importData(file).then(() => {
                        window.location.reload();
                      });
                    }
                  }}
                  className="hidden"
                  id="import-data"
                />
                <label 
                  htmlFor="import-data"
                  className="flex items-center gap-2 bg-slate-800/80 text-white px-3 py-2 rounded-xl hover:bg-slate-700/80 transition-all duration-300 border border-slate-700 cursor-pointer"
                  title="Import data"
                >
                  <UploadCloud className="w-4 h-4" />
                </label>
              </div>

              {isAdmin && (
                <button 
                  onClick={() => setShowAdminPanel(true)}
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-purple-600/25"
                >
                  <Settings className="w-4 h-4" />
                  Admin
                </button>
              )}
              
              <div className="flex items-center gap-3">
                <span className="text-gray-400 text-sm">{currentUser?.email}</span>
                <button 
                  onClick={() => {
                    setIsLoggedIn(false);
                    setIsAdmin(false);
                    setCurrentUser(null);
                  }}
                  className="text-gray-400 hover:text-white text-sm font-semibold transition-colors duration-300 hover:bg-white/5 px-3 py-1 rounded-lg"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-16 px-8 max-w-[1600px] mx-auto relative z-10">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-white text-lg">Loading your entertainment experience...</div>
          </div>
        ) : (
          <>
            {/* Enhanced tab content */}
            {(activeTab === 'tvshows' || activeTab === 'movies') && (
              <EnhancedShowGrid 
                shows={shows} 
                activeTab={activeTab}
                onShowSelect={setSelectedShow}
              />
            )}
            
            {/* Other tabs remain enhanced similarly */}
          </>
        )}
      </main>

      <EnhancedFooter version={APP_VERSION} />

      {selectedShow && (
        <EnhancedModal 
          show={selectedShow} 
          onClose={() => setSelectedShow(null)}
          expandedSeasons={expandedSeasons}
          onToggleSeason={toggleSeason}
          seasonRefs={seasonRefs}
          isAdmin={isAdmin}
          onEditEpisode={handleEditEpisode}
        />
      )}
      
      {showAdminPanel && (
        <EnhancedAdminPanel 
          onClose={() => setShowAdminPanel(false)}
          data={data}
          onUpdateData={updateData}
          adminMode={adminMode}
          setAdminMode={setAdminMode}
          editingItem={editingItem}
          setEditingItem={setEditingItem}
          formData={formData}
          setFormData={setFormData}
          categories={categories}
        />
      )}
      
      {editingEpisode && (
        <EnhancedEpisodeEditor
          episode={editingEpisode}
          formData={episodeFormData}
          setFormData={setEpisodeFormData}
          onSave={handleSaveEpisode}
          onCancel={() => setEditingEpisode(null)}
        />
      )}
    </div>
  );
};

// Enhanced component implementations would continue here...
// Due to length constraints, I'll stop here and provide the remaining components in the next message

export default App;
