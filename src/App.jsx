import React, { useState, useEffect } from 'react';
import { Play, Plus, Star, TrendingUp, Film, Tv, Newspaper, Settings, Edit, Trash2, X, Upload, ChevronDown, ChevronUp } from 'lucide-react';

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
  
  // App version
  const APP_VERSION = "1.2.0";

  // Enhanced shows data with seasons and episodes
  const [shows, setShows] = useState([
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
      seasonsData: [
        {
          seasonNumber: 1,
          episodes: [
            {
              episodeNumber: 1,
              title: "The Final Frontier",
              description: "The crew embarks on their maiden voyage into deep space, encountering unexpected challenges.",
              duration: 52,
              rating: 8.9,
              image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&q=80"
            },
            {
              episodeNumber: 2,
              title: "First Contact",
              description: "The team makes an incredible discovery that could change humanity forever.",
              duration: 48,
              rating: 9.1,
              image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&q=80"
            }
          ]
        },
        {
          seasonNumber: 2,
          episodes: [
            {
              episodeNumber: 1,
              title: "New Beginnings",
              description: "The crew faces new threats as they explore uncharted territories.",
              duration: 55,
              rating: 9.3,
              image: "https://images.unsplash.com/photo-1465101162946-4377e57745c3?w=400&q=80"
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
    },
    {
      id: 4,
      title: "Hearts Entwined",
      type: "movie",
      category: "Romance",
      image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&q=80",
      description: "Two strangers meet by chance in Paris and discover an unexpected connection that changes their lives.",
      rating: 8.3,
      runtime: 118,
      cast: ["Florence Pugh", "Timothée Chalamet"],
      year: 2024
    },
    {
      id: 5,
      title: "The Dragon's Realm",
      type: "tvshow",
      category: "Fantasy",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80",
      description: "In a world where dragons rule the skies, a young warrior must unite the kingdoms against an ancient evil.",
      rating: 9.1,
      seasons: 4,
      episodes: 32,
      cast: ["Kit Harington", "Emilia Clarke", "Pedro Pascal"],
      year: 2023,
      seasonsData: [
        {
          seasonNumber: 1,
          episodes: [
            {
              episodeNumber: 1,
              title: "The Dragon's Call",
              description: "A young warrior discovers his destiny in a world ruled by dragons.",
              duration: 54,
              rating: 9.0,
              image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80"
            }
          ]
        }
      ]
    }
  ]);

  const [news, setNews] = useState([
    {
      id: 1,
      title: "Stellar Horizons Renewed for Season 4",
      date: "2 days ago",
      excerpt: "The hit sci-fi series gets the green light for another season following record-breaking viewership.",
      image: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&q=80"
    },
    {
      id: 2,
      title: "New Fantasy Series Coming Soon",
      date: "1 week ago",
      excerpt: "Apple TV announces groundbreaking new fantasy series set to premiere next month.",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&q=80"
    }
  ]);

  const [chartData, setChartData] = useState([
    { name: "Emma Stone", trending: 98, shows: ["Stellar Horizons"], image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80" },
    { name: "Oscar Isaac", trending: 95, shows: ["Stellar Horizons"], image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80" },
    { name: "Ryan Gosling", trending: 87, shows: ["Quantum Leap"], image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80" },
    { name: "Florence Pugh", trending: 92, shows: ["The Last Detective", "Hearts Entwined"], image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80" }
  ]);

  const [adminMode, setAdminMode] = useState('shows');
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  const categories = ["Action", "Romance", "Comedy", "Drama", "Sci-Fi", "Fantasy", "Horror", "Thriller", "Crime", "Documentary"];

  // Dynamic gradient animation
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setGradientPosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Auto-animate gradient when not moving mouse
  useEffect(() => {
    const interval = setInterval(() => {
      setGradientPosition(prev => ({
        x: prev.x + (Math.random() - 0.5) * 10,
        y: prev.y + (Math.random() - 0.5) * 10
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const loadData = () => {
      try {
        const savedShows = localStorage.getItem('appletv_shows');
        const savedNews = localStorage.getItem('appletv_news');
        const savedActors = localStorage.getItem('appletv_actors');
        
        if (savedShows) setShows(JSON.parse(savedShows));
        if (savedNews) setNews(JSON.parse(savedNews));
        if (savedActors) setChartData(JSON.parse(savedActors));
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    
    loadData();
  }, []);

  useEffect(() => {
    localStorage.setItem('appletv_shows', JSON.stringify(shows));
  }, [shows]);

  useEffect(() => {
    localStorage.setItem('appletv_news', JSON.stringify(news));
  }, [news]);

  useEffect(() => {
    localStorage.setItem('appletv_actors', JSON.stringify(chartData));
  }, [chartData]);

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

  const toggleSeason = (seasonNumber) => {
    setExpandedSeasons(prev => ({
      ...prev,
      [seasonNumber]: !prev[seasonNumber]
    }));
  };

  const handleImageUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({...formData, [field]: reader.result});
      };
      reader.readAsDataURL(file);
    }
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
      ...(formData.type === 'tvshow' ? {
        seasons: parseInt(formData.seasons),
        episodes: parseInt(formData.episodes),
        seasonsData: formData.seasonsData || []
      } : {
        runtime: parseInt(formData.runtime)
      })
    };

    if (editingItem) {
      setShows(shows.map(s => s.id === editingItem.id ? { ...newShow, id: editingItem.id } : s));
      setEditingItem(null);
    } else {
      setShows([...shows, newShow]);
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
      image: formData.image
    };

    if (editingItem) {
      setNews(news.map(n => n.id === editingItem.id ? { ...newNews, id: editingItem.id } : n));
      setEditingItem(null);
    } else {
      setNews([...news, newNews]);
    }
    setFormData({});
  };

  const handleAddActor = (e) => {
    e.preventDefault();
    const newActor = {
      name: formData.name,
      trending: parseInt(formData.trending),
      shows: formData.shows ? formData.shows.split(',').map(s => s.trim()) : [],
      image: formData.image
    };

    if (editingItem) {
      setChartData(chartData.map(a => a.name === editingItem.name ? newActor : a));
      setEditingItem(null);
    } else {
      setChartData([...chartData, newActor]);
    }
    setFormData({});
  };

  const handleDelete = (type, id) => {
    if (type === 'shows') setShows(shows.filter(s => s.id !== id));
    if (type === 'news') setNews(news.filter(n => n.id !== id));
    if (type === 'actors') setChartData(chartData.filter(a => a.name !== id));
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
        cast: item.cast.join(', '),
        seasons: item.seasons,
        episodes: item.episodes,
        runtime: item.runtime
      });
    } else if (type === 'news') {
      setFormData({
        title: item.title,
        date: item.date,
        excerpt: item.excerpt,
        image: item.image
      });
    } else if (type === 'actors') {
      setFormData({
        name: item.name,
        trending: item.trending,
        shows: item.shows.join(', '),
        image: item.image
      });
    }
    setAdminMode(type);
  };

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

  // Login/Signup Component
  const LoginSignup = () => (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        background: `
          radial-gradient(circle at ${gradientPosition.x}% ${gradientPosition.y}%, 
            rgba(59, 130, 246, 0.25) 0%, 
            transparent 50%),
          radial-gradient(circle at ${100 - gradientPosition.x}% ${100 - gradientPosition.y}%, 
            rgba(139, 92, 246, 0.25) 0%, 
            transparent 50%),
          linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)
        `
      }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"
          style={{
            animationDuration: '4s',
            transform: `translate(${(gradientPosition.x - 50) * 0.1}px, ${(gradientPosition.y - 50) * 0.1}px)`
          }}
        ></div>
        <div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"
          style={{
            animationDuration: '6s',
            animationDelay: '1s',
            transform: `translate(${(50 - gradientPosition.x) * 0.1}px, ${(50 - gradientPosition.y) * 0.1}px)`
          }}
        ></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Apple TV
          </h1>
          <p className="text-gray-300 text-lg font-light">The home of Apple Originals</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
          <h2 className="text-3xl font-bold text-white mb-2 text-center">
            {showSignup ? 'Create Account' : 'Sign In'}
          </h2>
          <p className="text-gray-300 text-center mb-8">
            {showSignup ? 'Join Apple TV' : 'Continue to Apple TV'}
          </p>

          {loginError && (
            <div className="mb-6 bg-red-500/20 border border-red-500/50 rounded-xl p-4">
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
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
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
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
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
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
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
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
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
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
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

  // Show Card Component
  const ShowCard = ({ show }) => (
    <div 
      className="group relative overflow-hidden rounded-lg cursor-pointer transition-all duration-500 hover:scale-105 hover:z-10"
      onClick={() => setSelectedShow(show)}
    >
      <div className="aspect-[16/9] relative">
        <img 
          src={show.image} 
          alt={show.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />
        
        <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-white font-semibold text-sm">{show.rating}</span>
          </div>
          <h3 className="text-white font-bold text-lg mb-1">{show.title}</h3>
          <p className="text-gray-300 text-xs line-clamp-2 mb-3">{show.description}</p>
          <div className="flex gap-2">
            <button className="flex-1 bg-white text-black rounded-lg py-2 px-3 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-gray-200 transition-all duration-300">
              <Play className="w-4 h-4 fill-current" />
              Play
            </button>
            <button className="bg-white/20 backdrop-blur-sm text-white rounded-lg p-2 hover:bg-white/30 transition-all duration-300">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full">
        <span className="text-white text-xs font-semibold">{show.year}</span>
      </div>
    </div>
  );

  // Season Accordion Component
  const SeasonAccordion = ({ season, showId }) => (
    <div className="bg-slate-800/50 rounded-xl mb-4 overflow-hidden">
      <button
        onClick={() => toggleSeason(season.seasonNumber)}
        className="w-full p-6 text-left flex items-center justify-between hover:bg-slate-700/50 transition-all duration-300"
      >
        <div>
          <h4 className="text-xl font-bold text-white">Season {season.seasonNumber}</h4>
          <p className="text-gray-400">{season.episodes.length} episodes</p>
        </div>
        {expandedSeasons[season.seasonNumber] ? (
          <ChevronUp className="w-6 h-6 text-white" />
        ) : (
          <ChevronDown className="w-6 h-6 text-white" />
        )}
      </button>
      
      {expandedSeasons[season.seasonNumber] && (
        <div className="px-6 pb-6 space-y-4">
          {season.episodes.map(episode => (
            <div key={episode.episodeNumber} className="flex gap-4 p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-all duration-300">
              <img 
                src={episode.image} 
                alt={episode.title}
                className="w-32 h-20 object-cover rounded-lg flex-shrink-0"
              />
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <h5 className="text-lg font-semibold text-white">Episode {episode.episodeNumber}: {episode.title}</h5>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-white text-sm">{episode.rating}</span>
                  </div>
                </div>
                <p className="text-gray-300 text-sm mb-2">{episode.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span>{episode.duration} min</span>
                  <button className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors">
                    <Play className="w-3 h-3" />
                    Play Episode
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
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
            className="absolute top-6 right-6 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-all duration-300 hover:rotate-90 transform"
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
              <button className="bg-white text-black rounded-xl py-4 px-8 font-bold flex items-center gap-3 hover:bg-gray-200 transition-all duration-300 transform hover:scale-105">
                <Play className="w-6 h-6 fill-current" />
                Play Now
              </button>
              <button className="bg-white/20 backdrop-blur-sm text-white rounded-xl py-4 px-8 font-bold flex items-center gap-3 hover:bg-white/30 transition-all duration-300 transform hover:scale-105">
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
                  <span key={i} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105 transform">
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
          <button onClick={() => { setShowAdminPanel(false); setFormData({}); setEditingItem(null); }} className="text-gray-400 hover:text-white transition-all duration-300 hover:rotate-90 transform">
            <X className="w-8 h-8" />
          </button>
        </div>

        <div className="p-6 max-h-[80vh] overflow-y-auto">
          <div className="flex gap-4 mb-6 flex-wrap">
            <button onClick={() => { setAdminMode('shows'); setFormData({}); setEditingItem(null); }} className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${adminMode === 'shows' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'}`}>
              Shows & Movies
            </button>
            <button onClick={() => { setAdminMode('news'); setFormData({}); setEditingItem(null); }} className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${adminMode === 'news' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'}`}>
              News
            </button>
            <button onClick={() => { setAdminMode('actors'); setFormData({}); setEditingItem(null); }} className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${adminMode === 'actors' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'}`}>
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
                      <label className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl cursor-pointer transition-all duration-300">
                        <Upload className="w-5 h-5" />
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'image')} className="hidden" />
                      </label>
                    </div>
                    {formData.image && <img src={formData.image} alt="Preview" className="w-full h-32 object-cover rounded-xl" />}
                  </div>
                  
                  <textarea placeholder="Description" value={formData.description || ''} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 h-24" required />
                  <input type="number" step="0.1" placeholder="Rating" value={formData.rating || ''} onChange={(e) => setFormData({...formData, rating: e.target.value})} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" required />
                  <input type="number" placeholder="Year" value={formData.year || ''} onChange={(e) => setFormData({...formData, year: e.target.value})} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" required />
                  <input type="text" placeholder="Cast (comma separated)" value={formData.cast || ''} onChange={(e) => setFormData({...formData, cast: e.target.value})} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
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
                    <div key={show.id} className="bg-slate-900/50 rounded-xl p-4 flex items-center gap-4 hover:bg-slate-800/70">
                      <img src={show.image} alt={show.title} className="w-16 h-12 object-cover rounded-lg" />
                      <div className="flex-1">
                        <h4 className="text-white font-semibold">{show.title}</h4>
                        <p className="text-gray-400 text-sm">{show.category} • {show.year}</p>
                      </div>
                      <button onClick={() => handleEdit('shows', show)} className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete('shows', show.id)} className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
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
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-300">Image</label>
                    <div className="flex gap-2">
                      <input type="text" placeholder="Image URL" value={formData.image || ''} onChange={(e) => setFormData({...formData, image: e.target.value})} className="flex-1 bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
                      <label className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl cursor-pointer transition-all duration-300">
                        <Upload className="w-5 h-5" />
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'image')} className="hidden" />
                      </label>
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
                    <div key={item.id} className="bg-slate-900/50 rounded-xl p-4 flex items-center gap-4 hover:bg-slate-800/70">
                      <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded-lg" />
                      <div className="flex-1">
                        <h4 className="text-white font-semibold">{item.title}</h4>
                        <p className="text-gray-400 text-sm">{item.date}</p>
                      </div>
                      <button onClick={() => handleEdit('news', item)} className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete('news', item.id)} className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
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
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-300">Image</label>
                    <div className="flex gap-2">
                      <input type="text" placeholder="Image URL" value={formData.image || ''} onChange={(e) => setFormData({...formData, image: e.target.value})} className="flex-1 bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
                      <label className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl cursor-pointer transition-all duration-300">
                        <Upload className="w-5 h-5" />
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'image')} className="hidden" />
                      </label>
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
                  {chartData.map(actor => (
                    <div key={actor.name} className="bg-slate-900/50 rounded-xl p-4 flex items-center gap-4 hover:bg-slate-800/70">
                      <img src={actor.image} alt={actor.name} className="w-16 h-16 object-cover rounded-full" />
                      <div className="flex-1">
                        <h4 className="text-white font-semibold">{actor.name}</h4>
                        <p className="text-gray-400 text-sm">Score: {actor.trending}</p>
                      </div>
                      <button onClick={() => handleEdit('actors', actor)} className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete('actors', actor.name)} className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
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
            © 2024 Apple TV Clone. All rights reserved.
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

  // Main App Render
  if (!isLoggedIn) {
    return <LoginSignup />;
  }

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden"
      style={{
        background: `
          radial-gradient(circle at ${gradientPosition.x}% ${gradientPosition.y}%, 
            rgba(59, 130, 246, 0.1) 0%, 
            transparent 50%),
          radial-gradient(circle at ${100 - gradientPosition.x}% ${100 - gradientPosition.y}%, 
            rgba(139, 92, 246, 0.1) 0%, 
            transparent 50%),
          linear-gradient(to bottom right, #0f172a, #1e293b, #0f172a)
        `,
        transition: 'background 0.3s ease'
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-20 left-20 w-64 h-64 bg-blue-600/10 rounded-full blur-2xl animate-pulse"
          style={{
            transform: `translate(${(gradientPosition.x - 50) * 0.05}px, ${(gradientPosition.y - 50) * 0.05}px)`
          }}
        ></div>
        <div 
          className="absolute bottom-20 right-20 w-64 h-64 bg-purple-600/10 rounded-full blur-2xl animate-pulse"
          style={{
            transform: `translate(${(50 - gradientPosition.x) * 0.05}px, ${(50 - gradientPosition.y) * 0.05}px)`
          }}
        ></div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        .floating-element {
          animation: float 6s ease-in-out infinite;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>

      <header className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-md">
        <div className="max-w-[1600px] mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-12">
              <h1 className="text-3xl font-semibold text-white">Apple TV</h1>
              
              <nav className="flex gap-8">
                <button 
                  onClick={() => setActiveTab('tvshows')}
                  className={`flex items-center gap-2 text-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                    activeTab === 'tvshows' ? 'text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Tv className="w-5 h-5" />
                  TV Shows
                </button>
                <button 
                  onClick={() => setActiveTab('movies')}
                  className={`flex items-center gap-2 text-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                    activeTab === 'movies' ? 'text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Film className="w-5 h-5" />
                  Movies
                </button>
                <button 
                  onClick={() => setActiveTab('news')}
                  className={`flex items-center gap-2 text-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                    activeTab === 'news' ? 'text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Newspaper className="w-5 h-5" />
                  News
                </button>
                <button 
                  onClick={() => setActiveTab('chart')}
                  className={`flex items-center gap-2 text-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                    activeTab === 'chart' ? 'text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <TrendingUp className="w-5 h-5" />
                  Chart
                </button>
              </nav>
            </div>
            
            <div className="flex items-center gap-4">
              {isAdmin && (
                <button 
                  onClick={() => setShowAdminPanel(true)}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
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
                  className="text-gray-400 hover:text-white text-sm font-semibold transition-all duration-300"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-32 pb-16 px-8 max-w-[1600px] mx-auto relative z-10">
        {(activeTab === 'tvshows' || activeTab === 'movies') && (
          <>
            {Object.entries(groupShowsByCategory(filteredShows)).map(([category, categoryShows]) => (
              <div key={category} className="mb-12">
                <h2 className="text-3xl font-bold text-white mb-6">{category}</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {categoryShows.map(show => (
                    <ShowCard key={show.id} show={show} />
                  ))}
                </div>
              </div>
            ))}
          </>
        )}

        {activeTab === 'news' && (
          <>
            <div className="mb-12">
              <h2 className="text-4xl font-bold text-white mb-3">Latest News</h2>
              <p className="text-gray-400 text-lg">Stay updated with your favorite shows and stars</p>
            </div>
            
            <div className="grid gap-6">
              {news.map(item => (
                <div key={item.id} className="bg-gradient-to-r from-slate-800/50 to-slate-800/30 backdrop-blur-sm rounded-2xl overflow-hidden hover:scale-[1.02] transition-all duration-500 cursor-pointer">
                  <div className="flex gap-6">
                    <img src={item.image} alt={item.title} className="w-64 h-48 object-cover" />
                    <div className="flex-1 p-6 flex flex-col justify-center">
                      <div className="text-purple-400 text-sm font-semibold mb-2">{item.date}</div>
                      <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                      <p className="text-gray-400 text-lg">{item.excerpt}</p>
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
                {chartData.sort((a, b) => b.trending - a.trending).map((actor, index) => (
                  <div key={actor.name} className="flex items-center gap-6 p-4 rounded-2xl hover:bg-slate-700/30 transition-all duration-300">
                    <div className="text-3xl font-bold text-transparent bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text w-12 text-center">
                      {index + 1}
                    </div>
                    <img src={actor.image} alt={actor.name} className="w-20 h-20 rounded-full object-cover ring-4 ring-purple-600/50" />
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-1">{actor.name}</h3>
                      <p className="text-gray-400">Featured in: {actor.shows.join(', ')}</p>
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
      </main>

      <Footer />

      {selectedShow && <Modal show={selectedShow} onClose={() => setSelectedShow(null)} />}
      {showAdminPanel && <AdminPanel />}
    </div>
  );
};

export default App;
