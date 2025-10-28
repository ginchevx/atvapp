import React from 'react';

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
