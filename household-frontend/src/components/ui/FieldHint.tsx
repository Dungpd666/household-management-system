import type { ReactNode } from 'react';

interface FieldHintProps {
  label: string;
  hint: string;
  children: ReactNode;
}

export const FieldHint = ({ label, hint, children }: FieldHintProps) => {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1 text-xs font-medium text-textc-secondary">
        <span>{label}</span>
        <div className="relative group inline-flex items-center cursor-help">
          <span className="w-4 h-4 rounded-full bg-slate-100 border border-slate-300 text-[10px] flex items-center justify-center text-slate-500 group-hover:bg-slate-800 group-hover:text-white transition">
            i
          </span>
          <div className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-150">
            <div className="max-w-xs rounded-lg bg-slate-900 text-white text-[11px] px-3 py-2 shadow-lg shadow-slate-900/40">
              {hint}
            </div>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
};
