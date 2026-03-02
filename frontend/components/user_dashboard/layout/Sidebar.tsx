import {
  Bot,
  Briefcase,
  FileText,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  PieChart,
  Settings,
  Users
} from 'lucide-react';
import React from 'react';
import { SidebarItem } from './SidebarItem';
import { SidebarSection } from './SidebarSection';

interface SidebarProps {
  isCollapsed: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed }) => {
  return (
    <aside 
      className={`
        fixed left-0 top-0 bottom-0 z-40
        flex flex-col bg-slate-50 border-r border-gray-200
        transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-[72px]' : 'w-[240px]'}
      `}
    >
      {/* Logo Area */}
      <div className={`
        h-16 flex items-center border-b border-gray-200
        ${isCollapsed ? 'justify-center px-2' : 'px-6'}
      `}>
        <div className="flex items-center gap-2 font-bold text-xl text-indigo-600">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
            CF
          </div>
          {!isCollapsed && <span className="text-gray-900 transition-opacity duration-300">ChatFlow</span>}
        </div>
      </div>

      {/* Navigation Content */}
      <div className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-gray-200">
        
        <SidebarSection title="Main" isCollapsed={isCollapsed}>
          <SidebarItem icon={LayoutDashboard} label="Dashboard" href="/dashboard" isCollapsed={isCollapsed} />
          <SidebarItem icon={MessageSquare} label="Conversations" href="/conversations" isCollapsed={isCollapsed} />
        </SidebarSection>

        <SidebarSection title="Agent Control" isCollapsed={isCollapsed}>
          <SidebarItem icon={Bot} label="Agents" href="/agents" isCollapsed={isCollapsed} />
          <SidebarItem icon={Users} label="Customers" href="/customers" isCollapsed={isCollapsed} />
          <SidebarItem icon={Briefcase} label="Business Knowledge" href="/business" isCollapsed={isCollapsed} />
          <SidebarItem icon={FileText} label="Document Knowledge" href="/documents" isCollapsed={isCollapsed} />
        </SidebarSection>

        <SidebarSection title="Intelligence" isCollapsed={isCollapsed}>
          <SidebarItem icon={PieChart} label="Analytics" href="/analytics" isCollapsed={isCollapsed} />
        </SidebarSection>
        
        <SidebarSection title="System" isCollapsed={isCollapsed}>
          <SidebarItem icon={Settings} label="Settings" href="/settings" isCollapsed={isCollapsed} />
        </SidebarSection>

      </div>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-gray-200">
         <button 
           className={`
             flex items-center gap-3 w-full px-3 py-2 rounded-lg 
             text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors
             ${isCollapsed ? 'justify-center' : ''}
           `}
           title="Logout"
         >
           <LogOut size={20} />
           {!isCollapsed && <span className="font-medium">Logout</span>}
         </button>
      </div>

    </aside>
  );
};
