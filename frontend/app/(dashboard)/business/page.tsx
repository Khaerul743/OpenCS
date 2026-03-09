"use client";

import { KnowledgeList } from '@/components/user_dashboard/business_knowladge/KnowledgeList';
import { KnowledgeModal } from '@/components/user_dashboard/business_knowladge/KnowledgeModal';
import { BaseBusinessKnowladge, BusinessKnowladgeResponse } from '@/lib/services/business_knowladge/types';
import { Plus, RefreshCcw, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function BusinessKnowledgePage() {
  const [knowledgeList, setKnowledgeList] = useState<BusinessKnowladgeResponse[]>([]);
  const [filteredList, setFilteredList] = useState<BusinessKnowladgeResponse[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const [editingItem, setEditingItem] = useState<BusinessKnowladgeResponse | null>(null);

  // Fetch all items on mount
  const fetchKnowledgeFiles = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/business_knowladge');
      const result = await response.json();
      
      if (response.ok && result.status === 'success') {
        const sortedData = result.data.sort((a: BusinessKnowladgeResponse, b: BusinessKnowladgeResponse) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setKnowledgeList(sortedData);
        setFilteredList(sortedData);
      } else {
        console.error("Failed to fetch knowledge list:", result.message);
      }
    } catch (error) {
      console.error("Error fetching knowledge list:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchKnowledgeFiles();
  }, []);

  // Filter items based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredList(knowledgeList);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = knowledgeList.filter(item => 
        item.category.toLowerCase().includes(query) || 
        item.category_description.toLowerCase().includes(query)
      );
      setFilteredList(filtered);
    }
  }, [searchQuery, knowledgeList]);

  // Handle Create or Update
  const handleSaveKnowledge = async (data: BaseBusinessKnowladge) => {
    setIsSaving(true);
    try {
      let response;
      if (editingItem) {
        // Update via PUT, passing id as search param
        response = await fetch(`/api/business_knowladge?id=${editingItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
      } else {
        // Create via POST
        response = await fetch('/api/business_knowladge', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to save knowledge base.');
      }

      // Refresh list to mirror server state accurately
      await fetchKnowledgeFiles();
      setIsModalOpen(false);
      setEditingItem(null);
    } catch (error: any) {
      console.error("Save knowledge error:", error);
      throw error; // Re-throw to handle in the modal
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Delete
  const handleDeleteKnowledge = async (id: string) => {
    setDeletingId(id);
    try {
      const response = await fetch(`/api/business_knowladge?id=${id}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (!response.ok) {
         throw new Error(result.message || 'Failed to delete knowledge base.');
      }
      
      // Remove from lists locally to feel instantly responsive 
      setKnowledgeList(prev => prev.filter(item => item.id !== id));
      setFilteredList(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error("Delete knowledge error:", error);
      alert("Failed to delete the knowledge item. Please try again.");
    } finally {
       setDeletingId(null);
    }
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: BusinessKnowladgeResponse) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold text-gray-900">Business Knowledge</h1>
           <p className="text-gray-500 mt-2 text-lg">Manage contextual information, policies, and text references for your AI agents.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchKnowledgeFiles}
            className="p-2.5 text-gray-500 hover:text-indigo-600 bg-white border border-gray-200 rounded-xl hover:border-indigo-200 transition-colors shadow-sm"
            title="Refresh Knowledge"
          >
            <RefreshCcw size={20} className={isLoading ? 'animate-spin' : ''} />
          </button>
          <button 
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-indigo-700 hover:shadow-md transition-all shadow-sm"
          >
            <Plus size={20} />
            Add Knowledge
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
         
         {/* Search */}
         <div className="relative w-full md:max-w-md">
           <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
           <input 
             type="text"
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             placeholder="Search category or description..."
             className="w-full pl-10 pr-4 py-2 border border-gray-200 bg-gray-50 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors focus:bg-white outline-none"
           />
         </div>
         
         <div className="w-full md:w-auto text-sm text-gray-500 font-medium">
            Total Items: <span className="text-gray-900 border border-gray-200 bg-gray-50 px-2.5 py-1 rounded inline-block ml-1">{knowledgeList.length}</span>
         </div>
      </div>

      {/* List Container */}
      <KnowledgeList 
         items={filteredList} 
         onEdit={openEditModal} 
         onDelete={handleDeleteKnowledge} 
         isLoading={isLoading} 
         deletingId={deletingId} 
      />

      {/* Shared Modal component */}
      <KnowledgeModal 
         isOpen={isModalOpen}
         onClose={() => setIsModalOpen(false)}
         onSave={handleSaveKnowledge}
         initialData={editingItem}
         isLoading={isSaving}
      />

    </div>
  );
}
