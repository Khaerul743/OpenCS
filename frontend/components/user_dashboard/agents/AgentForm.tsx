import { Bot, Cpu, Mail, Type } from 'lucide-react';
import React from 'react';
import { TemperatureSlider } from './TemperatureSlider';
import { ToggleSwitch } from './ToggleSwitch';

export interface AgentFormData {
  name: string;
  tone: string;
  temperature: number;
  fallback_email: string;
  llm_provider: string;
  llm_model: string;
  phone_number_id: string;
  prompt: string;
  enable_ai?: boolean;
  include_memory?: boolean;
}

interface AgentFormProps {
  data: AgentFormData;
  onChange: (data: AgentFormData) => void;
  isCreating?: boolean;
}

export const AgentForm: React.FC<AgentFormProps> = ({
  data,
  onChange,
  isCreating = false,
}) => {
  const handleChange = (field: keyof AgentFormData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      {/* LEFT COLUMN */}
      <div className="space-y-6">
        
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Agent Name</label>
          <div className="relative">
            <Bot className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={data.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
              placeholder="e.g. Support Bot 3000"
            />
          </div>
        </div>

        {/* Tone */}
        <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">Tone</label>
           <select
             value={data.tone}
             onChange={(e) => handleChange('tone', e.target.value)}
             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white"
           >
             <option value="friendly">Friendly</option>
             <option value="formal">Formal</option>
             <option value="casual">Casual</option>
             <option value="professional">Professional</option>
           </select>
        </div>

        {/* Temperature */}
        <TemperatureSlider
          value={data.temperature}
          onChange={(val) => handleChange('temperature', val)}
        />

        {/* Fallback Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fallback Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="email"
              value={data.fallback_email}
              onChange={(e) => handleChange('fallback_email', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="human@example.com"
            />
          </div>
        </div>

        {isCreating && (
          <div className="flex items-center justify-between py-2 border-t border-gray-100 mt-4">
             <span className="text-sm font-medium text-gray-700">Include Conversation Memory</span>
             <ToggleSwitch 
               checked={data.include_memory || false} 
               onChange={(val) => handleChange('include_memory', val)}
             />
          </div>
        )}

      </div>

      {/* RIGHT COLUMN */}
      <div className="space-y-6">
        
        {/* Provider */}
        <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">LLM Provider</label>
           <div className="relative">
             <Cpu className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
             <select
               value={data.llm_provider}
               onChange={(e) => handleChange('llm_provider', e.target.value)}
               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white"
             >
               <option value="openai">OpenAI</option>
               <option value="anthropic">Anthropic</option>
               <option value="google">Google Gemini</option>
             </select>
           </div>
        </div>

        {/* Model */}
        <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
           <select
             value={data.llm_model}
             onChange={(e) => handleChange('llm_model', e.target.value)}
             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white"
           >
             <option value="gpt-4-turbo">GPT-4 Turbo</option>
             <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
             <option value="claude-3-opus">Claude 3 Opus</option>
             <option value="gemini-pro">Gemini Pro</option>
           </select>
        </div>

        {/* Phone Number ID (Read-only if not creating maybe? keeping editable for now based on request) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number ID</label>
          <input
            type="text"
            value={data.phone_number_id}
            onChange={(e) => handleChange('phone_number_id', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
            placeholder="PHONE_NUMBER_ID"
            disabled={!isCreating} // Usually immutable after creation, let's disable strictly if editing
          />
          {!isCreating && <p className="text-xs text-gray-400 mt-1">Cannot be changed after creation.</p>}
        </div>

      </div>

      {/* PROMPT SECTION (Full Width) */}
      <div className="md:col-span-2 pt-4 border-t border-gray-100">
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <Type size={16} />
          System Prompt
        </label>
        <textarea
          value={data.prompt}
          onChange={(e) => handleChange('prompt', e.target.value)}
          rows={6}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm resize-y"
          placeholder="You are a helpful assistant..."
        />
        <p className="text-xs text-gray-500 mt-2 text-right">
          {(data.prompt || '').length} characters
        </p>
      </div>

    </div>
  );
};
