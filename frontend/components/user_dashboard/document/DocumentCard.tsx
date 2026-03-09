import { DocumentKnowladgeResponse } from '@/lib/services/document/types';
import { AlertCircle, CheckCircle2, Clock, FileText, HardDrive, Trash2 } from 'lucide-react';
import React from 'react';

interface DocumentCardProps {
  item: DocumentKnowladgeResponse;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const DocumentCard: React.FC<DocumentCardProps> = ({ item, onDelete, isDeleting }) => {
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'processed': return <CheckCircle2 size={16} className="text-green-500" />;
      case 'uploaded': return <Clock size={16} className="text-amber-500" />;
      case 'failed': return <AlertCircle size={16} className="text-red-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'processed': return 'bg-green-50 text-green-700 border-green-200';
      case 'uploaded': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'failed': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow group flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg shrink-0">
            <FileText size={24} />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 truncate" title={item.title}>
              {item.title}
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
               <span className="text-xs font-medium uppercase text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                 {item.file_format}
               </span>
               <span className={`text-xs px-2 py-0.5 rounded-full border flex items-center gap-1 font-medium capitalize ${getStatusColor(item.status)}`}>
                 {getStatusIcon(item.status)}
                 {item.status}
               </span>
            </div>
          </div>
        </div>
        
        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to delete this document?')) {
              onDelete(item.id);
            }
          }}
          disabled={isDeleting}
          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded shrink-0 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
          title="Delete Document"
        >
          <Trash2 size={16} />
        </button>
      </div>
      
      <div className="flex-1 mt-2">
        <p className="text-sm text-gray-500 line-clamp-2">
          {item.description}
        </p>
      </div>

      <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1.5 font-medium">
          <HardDrive size={14} className="text-gray-400" />
          <span>{formatBytes(item.file_size)}</span>
        </div>
        <span>Uploaded {new Date(item.created_at).toLocaleDateString()}</span>
      </div>
    </div>
  );
};
