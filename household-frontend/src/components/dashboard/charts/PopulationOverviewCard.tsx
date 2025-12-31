import { useMemo } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Card } from '../../ui/Card';
import type { PopulationOverviewData } from '../../../utils/dashboardStats';
import { ChartTooltip } from './ChartTooltip';

const formatPercent = (value: number) => `${Math.round(value * 100)}%`;

export const PopulationOverviewCard = ({ data }: { data: PopulationOverviewData }) => {
  const donutData = useMemo(
    () => [
      { key: 'permanent', name: 'Thường trú', value: data.byStatus.permanent, className: 'text-teal-500' },
      { key: 'temporary', name: 'Tạm trú', value: data.byStatus.temporary, className: 'text-emerald-400' },
      { key: 'absent', name: 'Tạm vắng', value: data.byStatus.absent, className: 'text-slate-300' },
    ],
    [data.byStatus],
  );

  const total = data.totalPersons || 0;

  return (
    <Card
      padding
      rounded="2xl"
      className="bg-white/80 backdrop-blur border border-border transition-transform duration-300 hover:-translate-y-0.5"
      header={
        <div className="flex items-center justify-between w-full">
          <div>
            <div className="text-[12px] font-semibold uppercase tracking-wide text-textc-secondary">Tổng quan dân số</div>
            <div className="mt-1 text-[13px] text-textc-secondary">Phân loại theo tình trạng</div>
          </div>
        </div>
      }
    >
      <div className="grid grid-cols-[45%_55%] gap-4 items-center">
        <div className="space-y-3">
          {donutData.map((item) => {
            const percent = total > 0 ? item.value / total : 0;
            return (
              <div key={item.key} className="flex items-center justify-between gap-4 text-sm">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`inline-block h-2.5 w-2.5 rounded-full ${item.className}`}
                    style={{ backgroundColor: 'currentColor' }}
                  />
                  <span className="text-textc-secondary truncate">{item.name}</span>
                </div>
                <div className="text-right font-semibold text-textc-primary tabular-nums whitespace-nowrap">
                  {item.value.toLocaleString()}{' '}
                  <span className="text-[12px] font-medium text-textc-faint">({formatPercent(percent)})</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-center">
          <div className="relative h-[180px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <defs>
                  <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="rgba(15,23,42,0.10)" />
                  </filter>
                </defs>
                <Pie
                  data={donutData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={58}
                  outerRadius={74}
                  paddingAngle={2}
                  stroke="rgba(255,255,255,0.9)"
                  strokeWidth={2}
                  filter="url(#softGlow)"
                >
                  {donutData.map((entry) => (
                    <Cell key={entry.key} fill="currentColor" className={entry.className} />
                  ))}
                </Pie>

                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload || payload.length === 0) return null;
                    const p: any = payload[0];
                    const value = typeof p.value === 'number' ? p.value : 0;
                    const percent = total > 0 ? value / total : 0;
                    return (
                      <ChartTooltip
                        active
                        label={p?.name ?? '—'}
                        payload={[{ name: 'Số lượng', value }]}
                        rightSlot={
                          <div className="text-[12px] font-semibold text-textc-secondary">{formatPercent(percent)}</div>
                        }
                      />
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <div className="text-[26px] leading-none font-semibold text-textc-primary">{total.toLocaleString()}</div>
                <div className="mt-1 text-[12px] text-textc-secondary">Tổng nhân khẩu</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
