"use client";

import { DocumentList } from '@/components/user_dashboard/document/DocumentList';
import { DocumentModal } from '@/components/user_dashboard/document/DocumentModal';
import { DocumentKnowladgeResponse } from '@/lib/services/document/types';
import { Plus, RefreshCcw, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function DocumentKnowledgePage() {
  const [documentList, setDocumentList] = useState<DocumentKnowladgeResponse[]>([]);
  const [filteredList, setFilteredList] = useState<DocumentKnowladgeResponse[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/document_knowladge');
      
      // Handle empty state explicitly based on user request (404 implies empty)
      if (response.status === 404) {
         setDocumentList([]);
         setFilteredList([]);
         return;
      }
      
      const result = await response.json();
      
      if (response.ok && result.status === 'success') {
        const sortedData = result.data.sort((a: DocumentKnowladgeResponse, b: DocumentKnowladgeResponse) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setDocumentList(sortedData);
        setFilteredList(sortedData);
      } else {
        console.error("Failed to fetch documents:", result.message);
      }
    } catch (error) {
       console.error("Error fetching documents:", error);
       // Fallback to empty list gracefully 
       setDocumentList([]);
       setFilteredList([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Filter items based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredList(documentList);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = documentList.filter(item => 
        item.title.toLowerCase().includes(query) || 
        item.description.toLowerCase().includes(query)
      );
      setFilteredList(filtered);
    }
  }, [searchQuery, documentList]);

  const handleUploadDocument = async (formData: FormData) => {
    setIsUploading(true);
    try {
      const response = await fetch('/api/document_knowladge', {
        method: 'POST',
        // Omitting Content-Type so browser sets it to multipart/form-data with boundary naturally
        body: formData, 
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to upload document.');
      }

      // Refresh list to mirror server state accurately
      await fetchDocuments();
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Upload document error:", error);
      throw error; 
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteDocument = async (id: string) => {
    setDeletingId(id);
    try {
      const response = await fetch(`/api/document_knowladge?id=${id}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (!response.ok) {
         throw new Error(result.message || 'Failed to delete document.');
      }
      
      // Update local state to feel instantly responsive
      setDocumentList(prev => prev.filter(item => item.id !== id));
      setFilteredList(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error("Delete document error:", error);
      alert("Failed to delete the document. Please try again.");
    } finally {
       setDeletingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold text-gray-900">Document Knowledge</h1>
           <p className="text-gray-500 mt-2 text-lg">Upload files for your AI agents to use as reference material (PDF, Word, TXT).</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchDocuments}
            className="p-2.5 text-gray-500 hover:text-indigo-600 bg-white border border-gray-200 rounded-xl hover:border-indigo-200 transition-colors shadow-sm"
            title="Refresh Documents"
          >
            <RefreshCcw size={20} className={isLoading ? 'animate-spin' : ''} />
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-indigo-700 hover:shadow-md transition-all shadow-sm"
          >
            <Plus size={20} />
            Upload Document
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
         <div className="relative w-full md:max-w-md">
           <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
           <input 
             type="text"
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             placeholder="Search document name or description..."
             className="w-full pl-10 pr-4 py-2 border border-gray-200 bg-gray-50 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors focus:bg-white outline-none"
           />
         </div>
         
         <div className="w-full md:w-auto text-sm text-gray-500 font-medium">
            Total Files: <span className="text-gray-900 border border-gray-200 bg-gray-50 px-2.5 py-1 rounded inline-block ml-1">{documentList.length}</span>
         </div>
      </div>

      {/* List Container */}
      <DocumentList 
         items={filteredList} 
         onDelete={handleDeleteDocument} 
         isLoading={isLoading} 
         deletingId={deletingId} 
      />

      {/* Modal */}
      <DocumentModal 
         isOpen={isModalOpen}
         onClose={() => setIsModalOpen(false)}
         onUpload={handleUploadDocument}
         isLoading={isUploading}
      />

    </div>
  );
}
