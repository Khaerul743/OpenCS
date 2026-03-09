import { AlertTriangle, X } from 'lucide-react';
import React from 'react';

interface FallbackNoticeProps {
  confidenceLevel: number;
  reason: string;
  onDismiss?: () => void;
}

export const FallbackNotice: React.FC<FallbackNoticeProps> = ({
  confidenceLevel,
  reason,
  onDismiss,
}) => {
  return (
    <div className="mx-4 mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl relative animate-in fade-in slide-in-from-top-2 duration-300">
      {onDismiss && (
        <button 
          onClick={onDismiss}
          className="absolute top-2 right-2 p-1 text-amber-400 hover:text-amber-600 rounded-full hover:bg-amber-100 transition-colors"
        >
          <X size={14} />
        </button>
      )}
      
      <div className="flex gap-3">
        <div className="p-2 bg-amber-100 rounded-lg h-fit text-amber-600">
          <AlertTriangle size={20} />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-amber-900 mb-1">Human Intervention Needed</h4>
          <p className="text-sm text-amber-800 leading-relaxed mb-2">
            The AI is unsure how to proceed.
          </p>
          <div className="flex items-center gap-4 text-xs font-medium text-amber-700">
            <div className="px-2 py-0.5 bg-amber-200/50 rounded border border-amber-200">
               Confidence: {(confidenceLevel).toFixed(0)}%
            </div>
            <span className="italic">"{reason}"</span>
          </div>
        </div>
      </div>
    </div>
  );
};
