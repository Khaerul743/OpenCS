import { Ban, Send } from 'lucide-react';
import React from 'react';

interface ChatInputProps {
  value: string;
  onChange: (val: string) => void;
  onSend: () => void;
  isDisabled: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSend,
  isDisabled,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="p-4 border-t border-gray-200 bg-white">
      {isDisabled ? (
        <div className="flex items-center justify-center p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 gap-2 text-sm select-none">
          <Ban size={16} />
          <span>Agent is active. Disable agent to send messages manually.</span>
        </div>
      ) : (
        <div className="relative flex items-end gap-2">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 max-h-32 min-h-[44px] py-3 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none custom-scrollbar"
            rows={1}
          />
          <button
            onClick={onSend}
            disabled={!value.trim()}
            className={`
              p-3 rounded-xl transition-all duration-200 flex-shrink-0
              ${value.trim() 
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md transform hover:scale-105' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'}
            `}
          >
            <Send size={18} />
          </button>
        </div>
      )}
    </div>
  );
};
