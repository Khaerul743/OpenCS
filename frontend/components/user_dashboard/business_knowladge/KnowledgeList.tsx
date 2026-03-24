import { BusinessKnowladgeResponse } from '@/lib/services/business_knowladge/types';
import { Database } from 'lucide-react';
import React from 'react';
import { KnowledgeCard } from './KnowledgeCard';

interface KnowledgeListProps {
  items: BusinessKnowladgeResponse[];
  onEdit: (item: BusinessKnowladgeResponse) => void;
  onDelete: (id: string) => void;
  deletingId?: string | null;
  isLoading?: boolean;
}

export const KnowledgeList: React.FC<KnowledgeListProps> = ({
  items,
  onEdit,
  onDelete,
  deletingId,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 h-64 animate-pulse flex flex-col justify-between">
            <div className="flex gap-4">
               <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
               <div className="space-y-2 flex-1">
                 <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                 <div className="h-3 bg-gray-200 rounded w-1/4"></div>
               </div>
            </div>
            <div className="space-y-2">
               <div className="h-3 bg-gray-100 rounded w-full"></div>
               <div className="h-3 bg-gray-100 rounded w-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center mb-4">
          <Database size={32} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">No Knowledge Base Yet</h3>
        <p className="text-sm text-gray-500 max-w-sm mt-1 mb-6">
          Add specific knowledge like formatting rules, policies, or company info for your agent to memorize.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {items.map((item) => (
        <KnowledgeCard
          key={item.id}
          item={item}
          onEdit={onEdit}
          onDelete={onDelete}
          isDeleting={deletingId === item.id}
        />
      ))}
    </div>
  );
};
