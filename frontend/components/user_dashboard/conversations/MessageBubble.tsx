import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MessageBubbleProps {
  content: string;
  senderType: 'customer' | 'ai' | 'human';
  timestamp: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  content,
  senderType,
  timestamp,
}) => {
  const isCustomer = senderType === 'customer';
  
  return (
    <div className={`flex w-full ${isCustomer ? 'justify-start' : 'justify-end'} mb-4 group`}>
      <div className={`
        max-w-[70%] flex flex-col 
        ${isCustomer ? 'items-start' : 'items-end'}
      `}>
        <div className={`
          px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm
          ${isCustomer 
            ? 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm' 
            : senderType === 'ai'
              ? 'bg-blue-600 text-white rounded-tr-sm'
              : 'bg-green-600 text-white rounded-tr-sm' // Human
          }
        `}>
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({node: _, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
              strong: ({node: _, ...props}) => <strong className="font-bold" {...props} />,
              em: ({node: _, ...props}) => <em className="italic" {...props} />,
              ul: ({node: _, ...props}) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
              ol: ({node: _, ...props}) => <ol className="list-decimal pl-4 mb-2 space-y-1" {...props} />,
              li: ({node: _, ...props}) => <li className="pl-1" {...props} />,
              a: ({node: _, ...props}) => <a className="underline hover:opacity-80 transition-opacity" target="_blank" rel="noreferrer" {...props} />,
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
        
        <div className="flex items-center gap-1.5 mt-1 px-1">
           <span className="text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
              {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
           </span>
           {!isCustomer && (
             <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
               {senderType}
             </span>
           )}
        </div>
      </div>
    </div>
  );
};
