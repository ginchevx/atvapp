import React from 'react';

const ShowCard = ({ show, onSelect }) => {
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
      onClick={() => onSelect(show)}
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

const EnhancedShowGrid = ({ shows, activeTab, onShowSelect }) => {
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

  return (
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
              <ShowCard key={show.id} show={show} onSelect={onShowSelect} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default EnhancedShowGrid;
