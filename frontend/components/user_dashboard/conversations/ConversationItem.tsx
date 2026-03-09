import React from 'react';

interface ConversationItemProps {
  id: string;
  username: string;
  phoneNumber: string;
  lastMessageTime: string;
  status: boolean;
  isActive: boolean;
  onClick: () => void;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  username,
  phoneNumber,
  lastMessageTime,
  status,
  isActive,
  onClick,
}) => {
  const getStatusColor = (s: boolean) => {
    if (s) return 'bg-yellow-100 text-yellow-700';
    return 'bg-green-100 text-green-700';
  };

  return (
    <div 
      onClick={onClick}
      className={`
        p-4 border-b border-gray-100 cursor-pointer transition-colors duration-200
        hover:bg-gray-50
        ${isActive ? 'bg-indigo-50/50 hover:bg-indigo-50/70 border-l-4 border-l-indigo-600' : 'border-l-4 border-l-transparent'}
      `}
    >
      <div className="flex justify-between items-start mb-1">
        <h4 className={`text-sm font-semibold truncate pr-2 ${isActive ? 'text-indigo-900' : 'text-gray-900'}`}>
          {username}
        </h4>
        <span className="text-xs text-gray-400 whitespace-nowrap">
          {new Date(lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
      
      <p className="text-xs text-gray-500 mb-2 truncate">{phoneNumber}</p>
      
      <div className="flex items-center justify-between mt-2">
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wide ${getStatusColor(status)}`}>
          {status ? 'Needs Human' : 'AI Handled'}
        </span>
      </div>
    </div>
  );
};
