
interface Props {
  selected: number | 'all';
  onChange: (m: number | 'all') => void;
}

export default function MonthNavbar({ selected, onChange }: Props) {

  const months = ['All', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-xs md:hidden">
        <select
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none"
          value={selected === 'all' ? 'all' : String(selected)}
          onChange={(e) => {
            const value = e.target.value === 'all' ? 'all' : Number(e.target.value);
            onChange(value as any);
          }}
        >
          {months.map((m, i) => {
            const value: number | 'all' = i === 0 ? 'all' : i - 1;
            return (
              <option key={m} value={value === 'all' ? 'all' : String(value)}>
                {m === 'All' ? 'All months' : m}
              </option>
            );
          })}
        </select>
      </div>

      <div className="hidden md:flex gap-2 p-2 border border-gray-300 dark:border-gray-600 rounded-md justify-center bg-white dark:bg-gray-800">
        {months.map((m, i) => {
          const value: number | 'all' = i === 0 ? 'all' : i - 1;
          const active = selected === value;
          return (
            <button
              key={m}
              onClick={() => onChange(value)}
              className={`px-3 rounded-md text-sm ${active ? 'bg-green-600 text-white' : 'text-gray-500 dark:text-gray-300 px-4 py-0 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              {m}
            </button>
          );
        })}
      </div>
    </div>
  );
}
