import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Card } from '../../ui/Card';
import type { AgeStructureData } from '../../../utils/dashboardStats';
import { ChartTooltip } from './ChartTooltip';

const formatRatio = (ratio: number) => {
  if (!Number.isFinite(ratio)) return '0%';
  return `${Math.round(ratio * 100)}%`;
};

export const AgeStructureCard = ({ data }: { data: AgeStructureData }) => {
  return (
    <Card
      padding
      rounded="2xl"
      className="bg-white/80 backdrop-blur border border-border transition-transform duration-300 hover:-translate-y-0.5"
      header={
        <div className="flex items-center justify-between w-full">
          <div>
            <div className="text-[12px] font-semibold uppercase tracking-wide text-textc-secondary">Cơ cấu độ tuổi</div>
            <div className="mt-1 text-[13px] text-textc-secondary">Phân bổ theo giới tính</div>
          </div>
          <div className="badge-yellow">
            Tỷ lệ phụ thuộc {formatRatio(data.dependencyRatio)}
          </div>
        </div>
      }
    >
      <div className="h-[180px] text-textc-secondary">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.ageGroups} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <XAxis
              dataKey="range"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'currentColor', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'currentColor', fontSize: 12 }}
              width={28}
            />
            <Tooltip
              cursor={{ fill: 'rgba(148,163,184,0.10)' }}
              content={({ active, payload, label }) => (
                <ChartTooltip
                  active={active}
                  label={String(label ?? '')}
                  payload={payload as any}
                  labelFormatter={(l) => `Nhóm tuổi ${l}`}
                />
              )}
            />

            <Bar
              dataKey="male"
              name="Nam"
              stackId="a"
              fill="currentColor"
              className="text-teal-500"
              radius={[10, 10, 0, 0]}
              isAnimationActive
            />
            <Bar
              dataKey="female"
              name="Nữ"
              stackId="a"
              fill="currentColor"
              className="text-teal-500"
              fillOpacity={0.35}
              radius={[10, 10, 0, 0]}
              isAnimationActive
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 flex items-center gap-4 text-[12px] text-textc-secondary">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-teal-500" />
          <span>Nam</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-teal-500/40" />
          <span>Nữ</span>
        </div>
      </div>
    </Card>
  );
};
