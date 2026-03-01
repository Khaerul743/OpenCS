import { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
  isCollapsed: boolean;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  icon: Icon,
  label,
  href,
  isCollapsed,
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`
        group flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-150 ease-in-out
        ${isActive 
          ? 'bg-indigo-50 text-indigo-700 font-semibold' 
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
        ${isCollapsed ? 'justify-center' : ''}
        relative overflow-hidden
      `}
      aria-current={isActive ? 'page' : undefined}
      title={isCollapsed ? label : undefined}
    >
      {isActive && (
        <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-indigo-600 rounded-r-full" />
      )}
      
      <Icon 
        size={20} 
        className={`
          flex-shrink-0 transition-transform duration-150
          ${isActive ? 'text-indigo-600' : 'text-gray-500 group-hover:text-gray-700'}
          group-hover:scale-105
        `} 
      />
      
      {!isCollapsed && (
        <span className="whitespace-nowrap truncate">{label}</span>
      )}
    </Link>
  );
};
