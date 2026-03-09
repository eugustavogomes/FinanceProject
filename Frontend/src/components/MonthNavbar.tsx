const months = ['All', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface Props {
  selected: number | 'all';
  onChange: (m: number | 'all') => void;
}

export default function MonthNavbar({ selected, onChange }: Props) {
  return (
    <div className="flex gap-2 p-2 border border-gray-300 rounded-md justify-center bg-white">
      {months.map((m, i) => {
        const value: number | 'all' = i === 0 ? 'all' : i - 1;
        const active = selected === value;
        return (
          <button
            key={m}
            onClick={() => onChange(value)}
            className={`px-3 rounded-md ${active ? 'bg-green-600 text-white' : 'text-gray-400 px-4 py-0 hover:bg-gray-100'}`}
          >
            {m}
          </button>
        );
      })}
    </div>
  );
}
