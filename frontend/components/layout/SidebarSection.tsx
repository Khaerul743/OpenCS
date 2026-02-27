import React from 'react';

interface SidebarSectionProps {
  title: string;
  children: React.ReactNode;
  isCollapsed: boolean;
}

export const SidebarSection: React.FC<SidebarSectionProps> = ({
  title,
  children,
  isCollapsed,
}) => {
  if (isCollapsed) {
    return (
      <div className="py-2 border-t border-gray-100 first:border-0">
        <div className="flex flex-col gap-1 px-2">
            {children}
        </div>
      </div>
    );
  }

  return (
    <div className="py-2 mb-2">
      <h3 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
        {title}
      </h3>
      <div className="flex flex-col gap-1 px-2">
        {children}
      </div>
    </div>
  );
};
