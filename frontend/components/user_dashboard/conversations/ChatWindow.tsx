import { MessageSquareDashed } from 'lucide-react';
import React, { useEffect, useRef } from 'react';
import { ChatHeader } from './ChatHeader';
import { ChatInput } from './ChatInput';
import { FallbackNotice } from './FallbackNotice';
import { MessageBubble } from './MessageBubble';

interface Message {
  id: string;
  content: string;
  sender_type: 'customer' | 'ai' | 'human';
  created_at: string;
}

interface ChatWindowProps {
  conversationId: string | null;
  username: string;
  phoneNumber: string;
  status: 'active' | 'closed' | 'pending';
  fallback?: {
    confidence_level: number;
    last_decision_summary: string;
  } | null;
  messages: Message[];
  isAgentEnabled: boolean;
  onToggleAgent: (enabled: boolean) => void;
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  conversationId,
  username,
  phoneNumber,
  status,
  fallback,
  messages,
  isAgentEnabled,
  onToggleAgent,
  onSendMessage,
  isLoading,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [inputText, setInputText] = React.useState('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  if (!conversationId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50/50 text-gray-400 h-full">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
           <MessageSquareDashed size={48} className="text-gray-300" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Conversation Selected</h3>
        <p className="max-w-sm text-center text-gray-500">
           Select a conversation from the list or search for a user to view their chat history.
        </p>
      </div>
    );
  }

  if (isLoading) {
      return (
          <div className="flex-1 flex flex-col h-full bg-white animate-pulse">
              <div className="h-16 border-b border-gray-100 bg-gray-50/50"></div>
              <div className="flex-1 p-6 space-y-6">
                  <div className="h-16 w-3/4 bg-gray-100 rounded-2xl rounded-tl-sm"></div>
                  <div className="h-24 w-2/3 bg-gray-100 rounded-2xl rounded-tr-sm ml-auto"></div>
                  <div className="h-10 w-1/2 bg-gray-100 rounded-2xl rounded-tl-sm"></div>
              </div>
              <div className="h-20 border-t border-gray-100 bg-gray-50/50"></div>
          </div>
      )
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <ChatHeader
        username={username}
        phoneNumber={phoneNumber}
        status={status}
        isAgentEnabled={isAgentEnabled}
        onToggleAgent={onToggleAgent}
      />

      {/* Fallback Notice */}
      {fallback && (
        <FallbackNotice 
           confidenceLevel={fallback.confidence_level} 
           reason={fallback.last_decision_summary} 
        />
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-slate-50/30">
        <div className="flex flex-col justify-end min-h-full">
            {messages.map((msg) => (
            <MessageBubble
                key={msg.id}
                content={msg.content}
                senderType={msg.sender_type}
                timestamp={msg.created_at}
            />
            ))}
            <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <ChatInput
        value={inputText}
        onChange={setInputText}
        onSend={handleSend}
        isDisabled={isAgentEnabled}
      />
    </div>
  );
};
