import { AlertCircle, UploadCloud, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (formData: FormData) => Promise<void>;
  isLoading?: boolean;
}

export const DocumentModal: React.FC<DocumentModalProps> = ({
  isOpen,
  onClose,
  onUpload,
  isLoading = false,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFile(null);
      setDescription('');
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      
      // Basic validation extensions
      const validExtensions = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      if (!validExtensions.includes(selectedFile.type)) {
         setError('Invalid file type. Please upload a PDF, DOC, DOCX, or TXT file.');
         setFile(null);
         return;
      }
      
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a document to upload.");
      return;
    }
    if (!description.trim()) {
      setError("Please provide a description for this document.");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('file_description', description.trim());

    try {
      await onUpload(formData);
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred while uploading.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Upload Document</h2>
            <p className="text-sm text-gray-500 mt-1">
              Add a PDF, DOCX, or TXT file to your knowledge base.
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

          <form id="upload-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* File Dropzone / Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select File
              </label>
              <div 
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${file ? 'border-indigo-500 bg-indigo-50/50' : 'border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100'}`}
                onClick={() => !isLoading && fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  className="hidden" 
                  ref={fileInputRef}
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileChange}
                  disabled={isLoading}
                />
                
                {file ? (
                   <div className="flex flex-col items-center">
                     <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-3">
                       <UploadCloud size={24} />
                     </div>
                     <p className="text-sm font-medium text-gray-900 truncate max-w-full px-4">{file.name}</p>
                     <p className="text-xs text-gray-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                     <button 
                       type="button" 
                       className="text-xs text-indigo-600 font-medium mt-3 hover:underline"
                       onClick={(e) => {
                         e.stopPropagation();
                         setFile(null);
                         if(fileInputRef.current) fileInputRef.current.value = '';
                       }}
                       disabled={isLoading}
                     >
                       Choose different file
                     </button>
                   </div>
                ) : (
                  <div className="flex flex-col items-center text-gray-500">
                    <UploadCloud size={32} className="mb-3 text-gray-400" />
                    <p className="text-sm font-medium text-gray-700">Click to browse files</p>
                    <p className="text-xs mt-1">PDF, DOCX, TXT (Max 10MB ideal)</p>
                  </div>
                )}
              </div>
            </div>

            {/* Description Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly describe what this document contains and how the AI should use it..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow outline-none resize-y text-sm"
                disabled={isLoading}
              />
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
            form="upload-form"
            disabled={isLoading || !file || !description.trim()}
            className="flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <UploadCloud size={16} />
            )}
            {isLoading ? 'Uploading...' : 'Upload Document'}
          </button>
        </div>

      </div>
    </div>
  );
};
