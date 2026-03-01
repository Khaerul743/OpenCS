import { Loader2 } from 'lucide-react';
import React, { ButtonHTMLAttributes } from 'react';

interface AuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

export const AuthButton: React.FC<AuthButtonProps> = ({ children, isLoading, ...props }) => {
  return (
    <button
      className={`w-full flex justify-center items-center py-2.5 px-4 rounded-lg font-semibold text-white bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all shadow-sm
        ${isLoading || props.disabled ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5 hover:shadow-md hover:bg-indigo-700'}`}
      {...props}
      disabled={isLoading || props.disabled}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <Loader2 className="animate-spin" size={20} />
          Submitting...
        </span>
      ) : (
        children
      )}
    </button>
  );
};
