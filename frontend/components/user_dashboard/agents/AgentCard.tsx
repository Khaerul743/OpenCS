import { AlertCircle, Bot, Calendar, Check, RotateCcw } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { AgentForm, AgentFormData } from './AgentForm';
import { ToggleSwitch } from './ToggleSwitch';

interface AgentCardProps {
  agent: AgentFormData & { 
    id: string; 
    created_at: string; 
    updated_at: string;
    enable_ai: boolean;
  };
  onSave: (data: Partial<AgentFormData>) => Promise<void> | void;
  isLoading?: boolean;
}

export const AgentCard: React.FC<AgentCardProps> = ({
  agent,
  onSave,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<AgentFormData>(agent);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Update local state when prop changes (e.g. after save)
  useEffect(() => {
    setFormData(agent);
    setIsDirty(false);
  }, [agent]);

  const handleFormChange = (data: AgentFormData) => {
    setFormData(data);
    setIsDirty(true);
  };

  const handleToggleAI = (enabled: boolean) => {
     onSave({ enable_ai: enabled }); // Immediate save for toggle usually, or could be part of form. 
     // Request implied toggle is separate in header.
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(formData);
      setIsDirty(false);
    } catch (error) {
      console.error("Failed to save changes", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setFormData(agent);
    setIsDirty(false);
  };

  if (isLoading) {
      return (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 animate-pulse space-y-8">
             <div className="flex justify-between items-center border-b border-gray-100 pb-6">
                 <div className="flex gap-4">
                     <div className="w-16 h-16 bg-gray-200 rounded-xl"></div>
                     <div className="space-y-2">
                         <div className="w-48 h-6 bg-gray-200 rounded"></div>
                         <div className="flex gap-2">
                             <div className="w-20 h-5 bg-gray-200 rounded-full"></div>
                             <div className="w-20 h-5 bg-gray-200 rounded-full"></div>
                         </div>
                     </div>
                 </div>
                 <div className="w-32 h-10 bg-gray-200 rounded-full"></div>
             </div>
             <div className="grid grid-cols-2 gap-8 h-64 bg-gray-50 rounded-xl"></div>
          </div>
      )
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md">
      
      {/* HEADER */}
      <div className="px-8 py-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white">
        <div className="flex items-center gap-5">
           <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
             <Bot size={32} />
           </div>
           <div>
             <h2 className="text-2xl font-bold text-gray-900">{agent.name}</h2>
             <div className="flex items-center gap-2 mt-2">
               <span className="px-2.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-semibold uppercase tracking-wider border border-gray-200">
                 {agent.llm_provider}
               </span>
               <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-semibold uppercase tracking-wider border border-blue-100">
                 {agent.llm_model}
               </span>
             </div>
           </div>
        </div>

        <div className="flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-xl border border-gray-200">
           <div className="flex flex-col items-end">
              <span className="text-sm font-semibold text-gray-900">Agent Status</span>
              <span className={`text-xs font-medium ${agent.enable_ai ? 'text-green-600' : 'text-gray-500'}`}>
                {agent.enable_ai ? 'Active & Responding' : 'Disabled'}
              </span>
           </div>
           <ToggleSwitch 
             checked={agent.enable_ai} 
             onChange={handleToggleAI}
           />
        </div>
      </div>

      {/* BODY */}
      <div className="p-8">
        <AgentForm 
          data={formData} 
          onChange={handleFormChange} 
        />
        
        {/* Timestamps */}
        <div className="grid grid-cols-2 gap-6 mt-8 pt-6 border-t border-gray-100 text-xs text-gray-400">
           <div className="flex items-center gap-2">
             <Calendar size={14} />
             <span>Created: {new Date(agent.created_at).toLocaleDateString()}</span>
           </div>
           <div className="flex items-center gap-2 justify-end">
             <RotateCcw size={14} />
             <span>Last Updated: {new Date(agent.updated_at).toLocaleString()}</span>
           </div>
        </div>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="bg-gray-50 px-8 py-5 border-t border-gray-200 flex items-center justify-between">
         <div className="flex items-center gap-2 text-amber-600 text-sm opacity-0 transition-opacity duration-300" style={{ opacity: isDirty ? 1 : 0 }}>
            <AlertCircle size={16} />
            <span>Unsaved changes</span>
         </div>

         <div className="flex items-center gap-4">
            <button
              onClick={handleReset}
              disabled={!isDirty || isSaving}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${isDirty 
                  ? 'text-gray-600 hover:bg-gray-200 hover:text-gray-900' 
                  : 'text-gray-300 cursor-not-allowed'}
              `}
            >
              <RotateCcw size={16} />
              Reset
            </button>
            
            <button
              onClick={handleSave}
              disabled={!isDirty || isSaving}
              className={`
                flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium shadow-sm transition-all transform
                ${isDirty 
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105 shadow-md' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
              `}
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Check size={18} />
              )}
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
         </div>
      </div>

    </div>
  );
};
