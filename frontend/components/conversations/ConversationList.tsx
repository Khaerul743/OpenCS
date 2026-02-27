import { Search } from 'lucide-react';
import React from 'react';
import { ConversationFilters } from './ConversationFilters';
import { ConversationItem } from './ConversationItem';

interface Conversation {
  id: string;
  username: string;
  phone_number: string;
  last_message_at: string;
  status: 'active' | 'closed' | 'pending';
  fallback_requested?: boolean; // Mock property for now, derived from fallback data in real app
}

interface ConversationListProps {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  isLoading: boolean;
  filter: string;
  onFilterChange: (filter: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedId,
  onSelect,
  isLoading,
  filter,
  onFilterChange,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      
      {/* Search Header */}
      <div className="p-4 border-b border-gray-100 sticky top-0 bg-white z-10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <ConversationFilters activeFilter={filter} onFilterChange={onFilterChange} />

      {/* List Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {isLoading ? (
          <div className="space-y-2 p-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-4 border border-transparent rounded-lg animate-pulse flex flex-col gap-2">
                 <div className="flex justify-between">
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    <div className="h-3 w-12 bg-gray-200 rounded"></div>
                 </div>
                 <div className="h-3 w-32 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-gray-500 text-sm">
            <p>No conversations found.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {conversations.map((conv) => (
              <ConversationItem
                key={conv.id}
                id={conv.id}
                username={conv.username}
                phoneNumber={conv.phone_number}
                lastMessageTime={conv.last_message_at}
                status={conv.status}
                isActive={selectedId === conv.id}
                hasFallback={!!conv.fallback_requested}
                onClick={() => onSelect(conv.id)}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
