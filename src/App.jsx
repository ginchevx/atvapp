import React, { useState, useEffect, useRef } from 'react';
import { Play, Plus, Star, TrendingUp, Film, Tv, Newspaper, Settings, Edit, Trash2, X, Upload, ChevronDown, ChevronUp, Clock, Download, UploadCloud, Zap, Users, Calendar, Heart, Share2, Bookmark } from 'lucide-react';

// Simple storage utility (inlined to avoid import issues)
const createStorage = () => ({
  saveAllData: async (data) => {
    try {
      localStorage.setItem('appletv_data', JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error saving data:', error);
      return false;
    }
  },
  loadAllData: async () => {
    try {
      const saved = localStorage.getItem('appletv_data');
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Error loading data:', error);
      return null;
    }
  },
  exportData: () => {
    const data = localStorage.getItem('appletv_data');
    if (data) {
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `appletv-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  },
  importData: (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          localStorage.setItem('appletv_data', JSON.stringify(data));
          resolve(true);
        } catch (error) {
          reject(error);
        }
      };
      reader.readAsText(file);
    });
  }
});

const storage = createStorage();

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
      },
      {
        id: 2,
        title: "The Last Detective",
        type: "tvshow",
        category: "Crime",
        image: "https://images.unsplash.com/photo-1477346611705-65d1883cee1e?w=800&q=80",
        description: "In a dystopian future, one detective must solve impossible crimes while navigating a corrupt system.",
        rating: 8.7,
        seasons: 2,
        episodes: 16,
        cast: ["Idris Elba", "Florence Pugh", "Brian Cox"],
        year: 2023,
        seasonsData: [
          {
            seasonNumber: 1,
            episodes: [
              {
                id: 3,
                episodeNumber: 1,
                title: "The First Case",
                description: "Detective Miller takes on his first impossible case in the dystopian city.",
                duration: 58,
                rating: 8.5,
                image: "https://images.unsplash.com/photo-1489599809505-f2d4c5f29a15?w=400&q=80"
              }
            ]
          }
        ]
      },
      {
        id: 3,
        title: "Quantum Leap",
        type: "movie",
        category: "Sci-Fi",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
        description: "A physicist accidentally opens a portal to parallel universes and must find his way home.",
        rating: 8.9,
        runtime: 142,
        cast: ["Ryan Gosling", "Lupita Nyong'o", "Mark Ruffalo"],
        year: 2024
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
    ]
  };

  const [data, setData] = useState(initialData);
  const { shows, news, actors } = data;

  const [adminMode, setAdminMode] = useState('shows');
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  const categories = ["Action", "Romance", "Comedy", "Drama", "Sci-Fi", "Fantasy", "Horror", "Thriller", "Crime", "Documentary", "Animation", "Family"];

  // Refs for dropdowns
  const contentRefs = useRef({});

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

  // Load data from storage
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const savedData = await storage.loadAllData();
        if (savedData) {
          setData(prev => ({ ...prev, ...savedData }));
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
        const success = await storage.saveAllData(data);
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

  // Fixed season toggle function
  const toggleSeason = (seasonNumber, showId) => {
    const key = `${showId}-${seasonNumber}`;
    
    setExpandedSeasons(prev => {
      const newState = { ...prev };
      
      // If this season is already expanded, collapse it
      if (newState[key]) {
        newState[key] = false;
      } else {
        // Close other seasons in the same show
        Object.keys(newState).forEach(k => {
          if (k.startsWith(`${showId}-`) && k !== key) {
            newState[k] = false;
          }
        });
        // Open the clicked season
        newState[key] = true;
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

  const handleAddNews = (e) => {
    e.preventDefault();
    const newNews = {
      id: Date.now(),
      title: formData.title,
      date: formData.date || 'Just now',
      excerpt: formData.excerpt,
      image: formData.image,
      category: formData.category,
      author: formData.author
    };

    if (editingItem) {
      updateData('news', news.map(n => n.id === editingItem.id ? { ...newNews, id: editingItem.id } : n));
      setEditingItem(null);
    } else {
      updateData('news', [...news, newNews]);
    }
    setFormData({});
  };

  const handleAddActor = (e) => {
    e.preventDefault();
    const newActor = {
      name: formData.name,
      trending: parseInt(formData.trending),
      shows: formData.shows ? formData.shows.split(',').map(s => s.trim()) : [],
      image: formData.image,
      bio: formData.bio
    };

    if (editingItem) {
      updateData('actors', actors.map(a => a.name === editingItem.name ? newActor : a));
      setEditingItem(null);
    } else {
      updateData('actors', [...actors, newActor]);
    }
    setFormData({});
  };

  const handleDelete = (type, id) => {
    if (type === 'shows') updateData('shows', shows.filter(s => s.id !== id));
    if (type === 'news') updateData('news', news.filter(n => n.id !== id));
    if (type === 'actors') updateData('actors', actors.filter(a => a.name !== id));
  };

  const handleEdit = (type, item) => {
    setEditingItem(item);
    if (type === 'shows') {
      setFormData({
        title: item.title,
        type: item.type,
        category: item.category,
        image: item.image,
        description: item.description,
        rating: item.rating,
        year: item.year,
        cast: item.cast?.join(', '),
        tags: item.tags?.join(', '),
        isTrending: item.isTrending,
        isFeatured: item.isFeatured,
        seasons: item.seasons,
        episodes: item.episodes,
        runtime: item.runtime
      });
    } else if (type === 'news') {
      setFormData({
        title: item.title,
        date: item.date,
        excerpt: item.excerpt,
        image: item.image,
        category: item.category,
        author: item.author
      });
    } else if (type === 'actors') {
      setFormData({
        name: item.name,
        trending: item.trending,
        shows: item.shows.join(', '),
        image: item.image,
        bio: item.bio
      });
    }
    setAdminMode(type);
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

  const handleDeleteEpisode = (episodeId) => {
    const updatedShows = shows.map(show => {
      if (!show.seasonsData) return show;
      
      const updatedSeasonsData = show.seasonsData.map(season => ({
        ...season,
        episodes: season.episodes.filter(ep => ep.id !== episodeId)
      })).filter(season => season.episodes.length > 0);
      
      return { ...show, seasonsData: updatedSeasonsData };
    });
    
    updateData('shows', updatedShows);
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

  // Fixed Season Accordion with smooth animations
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
          className={`transition-all duration-500 ease-in-out overflow-hidden ${
            isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
          }`}
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

  // Episode Editor Component
  const EpisodeEditor = ({ episode, onSave, onCancel, onDelete }) => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white">Edit Episode</h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={onSave} className="space-y-4">
          <input 
            type="text" 
            placeholder="Episode Title" 
            value={episodeFormData.title || ''}
            onChange={(e) => setEpisodeFormData({...episodeFormData, title: e.target.value})}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            required
          />
          
          <textarea 
            placeholder="Episode Description" 
            value={episodeFormData.description || ''}
            onChange={(e) => setEpisodeFormData({...episodeFormData, description: e.target.value})}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 h-24"
            required
          />
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Duration (minutes)</label>
              <input 
                type="number" 
                placeholder="Duration" 
                value={episodeFormData.duration || ''}
                onChange={(e) => setEpisodeFormData({...episodeFormData, duration: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Rating</label>
              <input 
                type="number" 
                step="0.1" 
                placeholder="Rating" 
                value={episodeFormData.rating || ''}
                onChange={(e) => setEpisodeFormData({...episodeFormData, rating: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Director</label>
              <input 
                type="text" 
                placeholder="Director" 
                value={episodeFormData.director || ''}
                onChange={(e) => setEpisodeFormData({...episodeFormData, director: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Writer</label>
              <input 
                type="text" 
                placeholder="Writer" 
                value={episodeFormData.writer || ''}
                onChange={(e) => setEpisodeFormData({...episodeFormData, writer: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Release Date</label>
            <input 
              type="date" 
              value={episodeFormData.releaseDate || ''}
              onChange={(e) => setEpisodeFormData({...episodeFormData, releaseDate: e.target.value})}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>
          
          <input 
            type="text" 
            placeholder="Image URL" 
            value={episodeFormData.image || ''}
            onChange={(e) => setEpisodeFormData({...episodeFormData, image: e.target.value})}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
          
          <div className="flex gap-3 pt-4">
            <button type="submit" className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
              Save Changes
            </button>
            <button type="button" onClick={() => onDelete(episode.id)} className="px-6 bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition-all duration-300">
              Delete
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Modal Component
  const Modal = ({ show, onClose }) => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8" onClick={onClose}>
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
        <div className="relative h-96">
          <img src={show.image} alt={show.title} className="w-full h-full object-cover rounded-t-3xl" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-all duration-300"
          >
            ✕
          </button>
          <div className="absolute bottom-8 left-8 right-8">
            <h2 className="text-5xl font-bold text-white mb-4">{show.title}</h2>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="text-white font-bold text-lg">{show.rating}</span>
              </div>
              <span className="text-gray-300 font-semibold">{show.year}</span>
              {show.seasons && <span className="text-gray-300">{show.seasons} Seasons</span>}
              {show.runtime && <span className="text-gray-300">{show.runtime} min</span>}
            </div>
            <div className="flex gap-3">
              <button className="bg-white text-black rounded-xl py-4 px-8 font-bold flex items-center gap-3 hover:bg-gray-200 transition-all duration-300">
                <Play className="w-6 h-6 fill-current" />
                Play Now
              </button>
              <button className="bg-white/20 backdrop-blur-sm text-white rounded-xl py-4 px-8 font-bold flex items-center gap-3 hover:bg-white/30 transition-all duration-300">
                <Plus className="w-6 h-6" />
                My List
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-8">
          <p className="text-gray-300 text-lg mb-8 leading-relaxed">{show.description}</p>
          
          {/* Seasons and Episodes Section for TV Shows */}
          {show.type === 'tvshow' && show.seasonsData && (
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-6">Seasons & Episodes</h3>
              {show.seasonsData.map(season => (
                <SeasonAccordion key={season.seasonNumber} season={season} showId={show.id} />
              ))}
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-white font-bold text-xl mb-4">Cast</h3>
              <div className="flex flex-wrap gap-2">
                {show.cast.map((actor, i) => (
                  <span key={i} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105">
                    {actor}
                  </span>
                ))}
              </div>
            </div>
            
            {show.episodes && (
              <div>
                <h3 className="text-white font-bold text-xl mb-4">Series Info</h3>
                <div className="space-y-3">
                  <div className="bg-slate-800/50 rounded-xl p-4">
                    <div className="text-white text-2xl font-bold">{show.episodes}</div>
                    <div className="text-gray-400 text-sm">Total Episodes</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-4">
                    <div className="text-white text-2xl font-bold">{show.seasons}</div>
                    <div className="text-gray-400 text-sm">Seasons</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Admin Panel Component
  const AdminPanel = () => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl max-w-6xl w-full my-8">
        <div className="sticky top-0 bg-gradient-to-r from-slate-900 to-slate-800 p-6 border-b border-slate-700 flex items-center justify-between z-10 rounded-t-3xl">
          <h2 className="text-3xl font-bold text-white">Admin Panel</h2>
          <button onClick={() => { setShowAdminPanel(false); setFormData({}); setEditingItem(null); }} className="text-gray-400 hover:text-white transition-all duration-300">
            <X className="w-8 h-8" />
          </button>
        </div>

        <div className="p-6 max-h-[80vh] overflow-y-auto">
          <div className="flex gap-4 mb-6 flex-wrap">
            <button onClick={() => { setAdminMode('shows'); setFormData({}); setEditingItem(null); }} className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${adminMode === 'shows' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'}`}>
              Shows & Movies
            </button>
            <button onClick={() => { setAdminMode('news'); setFormData({}); setEditingItem(null); }} className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${adminMode === 'news' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'}`}>
              News
            </button>
            <button onClick={() => { setAdminMode('actors'); setFormData({}); setEditingItem(null); }} className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${adminMode === 'actors' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'}`}>
              Chart (Actors)
            </button>
          </div>

          {adminMode === 'shows' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-800/50 rounded-2xl p-6">
                <h3 className="text-2xl font-bold text-white mb-6">{editingItem ? 'Edit' : 'Add'} Show/Movie</h3>
                <form onSubmit={handleAddShow} className="space-y-4">
                  <input type="text" placeholder="Title" value={formData.title || ''} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" required />
                  
                  <select value={formData.type || 'tvshow'} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500">
                    <option value="tvshow">TV Show</option>
                    <option value="movie">Movie</option>
                  </select>

                  <select value={formData.category || 'Action'} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500">
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-300">Image</label>
                    <div className="flex gap-2">
                      <input type="text" placeholder="Image URL" value={formData.image || ''} onChange={(e) => setFormData({...formData, image: e.target.value})} className="flex-1 bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
                    </div>
                    {formData.image && <img src={formData.image} alt="Preview" className="w-full h-32 object-cover rounded-xl" />}
                  </div>
                  
                  <textarea placeholder="Description" value={formData.description || ''} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 h-24" required />
                  <input type="number" step="0.1" placeholder="Rating" value={formData.rating || ''} onChange={(e) => setFormData({...formData, rating: e.target.value})} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" required />
                  <input type="number" placeholder="Year" value={formData.year || ''} onChange={(e) => setFormData({...formData, year: e.target.value})} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" required />
                  <input type="text" placeholder="Cast (comma separated)" value={formData.cast || ''} onChange={(e) => setFormData({...formData, cast: e.target.value})} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
                  <input type="text" placeholder="Tags (comma separated)" value={formData.tags || ''} onChange={(e) => setFormData({...formData, tags: e.target.value})} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
                  
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-gray-300">
                      <input type="checkbox" checked={formData.isTrending || false} onChange={(e) => setFormData({...formData, isTrending: e.target.checked})} className="rounded bg-slate-700 border-slate-600" />
                      Trending
                    </label>
                    <label className="flex items-center gap-2 text-gray-300">
                      <input type="checkbox" checked={formData.isFeatured || false} onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})} className="rounded bg-slate-700 border-slate-600" />
                      Featured
                    </label>
                  </div>

                  {formData.type === 'tvshow' ? (
                    <>
                      <input type="number" placeholder="Seasons" value={formData.seasons || ''} onChange={(e) => setFormData({...formData, seasons: e.target.value})} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
                      <input type="number" placeholder="Episodes" value={formData.episodes || ''} onChange={(e) => setFormData({...formData, episodes: e.target.value})} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
                    </>
                  ) : (
                    <input type="number" placeholder="Runtime (minutes)" value={formData.runtime || ''} onChange={(e) => setFormData({...formData, runtime: e.target.value})} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
                  )}
                  <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
                    {editingItem ? 'Update' : 'Add'} {formData.type === 'movie' ? 'Movie' : 'Show'}
                  </button>
                  {editingItem && (
                    <button type="button" onClick={() => { setEditingItem(null); setFormData({}); }} className="w-full bg-slate-700 text-white font-bold py-3 rounded-xl hover:bg-slate-600 transition-all duration-300">
                      Cancel
                    </button>
                  )}
                </form>
              </div>

              <div className="bg-slate-800/50 rounded-2xl p-6 max-h-[600px] overflow-y-auto">
                <h3 className="text-2xl font-bold text-white mb-6">Manage Shows & Movies</h3>
                <div className="space-y-3">
                  {shows.map(show => (
                    <div key={show.id} className="bg-slate-900/50 rounded-xl p-4 flex items-center gap-4 hover:bg-slate-800/70 transition-all duration-300">
                      <img src={show.image} alt={show.title} className="w-16 h-12 object-cover rounded-lg" />
                      <div className="flex-1">
                        <h4 className="text-white font-semibold">{show.title}</h4>
                        <p className="text-gray-400 text-sm">{show.category} • {show.year}</p>
                      </div>
                      <button onClick={() => handleEdit('shows', show)} className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete('shows', show.id)} className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {adminMode === 'news' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-800/50 rounded-2xl p-6">
                <h3 className="text-2xl font-bold text-white mb-6">{editingItem ? 'Edit' : 'Add'} News</h3>
                <form onSubmit={handleAddNews} className="space-y-4">
                  <input type="text" placeholder="Title" value={formData.title || ''} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" required />
                  <input type="text" placeholder="Date" value={formData.date || ''} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
                  <textarea placeholder="Excerpt" value={formData.excerpt || ''} onChange={(e) => setFormData({...formData, excerpt: e.target.value})} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 h-24" required />
                  <input type="text" placeholder="Category" value={formData.category || ''} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
                  <input type="text" placeholder="Author" value={formData.author || ''} onChange={(e) => setFormData({...formData, author: e.target.value})} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-300">Image</label>
                    <div className="flex gap-2">
                      <input type="text" placeholder="Image URL" value={formData.image || ''} onChange={(e) => setFormData({...formData, image: e.target.value})} className="flex-1 bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
                    </div>
                    {formData.image && <img src={formData.image} alt="Preview" className="w-full h-32 object-cover rounded-xl" />}
                  </div>
                  
                  <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
                    {editingItem ? 'Update' : 'Add'} News
                  </button>
                  {editingItem && (
                    <button type="button" onClick={() => { setEditingItem(null); setFormData({}); }} className="w-full bg-slate-700 text-white font-bold py-3 rounded-xl hover:bg-slate-600 transition-all duration-300">
                      Cancel
                    </button>
                  )}
                </form>
              </div>

              <div className="bg-slate-800/50 rounded-2xl p-6 max-h-[600px] overflow-y-auto">
                <h3 className="text-2xl font-bold text-white mb-6">Manage News</h3>
                <div className="space-y-3">
                  {news.map(item => (
                    <div key={item.id} className="bg-slate-900/50 rounded-xl p-4 flex items-center gap-4 hover:bg-slate-800/70 transition-all duration-300">
                      <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded-lg" />
                      <div className="flex-1">
                        <h4 className="text-white font-semibold">{item.title}</h4>
                        <p className="text-gray-400 text-sm">{item.date}</p>
                      </div>
                      <button onClick={() => handleEdit('news', item)} className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete('news', item.id)} className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {adminMode === 'actors' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-800/50 rounded-2xl p-6">
                <h3 className="text-2xl font-bold text-white mb-6">{editingItem ? 'Edit' : 'Add'} Actor</h3>
                <form onSubmit={handleAddActor} className="space-y-4">
                  <input type="text" placeholder="Actor Name" value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" required />
                  <input type="number" placeholder="Trending Score (0-100)" value={formData.trending || ''} onChange={(e) => setFormData({...formData, trending: e.target.value})} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" required />
                  <input type="text" placeholder="Shows (comma separated)" value={formData.shows || ''} onChange={(e) => setFormData({...formData, shows: e.target.value})} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" required />
                  <textarea placeholder="Bio" value={formData.bio || ''} onChange={(e) => setFormData({...formData, bio: e.target.value})} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 h-20" />
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-300">Image</label>
                    <div className="flex gap-2">
                      <input type="text" placeholder="Image URL" value={formData.image || ''} onChange={(e) => setFormData({...formData, image: e.target.value})} className="flex-1 bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
                    </div>
                    {formData.image && <img src={formData.image} alt="Preview" className="w-20 h-20 object-cover rounded-full" />}
                  </div>
                  
                  <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
                    {editingItem ? 'Update' : 'Add'} Actor
                  </button>
                  {editingItem && (
                    <button type="button" onClick={() => { setEditingItem(null); setFormData({}); }} className="w-full bg-slate-700 text-white font-bold py-3 rounded-xl hover:bg-slate-600 transition-all duration-300">
                      Cancel
                    </button>
                  )}
                </form>
              </div>

              <div className="bg-slate-800/50 rounded-2xl p-6 max-h-[600px] overflow-y-auto">
                <h3 className="text-2xl font-bold text-white mb-6">Manage Actors</h3>
                <div className="space-y-3">
                  {actors.map(actor => (
                    <div key={actor.name} className="bg-slate-900/50 rounded-xl p-4 flex items-center gap-4 hover:bg-slate-800/70 transition-all duration-300">
                      <img src={actor.image} alt={actor.name} className="w-16 h-16 object-cover rounded-full" />
                      <div className="flex-1">
                        <h4 className="text-white font-semibold">{actor.name}</h4>
                        <p className="text-gray-400 text-sm">Score: {actor.trending}</p>
                      </div>
                      <button onClick={() => handleEdit('actors', actor)} className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete('actors', actor.name)} className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Footer Component
  const Footer = () => (
    <footer className="mt-16 border-t border-slate-800 pt-8 pb-6">
      <div className="max-w-[1600px] mx-auto px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm">
            © 2025 ATV / Blackwell Studios
          </div>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <span className="text-gray-500 text-sm">Version {APP_VERSION}</span>
            <div className="flex gap-4">
              <button className="text-gray-400 hover:text-white text-sm transition-colors">Privacy</button>
              <button className="text-gray-400 hover:text-white text-sm transition-colors">Terms</button>
              <button className="text-gray-400 hover:text-white text-sm transition-colors">Help</button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );

  // Filter shows for display
  const filteredShows = shows.filter(show => 
    activeTab === 'movies' ? show.type === 'movie' : 
    activeTab === 'tvshows' ? show.type === 'tvshow' : 
    true
  );

  const groupShowsByCategory = (showsList) => {
    const grouped = {};
    showsList.forEach(show => {
      const cat = show.category || 'Other';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(show);
    });
    return grouped;
  };

  const groupedShows = groupShowsByCategory(filteredShows);

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
            linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)
          `
        }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(5)].map((_, i) => (
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

            {!showSignup ? (
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Apple ID</label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Password</label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-blue-600/30"
                >
                  Sign In
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignup} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Password</label>
                  <input
                    type="password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Confirm Password</label>
                  <input
                    type="password"
                    value={signupConfirmPassword}
                    onChange={(e) => setSignupConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-blue-600/30"
                >
                  Create Account
                </button>
              </form>
            )}

            <div className="mt-8 pt-6 border-t border-white/20 text-center">
              <p className="text-gray-300 text-sm mb-4">
                {showSignup ? 'Already have an account?' : "Don't have an Apple ID?"}
              </p>
              <button
                onClick={() => {
                  setShowSignup(!showSignup);
                  setLoginError('');
                  setLoginEmail('');
                  setLoginPassword('');
                  setSignupEmail('');
                  setSignupPassword('');
                  setSignupConfirmPassword('');
                }}
                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-300"
              >
                {showSignup ? 'Sign in instead' : 'Create yours now'}
              </button>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-400 text-xs">
              By signing in, you agree to Apple's Terms and Conditions
            </p>
          </div>
        </div>
      </div>
    );
  }

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
                  onClick={() => storage.exportData()}
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
                      storage.importData(file).then(() => {
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
              <div className="space-y-12">
                {Object.entries(groupedShows).map(([category, categoryShows]) => (
                  <div key={category} className="relative">
                    {/* Category header with gradient */}
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full"></div>
                      <h2 className="text-4xl font-bold text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                        {category}
                      </h2>
                      <div className="flex-1 h-px bg-gradient-to-r from-slate-700 to-transparent"></div>
                      <span className="text-gray-400 text-lg">{categoryShows.length} titles</span>
                    </div>
                    
                    {/* Shows grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                      {categoryShows.map(show => (
                        <ShowCard key={show.id} show={show} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'news' && (
              <>
                <div className="mb-12">
                  <h2 className="text-4xl font-bold text-white mb-3">Latest News</h2>
                  <p className="text-gray-400 text-lg">Stay updated with your favorite shows and stars</p>
                </div>
                
                <div className="grid gap-6">
                  {news.map(item => (
                    <div key={item.id} className="bg-gradient-to-r from-slate-800/50 to-slate-800/30 backdrop-blur-sm rounded-2xl overflow-hidden hover:scale-[1.02] transition-all duration-300 cursor-pointer">
                      <div className="flex gap-6">
                        <img src={item.image} alt={item.title} className="w-64 h-48 object-cover" />
                        <div className="flex-1 p-6 flex flex-col justify-center">
                          <div className="text-purple-400 text-sm font-semibold mb-2">{item.date}</div>
                          <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                          <p className="text-gray-400 text-lg">{item.excerpt}</p>
                          {item.category && (
                            <div className="mt-2">
                              <span className="bg-purple-600/20 text-purple-300 px-3 py-1 rounded-full text-sm">
                                {item.category}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeTab === 'chart' && (
              <>
                <div className="mb-12">
                  <h2 className="text-4xl font-bold text-white mb-3">Trending Actors</h2>
                  <p className="text-gray-400 text-lg">Most popular stars on the platform</p>
                </div>
                
                <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 backdrop-blur-sm rounded-3xl p-8">
                  <div className="space-y-4">
                    {actors.sort((a, b) => b.trending - a.trending).map((actor, index) => (
                      <div key={actor.name} className="flex items-center gap-6 p-4 rounded-2xl hover:bg-slate-700/30 transition-all duration-300">
                        <div className="text-3xl font-bold text-transparent bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text w-12 text-center">
                          {index + 1}
                        </div>
                        <img src={actor.image} alt={actor.name} className="w-20 h-20 rounded-full object-cover ring-4 ring-purple-600/50" />
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-white mb-1">{actor.name}</h3>
                          <p className="text-gray-400">Featured in: {actor.shows.join(', ')}</p>
                          {actor.bio && <p className="text-gray-500 text-sm mt-1">{actor.bio}</p>}
                        </div>
                        <div className="flex items-center gap-3">
                          <TrendingUp className="w-6 h-6 text-green-400" />
                          <div className="text-right">
                            <div className="text-2xl font-bold text-white">{actor.trending}</div>
                            <div className="text-sm text-gray-400">Trending Score</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </main>

      <Footer />

      {selectedShow && <Modal show={selectedShow} onClose={() => setSelectedShow(null)} />}
      {showAdminPanel && <AdminPanel />}
      {editingEpisode && (
        <EpisodeEditor 
          episode={editingEpisode}
          onSave={handleSaveEpisode}
          onCancel={() => setEditingEpisode(null)}
          onDelete={handleDeleteEpisode}
        />
      )}
    </div>
  );
};

export default App;
