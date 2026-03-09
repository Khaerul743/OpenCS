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
    { id: 'human_needed', label: 'Needs Human' },
    { id: 'ai_handled', label: 'AI Handled' },
  ];

  return (
    <div className="flex items-center gap-2 p-3 bg-gray-50/50 border-b border-gray-100 overflow-x-auto scrollbar-hide">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={`
            px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors
            ${activeFilter === filter.id 
              ? (filter.id === 'human_needed' ? 'bg-amber-50 text-amber-700 shadow-sm border border-amber-200' : 'bg-white text-gray-900 shadow-sm border border-gray-200')
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 border border-transparent'}
          `}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};
