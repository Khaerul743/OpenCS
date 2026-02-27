import { Bot, MoreVertical, Phone, User } from 'lucide-react';
import React from 'react';

interface ChatHeaderProps {
  username: string;
  phoneNumber: string;
  isAgentEnabled: boolean;
  onToggleAgent: (enabled: boolean) => void;
  status: 'active' | 'closed' | 'pending';
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  username,
  phoneNumber,
  isAgentEnabled,
  onToggleAgent,
  status,
}) => {
  return (
    <div className="h-16 px-6 border-b border-gray-200 flex items-center justify-between bg-white shrink-0 sticky top-0 z-10">
      
      {/* User Info */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700">
           <User size={20} />
        </div>
        <div>
           <h3 className="font-semibold text-gray-900 leading-tight">{username}</h3>
           <div className="flex items-center gap-2 text-xs text-gray-500">
              <Phone size={12} />
              <span>{phoneNumber}</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full" />
              <span className="capitalize">{status}</span>
           </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6">
        
        {/* Agent Toggle */}
        <div className="flex items-center gap-3 bg-gray-50 p-1.5 rounded-lg border border-gray-200">
           <div className={`p-1.5 rounded-md ${isAgentEnabled ? 'bg-indigo-100 text-indigo-700' : 'text-gray-400'}`}>
              <Bot size={18} />
           </div>
           
           <div className="flex flex-col">
              <span className="text-xs font-semibold text-gray-700">AI Agent</span>
              <span className="text-[10px] text-gray-400">
                {isAgentEnabled ? 'Active' : 'Paused'}
              </span>
           </div>

           <button 
             onClick={() => onToggleAgent(!isAgentEnabled)}
             className={`
               relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ml-2
               ${isAgentEnabled ? 'bg-indigo-600' : 'bg-gray-300'}
             `}
           >
             <span
               className={`
                 inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform duration-200
                 ${isAgentEnabled ? 'translate-x-4.5' : 'translate-x-1'}
               `}
             />
           </button>
        </div>

        <button className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors">
          <MoreVertical size={20} />
        </button>
      </div>

    </div>
  );
};
