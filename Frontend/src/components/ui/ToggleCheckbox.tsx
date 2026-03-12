interface ToggleCheckboxProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  className?: string;
}

export function ToggleCheckbox({ checked, onChange, label, className = '' }: ToggleCheckboxProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex items-center gap-2 cursor-pointer select-none group ${className}`}
    >
      <span
        className={`relative inline-flex h-4 w-7 items-center rounded-full border transition-colors duration-200 ${
          checked
            ? 'border-emerald-400 bg-emerald-500/80'
            : 'border-gray-500/60 bg-transparent'
        }`}
      >
        <span
          className={`inline-block h-3 w-3 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${
            checked ? 'translate-x-3' : 'translate-x-0.5'
          }`}
        />
      </span>
      <span className="text-white group-hover:text-gray-100 transition-colors text-xs">{label}</span>
    </button>
  );
}
