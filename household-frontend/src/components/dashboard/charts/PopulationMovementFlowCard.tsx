import { Card } from '../../ui/Card';
import type { PopulationMovementData } from '../../../utils/dashboardStats';

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

const formatSigned = (n: number) => {
  const sign = n > 0 ? '+' : '';
  return `${sign}${n.toLocaleString()}`;
};

export const PopulationMovementFlowCard = ({
  data,
  currentPopulation,
}: {
  data: PopulationMovementData;
  currentPopulation?: number;
}) => {
  const inflowTotal = (data.inflow.birth ?? 0) + (data.inflow.moveIn ?? 0);
  const outflowTotal = (data.outflow.death ?? 0) + (data.outflow.moveOut ?? 0);
  const net = inflowTotal - outflowTotal;

  const max = Math.max(1, inflowTotal, outflowTotal);
  const w = (v: number) => clamp((v / max) * 18, 5, 18);

  const badgeCls = net >= 0 ? 'badge-green' : 'badge-red';

  return (
    <Card
      padding
      rounded="2xl"
      className="bg-white/80 backdrop-blur border border-border transition-transform duration-300 hover:-translate-y-0.5"
      header={
        <div className="flex items-center justify-between w-full">
          <div>
            <div className="text-[12px] font-semibold uppercase tracking-wide text-textc-secondary">Movement Flow</div>
            <div className="mt-1 text-[13px] text-textc-secondary">Inflow → Current → Outflow</div>
          </div>
          <div className={badgeCls}>Net {formatSigned(net)}</div>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-[140px,1fr,140px] gap-4 items-center">
        <div className="space-y-2 text-sm">
          <div className="text-[12px] font-semibold uppercase tracking-wide text-textc-secondary">Inflow</div>
          <div className="flex items-center justify-between">
            <span className="text-textc-secondary">Birth</span>
            <span className="font-semibold text-textc-primary">{(data.inflow.birth ?? 0).toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-textc-secondary">Move in</span>
            <span className="font-semibold text-textc-primary">{(data.inflow.moveIn ?? 0).toLocaleString()}</span>
          </div>
        </div>

        <div className="relative h-[180px]">
          <svg viewBox="0 0 520 180" className="h-full w-full">
            <defs>
              <linearGradient id="flowIn" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="rgb(20 184 166)" stopOpacity="0.35" />
                <stop offset="100%" stopColor="rgb(56 189 248)" stopOpacity="0.85" />
              </linearGradient>
              <linearGradient id="flowOut" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="rgb(251 113 133)" stopOpacity="0.25" />
                <stop offset="100%" stopColor="rgb(148 163 184)" stopOpacity="0.75" />
              </linearGradient>
            </defs>

            {/* Nodes */}
            <rect x="26" y="54" width="86" height="72" rx="18" fill="rgba(241,245,249,0.9)" />
            <rect x="217" y="36" width="86" height="108" rx="22" fill="rgba(244,243,255,0.9)" />
            <rect x="408" y="54" width="86" height="72" rx="18" fill="rgba(241,245,249,0.9)" />

            {/* Links */}
            <path
              d={`M 112 72 C 165 72, 170 60, 217 60`}
              stroke="url(#flowIn)"
              strokeWidth={w(data.inflow.birth ?? 0)}
              fill="none"
              strokeLinecap="round"
            />
            <path
              d={`M 112 108 C 165 108, 170 120, 217 120`}
              stroke="url(#flowIn)"
              strokeWidth={w(data.inflow.moveIn ?? 0)}
              fill="none"
              strokeLinecap="round"
            />

            <path
              d={`M 303 60 C 350 60, 355 72, 408 72`}
              stroke="url(#flowOut)"
              strokeWidth={w(data.outflow.death ?? 0)}
              fill="none"
              strokeLinecap="round"
            />
            <path
              d={`M 303 120 C 350 120, 355 108, 408 108`}
              stroke="url(#flowOut)"
              strokeWidth={w(data.outflow.moveOut ?? 0)}
              fill="none"
              strokeLinecap="round"
            />

            {/* Labels */}
            <text x="69" y="96" textAnchor="middle" className="fill-current text-textc-secondary" fontSize="12">
              In
            </text>
            <text x="260" y="82" textAnchor="middle" className="fill-current text-textc-secondary" fontSize="12">
              Current
            </text>
            <text x="451" y="96" textAnchor="middle" className="fill-current text-textc-secondary" fontSize="12">
              Out
            </text>
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-[28px] leading-none font-semibold text-textc-primary">
                {(currentPopulation ?? 0).toLocaleString()}
              </div>
              <div className="mt-1 text-[12px] text-textc-secondary">Current population</div>
            </div>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="text-[12px] font-semibold uppercase tracking-wide text-textc-secondary">Outflow</div>
          <div className="flex items-center justify-between">
            <span className="text-textc-secondary">Death</span>
            <span className="font-semibold text-textc-primary">{(data.outflow.death ?? 0).toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-textc-secondary">Move out</span>
            <span className="font-semibold text-textc-primary">{(data.outflow.moveOut ?? 0).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
