"use client";

import { useEffect, useState } from 'react';
import { ChatWindow } from '../../components/conversations/ChatWindow';
import { ConversationList } from '../../components/conversations/ConversationList';
import AppLayout from '../../components/layout/AppLayout';

// --- MOCK DATA ---

const MOCK_CONVERSATIONS = {
  status: "success",
  message: "Conversations retrieved",
  data: Array.from({ length: 15 }, (_, i) => ({
    id: `conv-${i}`,
    username: i === 0 ? "John Doe" : i === 1 ? "Jane Smith" : `User ${i}`,
    phone_number: `+1 (555) 000-${i.toString().padStart(4, '0')}`,
    status: i === 1 ? 'pending' : i % 3 === 0 ? 'closed' : 'active',
    last_message_at: new Date(Date.now() - i * 1000 * 60 * 10).toISOString(),
    created_at: new Date(Date.now() - i * 1000 * 60 * 60 * 24).toISOString(),
    agent_id: 'agent-1',
    business_id: 'biz-1',
    customer_id: `cust-${i}`
  })) as any[] 
};

// Add fallback request to one conversation
MOCK_CONVERSATIONS.data[1].fallback_requested = true;

const MOCK_MESSAGES = {
  status: "success",
  message: "Messages retrieved",
  data: [
    { id: '1', content: "Hi, I have a question about my order.", sender_type: "customer", created_at: new Date(Date.now() - 3600000).toISOString() },
    { id: '2', content: "Hello! I'd be happy to help. crucial info could you provide your order number?", sender_type: "ai", created_at: new Date(Date.now() - 3500000).toISOString() },
    { id: '3', content: "It's #12345.", sender_type: "customer", created_at: new Date(Date.now() - 3400000).toISOString() },
    { id: '4', content: "Thank you. Let me check the status for you.", sender_type: "ai", created_at: new Date(Date.now() - 3300000).toISOString() },
    { id: '5', content: "I found your order. It is currently being processed and will ship tomorrow.", sender_type: "ai", created_at: new Date(Date.now() - 3200000).toISOString() },
  ]
};

const MOCK_FALLBACK = {
    id: "fb-1",
    created_at: new Date().toISOString(),
    business_id: "biz-1",
    conversation_id: "conv-1",
    confidence_level: 0.45,
    last_decision_summary: "User requested a refund for a custom item, which requires manager approval. Policy is unclear."
};


export default function ConversationsPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loadingChat, setLoadingChat] = useState(false);
  
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Chat state
  const [isAgentEnabled, setIsAgentEnabled] = useState(true);

  // Initial Fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      setConversations(MOCK_CONVERSATIONS.data);
      setLoadingList(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Filter Logic
  const filteredConversations = conversations.filter(conv => {
    const matchesFilter = 
      filter === 'all' ? true :
      filter === 'human_needed' ? conv.fallback_requested :
      conv.status === filter;
    
    const matchesSearch = 
      conv.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.phone_number.includes(searchQuery);

    return matchesFilter && matchesSearch;
  });

  // Select Conversation Logic
  const handleSelectConversation = (id: string) => {
    setSelectedId(id);
    setLoadingChat(true);
    // Simulate chat load
    setTimeout(() => {
        setMessages(MOCK_MESSAGES.data); // Reset to mock history
        setLoadingChat(false);
        // Reset agent state toggles per conversation if needed, for now mocking global/per session persistence
        setIsAgentEnabled(true); 
    }, 800);
  };

  const handleSendMessage = (text: string) => {
    const newMessage = {
        id: Date.now().toString(),
        content: text,
        sender_type: 'human',
        created_at: new Date().toISOString()
    };
    setMessages([...messages, newMessage]);
  };

  const selectedConversation = conversations.find(c => c.id === selectedId);
  const fallbackData = selectedConversation?.fallback_requested ? MOCK_FALLBACK : null;

  return (
    <AppLayout>
      <div className="h-[calc(100vh-100px)] bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex">
        
        {/* Left Panel: List */}
        <div className="w-1/3 min-w-[320px] max-w-[400px] h-full flex flex-col">
           <ConversationList
             conversations={filteredConversations}
             selectedId={selectedId}
             onSelect={handleSelectConversation}
             isLoading={loadingList}
             filter={filter}
             onFilterChange={setFilter}
             searchQuery={searchQuery}
             onSearchChange={setSearchQuery}
           />
        </div>

        {/* Right Panel: Chat */}
        <div className="flex-1 h-full min-w-0">
           <ChatWindow
             conversationId={selectedId}
             username={selectedConversation?.username || ''}
             phoneNumber={selectedConversation?.phone_number || ''}
             status={selectedConversation?.status || 'active'}
             fallback={fallbackData}
             messages={messages}
             isAgentEnabled={isAgentEnabled}
             onToggleAgent={setIsAgentEnabled}
             onSendMessage={handleSendMessage}
             isLoading={loadingChat}
           />
        </div>

      </div>
    </AppLayout>
  );
}
