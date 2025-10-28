import React, { useState, useEffect, useRef } from 'react';
import { Play, Plus, Star, TrendingUp, Film, Tv, Newspaper, Settings, Edit, Trash2, X, ChevronDown, Clock, Download, UploadCloud, Zap, Calendar, Heart, Share2, Bookmark } from 'lucide-react';

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
  
  const APP_VERSION = "2.0.0";

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
            year: 2023,
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

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setGradientPosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');
    
    const testEmail = 'admin@apple.tv';
    const testPassword = 'admin123';
    
    if (loginEmail === testEmail && loginPassword === testPassword) {
      const userData = { email: loginEmail, isAdmin: true };
      setCurrentUser(userData);
      setIsLoggedIn(true);
      setIsAdmin(true);
    } else {
      setLoginError('Invalid credentials. Try admin@apple.tv / admin123');
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
    
    const isAdminEmail = signupEmail === 'admin@apple.tv';
    const userData = {
      email: signupEmail,
      isAdmin: isAdminEmail,
      createdAt: new Date().toISOString()
    };
    
    setCurrentUser(userData);
    setIsLoggedIn(true);
    setIsAdmin(userData.isAdmin);
  };

  const toggleSeason = (seasonNumber, showId) => {
    const key = `${showId}-${seasonNumber}`;
    setExpandedSeasons(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const updateData = (key, value) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const handleAddShow = (e) => {
    e.preventDefault();
    const newShow = {
      id: editingItem?.id || Date.now(),
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
        seasons: parseInt(formData.seasons) || 0,
        episodes: parseInt(formData.episodes) || 0,
        seasonsData: []
      } : {
        runtime: parseInt(formData.runtime) || 0
      })
    };

    if (editingItem) {
      updateData('shows', shows.map(s => s.id === editingItem.id ? newShow : s));
    } else {
      updateData('shows', [...shows, newShow]);
    }
    setEditingItem(null);
    setFormData({});
  };

  const handleDelete = (type, id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      if (type === 'shows') updateData('shows', shows.filter(s => s.id !== id));
      if (type === 'news') updateData('news', news.filter(n => n.id !== id));
      if (type === 'actors') updateData('actors', actors.filter(a => a.name !== id));
    }
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
    }
    setAdminMode(type);
  };

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
            ? { ...ep, ...episodeFormData, duration: parseInt(episodeFormData.duration), rating: parseFloat(episodeFormData.rating) }
            : ep
        )
      }));
      return { ...show, seasonsData: updatedSeasonsData };
    });
    
    updateData('shows', updatedShows);
    setEditingEpisode(null);
  };

  const ShowCard = ({ show }) => {
    const categoryColors = {
      'Sci-Fi': 'from-purple-600 to-blue-600',
      'Action': 'from-red-500 to-orange-500',
      'Drama': 'from-green-500 to-emerald-600',
      'Crime': 'from-gray-600 to-slate-700'
    };

    return (
      <div 
        className="group relative cursor-pointer transition-all duration-500 hover:scale-105"
        onClick={() => setSelectedShow(show)}
      >
        <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-slate-800 border border-slate-700">
          <img src={show.image} alt={show.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
          
          <div className="absolute top-3 left-3 flex gap-2">
            {show.isTrending && (
              <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Trending
              </span>
            )}
          </div>
          
          <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-full">
            <span className="text-white text-xs font-semibold">{show.year}</span>
          </div>
          
          <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-all duration-500">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-white font-bold text-sm">{show.rating}</span>
              <span className="text-gray-300 text-sm">•</span>
              <span className="text-gray-300 text-sm">{show.category}</span>
            </div>
            
            <h3 className="text-white font-bold text-lg mb-2">{show.title}</h3>
            <p className="text-gray-300 text-xs line-clamp-2 mb-3">{show.description}</p>
            
            <div className="flex gap-2">
              <button 
                onClick={(e) => { e.stopPropagation(); alert('Playing ' + show.title); }}
                className="flex-1 bg-white text-black rounded-lg py-2 px-3 text-sm font-bold flex items-center justify-center gap-2 hover:bg-gray-200"
              >
                <Play className="w-4 h-4 fill-current" />
                Play
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); alert('Added to list'); }}
                className="bg-white/20 backdrop-blur-sm text-white rounded-lg p-2 hover:bg-white/30"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const EpisodeCard = ({ episode, onEdit, isAdmin }) => (
    <div className="flex gap-4 p-4 bg-slate-800/40 rounded-xl hover:bg-slate-700/60 transition-all group border border-slate-700/50">
      <img src={episode.image} alt={episode.title} className="w-32 h-20 object-cover rounded-lg" />
      <div className="flex-1">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h5 className="text-lg font-semibold text-white">Episode {episode.episodeNumber}: {episode.title}</h5>
            <div className="flex items-center gap-3 mt-1">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-white text-sm">{episode.rating}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-400 text-sm">
                <Clock className="w-3 h-3" />
                <span>{episode.duration} min</span>
              </div>
            </div>
          </div>
          
          {isAdmin && (
            <button 
              onClick={(e) => { e.stopPropagation(); onEdit(episode); }}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 opacity-0 group-hover:opacity-100"
            >
              <Edit className="w-3 h-3" />
            </button>
          )}
        </div>
        
        <p className="text-gray-300 text-sm mb-3">{episode.description}</p>
        
        <button 
          onClick={(e) => { e.stopPropagation(); alert('Playing episode: ' + episode.title); }}
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
        >
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <Play className="w-3 h-3 fill-current text-white" />
          </div>
          <span className="text-sm font-medium">Play Episode</span>
        </button>
      </div>
    </div>
  );

  const SeasonAccordion = ({ season, showId }) => {
    const key = `${showId}-${season.seasonNumber}`;
    const isExpanded = expandedSeasons[key];

    return (
      <div className="bg-slate-800/60 rounded-2xl mb-4 overflow-hidden border border-slate-700/50">
        <button
          onClick={() => toggleSeason(season.seasonNumber, showId)}
          className="w-full p-6 text-left flex items-center justify-between hover:bg-slate-700/30 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
              {season.seasonNumber}
            </div>
            <div>
              <h4 className="text-xl font-bold text-white">Season {season.seasonNumber}</h4>
              <p className="text-gray-400">{season.episodes.length} episodes • {season.year}</p>
            </div>
          </div>
          <ChevronDown className={`w-6 h-6 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
        
        <div className={`transition-all duration-500 ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
          <div className="px-6 pb-6 space-y-4">
            {season.episodes.map(episode => (
              <EpisodeCard key={episode.id} episode={episode} onEdit={handleEditEpisode} isAdmin={isAdmin} />
            ))}
          </div>
        </div>
      </div>
    );
  };

  const Modal = ({ show, onClose }) => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8" onClick={onClose}>
      <div className="bg-slate-900 rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
        <div className="relative h-96">
          <img src={show.image} alt={show.title} className="w-full h-full object-cover rounded-t-3xl" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
          <button onClick={onClose} className="absolute top-6 right-6 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white">
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-8 left-8 right-8">
            <h2 className="text-5xl font-bold text-white mb-4">{show.title}</h2>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2 bg-black/50 px-4 py-2 rounded-full">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="text-white font-bold">{show.rating}</span>
              </div>
              <span className="text-gray-300">{show.year}</span>
              {show.seasons && <span className="text-gray-300">{show.seasons} Seasons</span>}
            </div>
            <div className="flex gap-3">
              <button onClick={(e) => { e.stopPropagation(); alert('Playing: ' + show.title); }} className="bg-white text-black rounded-xl py-4 px-8 font-bold flex items-center gap-3 hover:bg-gray-200">
                <Play className="w-6 h-6 fill-current" />
                Play Now
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-8">
          <p className="text-gray-300 text-lg mb-8">{show.description}</p>
          
          {show.type === 'tvshow' && show.seasonsData && (
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-6">Seasons & Episodes</h3>
              {show.seasonsData.map(season => (
                <SeasonAccordion key={season.seasonNumber} season={season} showId={show.id} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const AdminPanel = () => (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 rounded-3xl max-w-4xl w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-white">Admin Panel</h2>
          <button onClick={() => setShowAdminPanel(false)} className="text-gray-400 hover:text-white">
            <X className="w-8 h-8" />
          </button>
        </div>
        
        <form onSubmit={handleAddShow} className="space-y-4">
          <input type="text" placeholder="Title" value={formData.title || ''} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white" required />
          <textarea placeholder="Description" value={formData.description || ''} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white h-24" required />
          <input type="number" step="0.1" placeholder="Rating" value={formData.rating || ''} onChange={(e) => setFormData({...formData, rating: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white" required />
          <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 rounded-xl hover:from-blue-700 hover:to-purple-700">
            Add Show
          </button>
        </form>
      </div>
    </div>
  );

  const filteredShows = shows.filter(show => 
    activeTab === 'movies' ? show.type === 'movie' : 
    activeTab === 'tvshows' ? show.type === 'tvshow' : 
    true
  );

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="w-full max-w-md">
          <h1 className="text-6xl font-black text-white mb-8 text-center bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Apple TV+</h1>
          
          <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">{showSignup ? 'Join' : 'Welcome'}</h2>

            {loginError && <div className="mb-4 bg-red-500/20 border border-red-500/50 rounded-xl p-4"><p className="text-red-300 text-sm text-center">{loginError}</p></div>}

            {!showSignup ? (
              <form onSubmit={handleLogin} className="space-y-6">
                <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="Email" className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-4 text-white" required />
                <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="Password" className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-4 text-white" required />
                <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 rounded-xl hover:from-blue-700 hover:to-purple-700">Sign In</button>
              </form>
            ) : (
              <form onSubmit={handleSignup} className="space-y-6">
                <input type="email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} placeholder="Email" className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-4 text-white" required />
                <input type="password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} placeholder="Password" className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-4 text-white" required />
                <input type="password" value={signupConfirmPassword} onChange={(e) => setSignupConfirmPassword(e.target.value)} placeholder="Confirm Password" className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-4 text-white" required />
                <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 rounded-xl">Create Account</button>
              </form>
            )}

            <div className="mt-6 text-center">
              <button onClick={() => setShowSignup(!showSignup)} className="text-blue-400 hover:text-blue-300 font-semibold">
                {showSignup ? 'Sign in instead' : 'Create account'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="fixed top-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <h1 className="text-2xl font-black text-white bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Apple TV+</h1>
            
            <nav className="flex gap-8">
              {['tvshows', 'movies', 'news', 'chart'].map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`flex items-center gap-3 text-lg font-semibold px-4 py-2 rounded-2xl ${activeTab === tab ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}>
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
            {isAdmin && (
              <button onClick={() => setShowAdminPanel(true)} className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-xl font-semibold">
                <Settings className="w-4 h-4" />
                Admin
              </button>
            )}
            
            <div className="flex items-center gap-3">
              <span className="text-gray-400 text-sm">{currentUser?.email}</span>
              <button onClick={() => { setIsLoggedIn(false); setIsAdmin(false); setCurrentUser(null); }} className="text-gray-400 hover:text-white text-sm font-semibold">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-16 px-8 max-w-7xl mx-auto">
        {(activeTab === 'tvshows' || activeTab === 'movies') && (
          <div className="space-y-12">
            <div>
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-4xl font-bold text-white">{activeTab === 'movies' ? 'Movies' : 'TV Shows'}</h2>
                <div className="flex-1 h-px bg-slate-700"></div>
                <span className="text-gray-400 text-lg">{filteredShows.length} titles</span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredShows.map(show => (
                  <ShowCard key={show.id} show={show} />
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'news' && (
          <>
            <div className="mb-12">
              <h2 className="text-4xl font-bold text-white mb-3">Latest News</h2>
              <p className="text-gray-400 text-lg">Stay updated with your favorite shows</p>
            </div>
            
            <div className="grid gap-6">
              {news.map(item => (
                <div key={item.id} className="bg-slate-800/50 rounded-2xl overflow-hidden hover:scale-[1.02] transition-all cursor-pointer">
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
              <p className="text-gray-400 text-lg">Most popular stars</p>
            </div>
            
            <div className="bg-slate-800/50 rounded-3xl p-8">
              <div className="space-y-4">
                {actors.sort((a, b) => b.trending - a.trending).map((actor, index) => (
                  <div key={actor.name} className="flex items-center gap-6 p-4 rounded-2xl hover:bg-slate-700/30 transition-all">
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
                        <div className="text-sm text-gray-400">Score</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>

      <footer className="mt-16 border-t border-slate-800 pt-8 pb-6">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex justify-between items-center">
            <div className="text-gray-400 text-sm">© 2025 ATV / Blackwell Studios</div>
            <div className="flex items-center gap-6">
              <span className="text-gray-500 text-sm">Version {APP_VERSION}</span>
              <div className="flex gap-4">
                <button className="text-gray-400 hover:text-white text-sm">Privacy</button>
                <button className="text-gray-400 hover:text-white text-sm">Terms</button>
                <button className="text-gray-400 hover:text-white text-sm">Help</button>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {selectedShow && <Modal show={selectedShow} onClose={() => setSelectedShow(null)} />}
      {showAdminPanel && <AdminPanel />}
      {editingEpisode && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Edit Episode</h3>
              <button onClick={() => setEditingEpisode(null)} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSaveEpisode} className="space-y-4">
              <input 
                type="text" 
                placeholder="Episode Title" 
                value={episodeFormData.title || ''}
                onChange={(e) => setEpisodeFormData({...episodeFormData, title: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white"
                required
              />
              
              <textarea 
                placeholder="Description" 
                value={episodeFormData.description || ''}
                onChange={(e) => setEpisodeFormData({...episodeFormData, description: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white h-24"
                required
              />
              
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="number" 
                  placeholder="Duration (min)" 
                  value={episodeFormData.duration || ''}
                  onChange={(e) => setEpisodeFormData({...episodeFormData, duration: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white"
                  required
                />
                <input 
                  type="number" 
                  step="0.1" 
                  placeholder="Rating" 
                  value={episodeFormData.rating || ''}
                  onChange={(e) => setEpisodeFormData({...episodeFormData, rating: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="text" 
                  placeholder="Director" 
                  value={episodeFormData.director || ''}
                  onChange={(e) => setEpisodeFormData({...episodeFormData, director: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white"
                />
                <input 
                  type="text" 
                  placeholder="Writer" 
                  value={episodeFormData.writer || ''}
                  onChange={(e) => setEpisodeFormData({...episodeFormData, writer: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white"
                />
              </div>

              <input 
                type="date" 
                value={episodeFormData.releaseDate || ''}
                onChange={(e) => setEpisodeFormData({...episodeFormData, releaseDate: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white"
              />
              
              <input 
                type="text" 
                placeholder="Image URL" 
                value={episodeFormData.image || ''}
                onChange={(e) => setEpisodeFormData({...episodeFormData, image: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white"
              />
              
              <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 rounded-xl hover:from-blue-700 hover:to-purple-700">
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
