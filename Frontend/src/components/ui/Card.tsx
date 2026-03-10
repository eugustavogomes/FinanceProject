import type { ReactNode } from 'react';

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className }: CardProps) {
  return (
    <div className={`bg-white dark:bg-gray-800 text-card-foreground border border-gray-100 dark:border-gray-700 rounded-lg shadow-sm ${className ?? ''}`}>
      {children}
    </div>
  );
}
