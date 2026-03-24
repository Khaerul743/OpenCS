import { BaseBusinessKnowladge } from '@/lib/services/business_knowladge/types';
import { AlertCircle, Save, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface KnowledgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: BaseBusinessKnowladge) => Promise<void>;
  initialData?: BaseBusinessKnowladge | null;
  isLoading?: boolean;
}

const DEFAULT_DATA: BaseBusinessKnowladge = {
  category: '',
  category_description: '',
  content: '',
};

export const KnowledgeModal: React.FC<KnowledgeModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<BaseBusinessKnowladge>(DEFAULT_DATA);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData || DEFAULT_DATA);
      setError(null);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const isEditMode = !!initialData;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category.trim() || !formData.category_description.trim() || !formData.content.trim()) {
      setError("All fields are required.");
      return;
    }

    try {
      await onSave(formData);
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {isEditMode ? 'Edit Business Knowledge' : 'Add New Knowledge'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Provide context for the AI agent to use in conversations.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isLoading}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 flex-1 overflow-y-auto">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-700 text-sm">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <form id="knowledge-form" onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Category
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g. Return Policy, Pricing, Company Info"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow outline-none"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Description
              </label>
              <input
                type="text"
                value={formData.category_description}
                onChange={(e) => setFormData({ ...formData, category_description: e.target.value })}
                placeholder="Brief summary of what this knowledge covers"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow outline-none"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Detailed Content
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Paste the precise text or instructions you want the AI to memorize..."
                rows={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow outline-none resize-y custom-scrollbar font-mono text-sm leading-relaxed"
                disabled={isLoading}
              />
              <p className="mt-2 text-xs text-gray-500 flex justify-end">
                {formData.content.length} characters
              </p>
            </div>
          </form>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="knowledge-form"
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save size={16} />
            )}
            {isLoading ? 'Saving...' : 'Save Knowledge'}
          </button>
        </div>

      </div>
    </div>
  );
};
