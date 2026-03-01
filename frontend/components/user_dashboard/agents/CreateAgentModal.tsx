import { Bot, X } from 'lucide-react';
import React from 'react';
import { AgentForm, AgentFormData } from './AgentForm';
import { ToggleSwitch } from './ToggleSwitch';

interface CreateAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AgentFormData) => void;
}

export const CreateAgentModal: React.FC<CreateAgentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = React.useState<AgentFormData>({
    name: '',
    tone: 'friendly',
    temperature: 0.7,
    fallback_email: '',
    llm_provider: 'openai',
    llm_model: 'gpt-4-turbo',
    phone_number_id: '',
    prompt: '',
    enable_ai: true,
    include_memory: true,
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
               <Bot size={24} />
             </div>
             <div>
               <h2 className="text-lg font-bold text-gray-900">Create New Agent</h2>
               <p className="text-sm text-gray-500">Configure your AI assistant</p>
             </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <form id="create-agent-form" onSubmit={handleSubmit}>
            
            {/* Enable Toggle at top for creation */}
            <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex items-center justify-between mb-6">
               <div>
                  <h3 className="font-semibold text-indigo-900">Enable Agent</h3>
                  <p className="text-sm text-indigo-700">Turn on AI responses immediately after creation</p>
               </div>
               <ToggleSwitch 
                 checked={formData.enable_ai || false} 
                 onChange={(val) => setFormData({...formData, enable_ai: val})} 
               />
            </div>

            <AgentForm 
              data={formData} 
              onChange={setFormData} 
              isCreating={true}
            />
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="create-agent-form"
            className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 shadow-md transition-all transform hover:scale-105"
          >
            Create Agent
          </button>
        </div>

      </div>
    </div>
  );
};
