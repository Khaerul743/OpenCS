"use client";

import { AgentCard } from '@/components/user_dashboard/agents/AgentCard';
import { CreateAgentModal } from '@/components/user_dashboard/agents/CreateAgentModal';
import { AgentResponse } from '@/lib/services/agent/types';
import { AlertCircle, Plus, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AgentsPage() {
  const router = useRouter();
  const [agent, setAgent] = useState<AgentResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const response = await fetch('/api/agent');
        
        if (response.status === 401) {
          router.push('/login');
          return;
        }

        const resData = await response.json();

        if (!response.ok) {
          if (response.status === 404) {
             setAgent(null);
          } else {
             throw new Error(resData.message || 'Failed to fetch agent data');
          }
        } else {
           setAgent(resData.data || null);
        }
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgent();
  }, [router]);

  const handleCreateAgent = (data: any) => {
    // API Call Mock
    const newAgent = {
        ...data,
        id: `agent-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };
    setAgent(newAgent as AgentResponse);
    setIsModalOpen(false);
  };

  const handleUpdateAgent = async (changes: any) => {
    // If it's only a status toggle enable_ai, just update state (handled differently later)
    if (Object.keys(changes).length === 1 && 'enable_ai' in changes) {
        setAgent((prev: any) => prev ? ({
            ...prev,
            ...changes,
            updated_at: new Date().toISOString()
        }) : prev);
        return;
    }

    try {
        const payload = { ...agent, ...changes };
        const response = await fetch('/api/agent', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.status === 401) {
            router.push('/login');
            return;
        }

        const resData = await response.json();

        if (!response.ok) {
            throw new Error(resData.message || 'Failed to update agent parameters');
        }

        // Do not use resData.data to update UI as the PUT endpoint doesn't return the full agent object
        setAgent(payload as AgentResponse);
    } catch (err: any) {
        alert(err.message || 'An unexpected error occurred while updating the agent.');
        throw err;
    }
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
        ) : error ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] bg-red-50 rounded-xl border border-red-100 p-8 my-8">
              <div className="text-red-500 mb-4 bg-red-100 p-4 rounded-full">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-xl font-bold text-red-900 mb-2">Failed to load agent</h3>
              <p className="text-red-700 text-center mb-6 max-w-md">
                {error}
              </p>
              <button 
                onClick={() => window.location.reload()} 
                className="px-6 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors shadow-sm"
              >
                Try Again
              </button>
            </div>
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