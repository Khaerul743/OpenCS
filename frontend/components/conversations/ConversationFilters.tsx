import React from 'react';

interface ConversationFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export const ConversationFilters: React.FC<ConversationFiltersProps> = ({
  activeFilter,
  onFilterChange,
}) => {
  const filters = [
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active' },
    { id: 'pending', label: 'Pending' },
    { id: 'closed', label: 'Closed' },
  ];

  // Separate Human Needed to distinguish it visually or keep it in the list?
  // User asked for "Human Needed" as a tab filter.

  return (
    <div className="flex items-center gap-1 p-2 bg-gray-50/50 border-b border-gray-100 overflow-x-auto scrollbar-hide">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={`
            px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors
            ${activeFilter === filter.id 
              ? 'bg-white text-gray-900 shadow-sm border border-gray-200' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}
          `}
        >
          {filter.label}
        </button>
      ))}
      <div className="w-px h-4 bg-gray-300 mx-1 flex-shrink-0" />
      <button
        onClick={() => onFilterChange('human_needed')}
        className={`
          px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors
          ${activeFilter === 'human_needed' 
            ? 'bg-amber-50 text-amber-700 shadow-sm border border-amber-200' 
            : 'text-gray-500 hover:text-amber-700 hover:bg-amber-50'}
        `}
      >
        Needs Human
      </button>
    </div>
  );
};
