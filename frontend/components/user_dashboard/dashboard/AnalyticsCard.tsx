import { LucideIcon } from 'lucide-react';
import React from 'react';

interface AnalyticsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  isLoading?: boolean;
}

export const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  label,
  value,
  icon: Icon,
  trend,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
          <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
        </div>
        <div className="h-8 w-32 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <div className="p-2 bg-indigo-50 rounded-lg">
          <Icon size={20} className="text-indigo-600" />
        </div>
      </div>
      
      <div className="flex items-end gap-3">
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        {trend && (
          <span className={`
            text-xs font-medium px-2 py-1 rounded-full mb-1
            ${trend.isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}
          `}>
            {trend.value}
          </span>
        )}
      </div>
    </div>
  );
};
