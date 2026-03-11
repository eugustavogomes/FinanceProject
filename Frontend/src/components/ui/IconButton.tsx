import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type IconButtonVariant = 'default' | 'danger';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: IconButtonVariant;
  children: ReactNode;
}

const baseClasses =
  'inline-flex items-center justify-center h-9 w-9 shadow-sm rounded-full transition focus:outline-none focus:ring-2 focus:ring-emerald-200';

const variantClasses: Record<IconButtonVariant, string> = {
  default:
    'border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
  danger:
    'border border-red-200 dark:border-red-500/60 bg-red-50 dark:bg-red-900/30 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/60',
};

export function IconButton({ variant = 'default', className = '', children, ...props }: IconButtonProps) {
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
