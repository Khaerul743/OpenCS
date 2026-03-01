import React, { InputHTMLAttributes } from 'react';

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string | string[];
  label: string;
}

export const AuthInput: React.FC<AuthInputProps> = ({ error, label, ...props }) => {
  // Extract error string if it's an array
  const errorMessage = Array.isArray(error) ? error[0] : error;

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm outline-none ${
          error ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
        } disabled:bg-gray-100 disabled:cursor-not-allowed`}
        {...props}
      />
      {errorMessage && <p className="text-xs text-red-500 mt-1">{errorMessage}</p>}
    </div>
  );
};
