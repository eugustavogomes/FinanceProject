type Variant = 'error' | 'success';

const styles: Record<Variant, string> = {
  error: 'border border-red-400/60 bg-red-500/10 text-red-200',
  success: 'border border-emerald-400/60 bg-emerald-500/10 text-emerald-200',
};

interface AuthMessageProps {
  variant: Variant;
  children: React.ReactNode;
  className?: string;
}

export function AuthMessage({ variant, children, className = '' }: AuthMessageProps) {
  if (!children) return null;
  return (
    <div className={`text-xs px-3 py-2 text-center rounded-md ${styles[variant]} ${className}`}>
      {children}
    </div>
  );
}
