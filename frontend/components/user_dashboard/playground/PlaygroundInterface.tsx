"use client";

import { Bot, Info, Send, Sparkles } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { MessageBubble } from '../conversations/MessageBubble';

interface AIResponseDetail {
  decision_summary: string;
  human_fallback: boolean;
  confidence_level: number;
}

interface Message {
  id: string;
  content: string;
  senderType: 'customer' | 'ai' | 'human';
  timestamp: string;
  detail?: AIResponseDetail;
}

export const PlaygroundInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Halo, dengan siapa ini?',
      senderType: 'customer',
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userText = inputValue;
    const newUserMessage: Message = {
      id: Date.now().toString(),
      content: userText,
      senderType: 'customer',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/agent/invoke', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text_message: userText }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to get agent response');
      }

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: data.data.response,
        senderType: 'ai',
        timestamp: new Date().toISOString(),
        detail: data.data.detail
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (error: unknown) {
      console.error("Agent invocation failed:", error);
      // Add a system message bubble to show the error
      const errorMessageText = error instanceof Error ? error.message : 'An unexpected error occurred while communicating with the agent.';
      const errorMessage: Message = {
         id: (Date.now() + 1).toString(),
         content: `Error: ${errorMessageText}`,
         senderType: 'human', // Using human color scheme for system alerts/errors for now
         timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Find the latest AI detail to display in the side panel
  const latestAiDetails = [...messages].reverse().find(m => m.senderType === 'ai' && m.detail)?.detail;

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-140px)] gap-6">
      
      {/* Chat Area */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
               <Sparkles size={20} />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">Agent Playground</h2>
              <p className="text-xs text-gray-500">Test your AI agent behavior in real-time</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-xs font-semibold text-gray-600">Simulated Environment</span>
          </div>
        </div>

        {/* Message Container */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50 space-y-2 custom-scrollbar">
          {messages.map((msg) => (
            <MessageBubble 
              key={msg.id} 
              content={msg.content} 
              senderType={msg.senderType} 
              timestamp={msg.timestamp} 
            />
          ))}
          {isLoading && (
            <div className="flex w-full justify-start mb-4">
              <div className="px-5 py-4 rounded-2xl bg-white border border-gray-100 text-gray-800 rounded-bl-sm shadow-sm flex gap-2">
                <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Custom Input */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="relative flex items-end gap-2">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message as a test user..."
              className="flex-1 max-h-32 min-h-[44px] py-3 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none custom-scrollbar"
              rows={1}
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className={`
                p-3 rounded-xl transition-all duration-200 flex-shrink-0
                ${inputValue.trim() && !isLoading
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md transform hover:scale-105' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'}
              `}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Debug/Details Panel */}
      <div className="lg:w-96 bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
         <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
            <Info size={18} className="text-gray-500" />
            <h3 className="font-semibold text-gray-800 text-sm">Last Response Details</h3>
         </div>
         <div className="p-6 flex-1 overflow-y-auto">
            {latestAiDetails ? (
              <div className="space-y-6">
                <div>
                   <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Decision Summary</label>
                   <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 text-sm text-indigo-900 leading-relaxed">
                     {latestAiDetails.decision_summary}
                   </div>
                </div>

                <div>
                   <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Metrics</label>
                   <div className="grid grid-cols-2 gap-4">
                     <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
                       <span className="text-xs text-gray-500 block mb-1">Human Fallback</span>
                       <span className={`font-semibold text-lg ${latestAiDetails.human_fallback ? 'text-red-600' : 'text-green-600'}`}>
                         {latestAiDetails.human_fallback ? 'Required' : 'None'}
                       </span>
                     </div>
                     <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
                       <span className="text-xs text-gray-500 block mb-1">Confidence</span>
                       <span className="font-semibold text-lg text-gray-900">
                         {latestAiDetails.confidence_level}%
                       </span>
                     </div>
                   </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 gap-3">
                 <Bot size={32} className="opacity-50" />
                 <p className="text-sm">Send a message to see the AI&apos;s decision process here.</p>
              </div>
            )}
         </div>
      </div>
    </div>
  );
};
