import { BusinessKnowladgeResponse } from '@/lib/services/business_knowladge/types';
import { Calendar, Edit, FileText, Trash2 } from 'lucide-react';
import React from 'react';

interface KnowledgeCardProps {
  item: BusinessKnowladgeResponse;
  onEdit: (item: BusinessKnowladgeResponse) => void;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

export const KnowledgeCard: React.FC<KnowledgeCardProps> = ({ item, onEdit, onDelete, isDeleting }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow group flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <FileText size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 line-clamp-1" title={item.category}>
              {item.category}
            </h3>
            <span className="text-xs text-indigo-600 font-medium bg-indigo-50 px-2 py-0.5 rounded-full">
              Category
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(item)}
            className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded"
            title="Edit"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this knowledge?')) {
                onDelete(item.id);
              }
            }}
            disabled={isDeleting}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      <div className="flex-1">
        <p className="text-sm text-gray-700 font-medium mb-2">Description</p>
        <p className="text-sm text-gray-500 mb-4 line-clamp-3">
          {item.category_description}
        </p>

        <p className="text-sm text-gray-700 font-medium mb-2">Content Preview</p>
        <p className="text-xs text-gray-500 line-clamp-4 font-mono bg-gray-50 p-3 rounded-lg border border-gray-100">
          {item.content}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100 flex items-center text-xs text-gray-400">
        <Calendar size={14} className="mr-1.5" />
        <span>Added {new Date(item.created_at).toLocaleDateString()}</span>
      </div>
    </div>
  );
};
