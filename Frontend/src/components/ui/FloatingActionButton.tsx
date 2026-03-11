import type { ButtonHTMLAttributes, ReactNode } from 'react';

export interface FloatingActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
}

const baseClasses =
  'fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-green-600 text-white shadow-xl flex items-center justify-center text-3xl hover:bg-green-500 transition focus:outline-none focus:ring-2 focus:ring-emerald-300';

export function FloatingActionButton({ children = '+', className = '', ...props }: FloatingActionButtonProps) {
  return (
    <button className={`${baseClasses} ${className}`} {...props}>
      {children}
    </button>
  );
}
