import type { ReactNode } from 'react';

type PayloadEntry = {
  name?: string;
  value?: number;
  payload?: Record<string, any>;
};

interface ChartTooltipProps {
  active?: boolean;
  label?: string;
  payload?: PayloadEntry[];
  valueFormatter?: (value: number) => string;
  labelFormatter?: (label: string) => string;
  rightSlot?: ReactNode;
}

export const ChartTooltip = ({
  active,
  label,
  payload,
  valueFormatter = (v) => String(v),
  labelFormatter = (l) => l,
  rightSlot,
}: ChartTooltipProps) => {
  if (!active || !payload || payload.length === 0) return null;

  const items = payload
    .filter((p) => typeof p?.value === 'number')
    .map((p) => ({ name: p.name ?? '—', value: p.value as number }));

  if (items.length === 0) return null;

  return (
    <div className="rounded-2xl border border-border bg-white/90 backdrop-blur px-3 py-2 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          {label != null && (
            <div className="text-[12px] font-semibold text-textc-secondary">
              {labelFormatter(label)}
            </div>
          )}
          <div className="mt-1 space-y-1">
            {items.map((it) => (
              <div key={it.name} className="flex items-center justify-between gap-6 text-[13px]">
                <div className="text-textc-secondary">{it.name}</div>
                <div className="font-semibold text-textc-primary">{valueFormatter(it.value)}</div>
              </div>
            ))}
          </div>
        </div>
        {rightSlot}
      </div>
    </div>
  );
};
