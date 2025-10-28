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
    }
  ]);

  const [news, setNews] = useState([
    {
      id: 1,
      title: "Stellar Horizons Renewed for Season 4",
      date: "2 days ago",
      excerpt: "The hit sci-fi series gets the green light for another season following record-breaking viewership.",
      image: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&q=80"
    }
  ]);

  const [chartData, setChartData] = useState([
    { name: "Emma Stone", trending: 98, shows: ["Stellar Horizons"], image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80" },
    { name: "Oscar Isaac", trending: 95, shows: ["Stellar Horizons"], image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80" }
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
      
      const isAdminEmail = signupEmail === 'ginchevalex@gmail.com';
      
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

  // ... (other handlers remain the same, just adding the new ones)

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

  // ... (rest of the components remain similar, just adding the dynamic gradient)

  if (!isLoggedIn) {
    return (
      <div 
        className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-8 relative overflow-hidden"
        style={{
          background: `
            radial-gradient(circle at ${gradientPosition.x}% ${gradientPosition.y}%, 
              rgba(59, 130, 246, 0.15) 0%, 
              transparent 50%),
            radial-gradient(circle at ${100 - gradientPosition.x}% ${100 - gradientPosition.y}%, 
              rgba(139, 92, 246, 0.15) 0%, 
              transparent 50%),
            linear-gradient(to bottom right, #0f172a, #1e293b, #0f172a)
          `
        }}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse"
            style={{
              animationDuration: '4s',
              transform: `translate(${(gradientPosition.x - 50) * 0.1}px, ${(gradientPosition.y - 50) * 0.1}px)`
            }}
          ></div>
          <div 
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"
            style={{
              animationDuration: '6s',
              animationDelay: '1s',
              transform: `translate(${(50 - gradientPosition.x) * 0.1}px, ${(50 - gradientPosition.y) * 0.1}px)`
            }}
          ></div>
        </div>

        {/* Login form remains the same */}
        <div className="relative z-10 w-full max-w-md">
          {/* ... login form content ... */}
        </div>
      </div>
    );
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
      `}</style>

      {/* Header and main content remain similar */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-md">
        {/* ... header content ... */}
      </header>

      <main className="pt-32 pb-16 px-8 max-w-[1600px] mx-auto relative z-10">
        {/* ... main content with tabs ... */}
      </main>

      <Footer />

      {selectedShow && <Modal show={selectedShow} onClose={() => setSelectedShow(null)} />}
      {showAdminPanel && <AdminPanel />}
    </div>
  );
};

export default App;
