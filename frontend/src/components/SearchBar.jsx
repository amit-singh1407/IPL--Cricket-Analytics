import { Filter, Search } from 'lucide-react';

export default function SearchBar({ theme, value, onChange, placeholder = 'Search...', filters = [], activeFilter, onFilterChange }) {
  const isDark = theme === 'dark';
  const inputClass = isDark
    ? 'border-white/10 bg-white/5 text-white placeholder:text-slate-500'
    : 'border-slate-200/80 bg-white text-slate-900 placeholder:text-slate-400';

  return (
    <div className="flex flex-col gap-3 rounded-[26px] border border-white/10 bg-white/5 p-4 shadow-soft md:flex-row md:items-center">
      <label className={`flex flex-1 items-center gap-3 rounded-2xl border px-4 py-3 text-sm ${inputClass}`}>
        <Search className="h-4 w-4 text-cyan-300" />
        <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="w-full bg-transparent outline-none" />
      </label>
      {filters.length ? (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <Filter className="h-4 w-4 text-cyan-300" />
          {filters.map((filter) => {
            const active = filter.value === activeFilter;
            return (
              <button
                key={filter.value}
                type="button"
                onClick={() => onFilterChange(filter.value)}
                className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm transition ${
                  active
                    ? 'border-cyan-400/40 bg-cyan-400/15 text-cyan-200'
                    : isDark
                      ? 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
