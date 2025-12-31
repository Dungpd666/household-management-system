import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Card } from '../../ui/Card';
import type { HouseholdSizeDistributionData } from '../../../utils/dashboardStats';
import { ChartTooltip } from './ChartTooltip';

const formatAvg = (n: number) => {
  if (!Number.isFinite(n)) return '0.0';
  return n.toFixed(1);
};

export const HouseholdSizeDistributionCard = ({ data }: { data: HouseholdSizeDistributionData }) => {
  return (
    <Card
      padding
      rounded="2xl"
      className="bg-white/80 backdrop-blur border border-border transition-transform duration-300 hover:-translate-y-0.5"
      header={
        <div className="flex items-center justify-between w-full">
          <div>
            <div className="text-[12px] font-semibold uppercase tracking-wide text-textc-secondary">Quy mô hộ</div>
            <div className="mt-1 text-[13px] text-textc-secondary">TB: {formatAvg(data.avgSize)} người/hộ</div>
          </div>
        </div>
      }
    >
      <div className="h-[180px] text-textc-secondary">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.distribution} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'currentColor', fontSize: 12 }}
              interval={0}
            />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: 'currentColor', fontSize: 12 }} width={28} />
            <Tooltip
              cursor={{ fill: 'rgba(148,163,184,0.10)' }}
              content={({ active, payload, label }) => (
                <ChartTooltip
                  active={active}
                  label={String(label ?? '')}
                  payload={payload as any}
                  labelFormatter={(l) => l}
                />
              )}
            />

            <Bar
              dataKey="value"
              name="Số hộ"
              fill="currentColor"
              className="text-emerald-600"
              radius={[12, 12, 12, 12]}
              isAnimationActive
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 text-[12px] text-textc-faint">Rê chuột để xem chi tiết</div>
    </Card>
  );
};
