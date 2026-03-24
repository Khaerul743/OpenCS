"use client";

import React, { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex bg-gray-50 min-h-screen font-sans text-gray-900">
      <Sidebar isCollapsed={isSidebarCollapsed} />
      
      <div 
        className={`
          flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out
          ${isSidebarCollapsed ? 'ml-[72px]' : 'ml-[240px]'}
        `}
      >
        <Header 
          isSidebarCollapsed={isSidebarCollapsed} 
          toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
        />
        
        <main className="flex-1 p-6 lg:p-10 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
