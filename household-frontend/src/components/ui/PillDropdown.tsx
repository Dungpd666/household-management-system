import { useState } from 'react';

export interface PillOption {
  value: string;
  label: string;
  hint?: string;
}

interface PillDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: PillOption[];
  placeholder?: string;
  buttonClassName?: string;
  menuClassName?: string;
}

export const PillDropdown = ({ value, onChange, options, placeholder, buttonClassName, menuClassName }: PillDropdownProps) => {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);
  const displayLabel = selected?.label || placeholder || 'Chọn';
  const wantsFullWidth = !!buttonClassName && buttonClassName.includes('w-full');

  return (
    <div
      className={wantsFullWidth ? 'relative w-full text-left' : 'relative inline-block text-left'}
      tabIndex={0}
      onBlur={() => {
        setTimeout(() => setOpen(false), 120);
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={
          buttonClassName
            ? buttonClassName
            : 'flex items-center justify-between gap-2 border border-slate-200 rounded-full px-4 py-2.5 text-[13px] bg-white/90 shadow-inner focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary/40 cursor-pointer min-w-[190px]'
        }
      >
        <span className="truncate text-slate-700 text-[13px]">{displayLabel}</span>
        <span className="shrink-0 text-slate-400">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>

      {open && (
        <div
          className={
            menuClassName
              ? menuClassName
              : 'pill-menu absolute left-0 mt-2 w-full min-w-[220px] rounded-2xl bg-white shadow-lg shadow-slate-200 border border-slate-100 z-30'
          }
        >
          {options.map((opt) => {
            const isActive = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                className={`pill-menu-item w-full flex flex-col items-start px-4 py-2 text-left cursor-pointer transition-colors ${
                  isActive ? 'bg-slate-50 pill-menu-item--active' : 'hover:bg-slate-50'
                }`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange(opt.value);
                  setOpen(false);
                }}
              >
                <span className="text-[13px] font-medium text-slate-900">{opt.label}</span>
                {opt.hint && (
                  <span className="mt-0.5 text-[11px] text-slate-400 truncate max-w-full">{opt.hint}</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
