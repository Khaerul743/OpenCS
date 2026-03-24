import { DocumentKnowladgeResponse } from '@/lib/services/document/types';
import { Files } from 'lucide-react';
import React from 'react';
import { DocumentCard } from './DocumentCard';

interface DocumentListProps {
  items: DocumentKnowladgeResponse[];
  onDelete: (id: string) => void;
  deletingId?: string | null;
  isLoading?: boolean;
}

export const DocumentList: React.FC<DocumentListProps> = ({
  items,
  onDelete,
  deletingId,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 h-48 animate-pulse flex flex-col justify-between">
            <div className="flex gap-4 items-start">
               <div className="w-12 h-12 bg-gray-200 rounded-lg shrink-0"></div>
               <div className="space-y-2 flex-1">
                 <div className="h-5 bg-gray-200 rounded w-full"></div>
                 <div className="flex gap-2">
                    <div className="h-4 bg-gray-200 rounded w-12"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                 </div>
               </div>
            </div>
            <div className="h-4 bg-gray-100 rounded w-full mt-4"></div>
            <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between">
               <div className="h-3 bg-gray-100 rounded w-16"></div>
               <div className="h-3 bg-gray-100 rounded w-24"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-16 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center mb-5">
          <Files size={40} />
        </div>
        <h3 className="text-xl font-bold text-gray-900">No Documents Uploaded</h3>
        <p className="text-gray-500 max-w-md mt-2 mb-6 leading-relaxed">
          Upload PDF, DOCX, or TXT files to give your AI access to company documents, manuals, and specific references.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <DocumentCard
          key={item.id}
          item={item}
          onDelete={onDelete}
          isDeleting={deletingId === item.id}
        />
      ))}
    </div>
  );
};
