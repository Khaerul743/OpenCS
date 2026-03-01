import { Sparkles } from 'lucide-react';
import React from 'react';

interface AuthCardProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export const AuthCard: React.FC<AuthCardProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4 transition-transform duration-500 hover:rotate-12 hover:scale-105 shadow-sm">
             <Sparkles className="text-indigo-600" size={32} />
          </div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
            {title}
          </h2>
          <p className="mt-3 text-center text-sm text-gray-500 max-w-sm">
            {subtitle}
          </p>
        </div>
        {children}
      </div>
    </div>
  );
};
