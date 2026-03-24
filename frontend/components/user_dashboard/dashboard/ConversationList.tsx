import { Clock, MessageSquare, User } from 'lucide-react';
import React from 'react';

interface Conversation {
  id: string;
  username: string;
  phone_number: string;
  need_human: boolean;
  last_message_at: string;
  created_at: string;
  last_message?: {
    content: string;
    sender_type: string;
    created_at: string;
  };
}

interface ConversationListProps {
  conversations: Conversation[];
  isLoading?: boolean;
}

export const ConversationList: React.FC<ConversationListProps> = ({ 
  conversations, 
  isLoading = false 
}) => {
  const getStatusColor = (needHuman: boolean) => {
    return needHuman ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700';
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-pulse">
        <div className="h-6 w-40 bg-gray-200 rounded mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4">
               <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
               <div className="flex-1 h-4 bg-gray-200 rounded"></div>
               <div className="h-4 w-20 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Top Conversations</h3>
        <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">View All</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
              <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Message</th>
              <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {conversations.map((conv) => (
              <tr key={conv.id} className="hover:bg-gray-50 transition-colors group">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                      <User size={16} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{conv.username}</p>
                      <p className="text-xs text-gray-500">{conv.phone_number}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(conv.need_human)}`}>
                    {conv.need_human ? 'Needs Human' : 'AI Handled'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <MessageSquare size={14} />
                    <span className="text-sm">{new Date(conv.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5 text-gray-400">
                    <Clock size={14} />
                    <span className="text-xs">{new Date(conv.created_at).toLocaleDateString()}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {conversations.length === 0 && (
            <div className="text-center py-8 text-gray-500 text-sm">
                No recent conversations found.
            </div>
        )}
      </div>
    </div>
  );
};
