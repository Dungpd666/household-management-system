import type { ReactNode } from 'react';

export interface Column<T> {
  key: string;
  header: string;
  className?: string;
  width?: string;
  render?: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowKey?: (row: T) => string | number;
  emptyText?: string;
}

export function DataTable<T>({ columns, data, rowKey, emptyText = 'Không có dữ liệu' }: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b border-border bg-surface-subtle/60">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`font-medium text-textc-primary text-[12px] uppercase tracking-[0.12em] px-4 py-3 ${col.className || ''}`}
                style={col.width ? { width: col.width } : undefined}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-4 py-6 text-center text-textc-faint">
                {emptyText}
              </td>
            </tr>
          )}
          {data.map((row, idx) => (
            <tr
              key={rowKey ? rowKey(row) : idx}
              className={`border-b border-border last:border-0 transition-colors bg-white hover:bg-surface-muted`}
            >
              {columns.map((col) => (
                <td key={col.key} className={`px-4 py-3 ${col.className || ''}`}>
                  {col.render ? col.render(row) : (row as any)[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const Avatar = ({ name }: { name: string }) => {
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="w-9 h-9 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center text-xs font-semibold">
      {initials}
    </div>
  );
};

export const StatusBadge = ({ label, tone }: { label: string; tone?: 'green' | 'yellow' | 'red' | 'gray' }) => {
  const base = 'inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border';
  const map: Record<string, string> = {
    green: 'bg-brand-primary/10 text-emerald-700 border-emerald-200',
    yellow: 'bg-amber-50 text-amber-700 border-amber-200',
    red: 'bg-brand-red/10 text-rose-600 border-rose-200',
    gray: 'bg-surface-muted text-textc-secondary border-border',
  };
  return <span className={`${base} ${map[tone || 'gray']}`}>{label}</span>;
};
