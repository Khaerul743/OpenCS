"use client";

import { AgentCard } from '@/components/user_dashboard/agents/AgentCard';
import { CreateAgentModal } from '@/components/user_dashboard/agents/CreateAgentModal';
import { Plus, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

// --- MOCK DATA ---
const MOCK_AGENT = {
  status: "success",
  message: "Agent retrieved",
  data: {
    id: "agent-123",
    name: "Customer Success Bot",
    enable_ai: true,
    phone_number_id: "PHONE_ID_55501",
    fallback_email: "support@example.com",
    prompt: "You are a helpful customer service agent for a tech company. You should be polite, concise, and professional. Always ask for clarification if the user's request is ambiguous.",
    llm_model: "gpt-4-turbo",
    llm_provider: "openai",
    tone: "professional",
    temperature: 0.7,
    created_at: "2023-11-15T10:00:00Z",
    updated_at: new Date().toISOString()
  }
};

export default function AgentsPage() {
  const [agent, setAgent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Initial Fetch Simulation
  useEffect(() => {
    const timer = setTimeout(() => {
        // Toggle this logic to test "No Agent" state if needed
        const hasAgent = true; 
        if (hasAgent) {
            setAgent(MOCK_AGENT.data);
        } else {
            setAgent(null);
        }
        setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleCreateAgent = (data: any) => {
    // API Call Mock
    const newAgent = {
        ...data,
        id: `agent-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };
    setAgent(newAgent);
    setIsModalOpen(false);
  };

  const handleUpdateAgent = (changes: any) => {
    // API Call Mock
    setAgent((prev: any) => ({
        ...prev,
        ...changes,
        updated_at: new Date().toISOString()
    }));
  };

  return (
    <>
      <div className="max-w-5xl mx-auto space-y-8 pb-12">
        
        {/* Page Header */}
        <div>
           <h1 className="text-3xl font-bold text-gray-900">Agent Settings</h1>
           <p className="text-gray-500 mt-2 text-lg">Manage your AI customer support agent configuration.</p>
        </div>

        {/* Content */}
        {isLoading ? (
            <AgentCard agent={{} as any} onSave={() => {}} isLoading={true} />
        ) : agent ? (
            <AgentCard agent={agent} onSave={handleUpdateAgent} />
        ) : (
            // No Agent Empty State
            <div className="bg-white rounded-3xl border border-gray-200 p-12 flex flex-col items-center justify-center text-center shadow-sm min-h-[500px]">
                <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
                    <Sparkles className="text-indigo-600" size={40} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">No Agent Configured Yet</h2>
                <p className="text-gray-500 max-w-md mb-8 leading-relaxed">
                    Get started by creating your first AI agent. Configure its personality, knowledge base, and behavior to start automating customer support.
                </p>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                >
                    <Plus size={20} />
                    Create New Agent
                </button>
            </div>
        )}

      </div>

      <CreateAgentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleCreateAgent}
      />
    </>
  );
}