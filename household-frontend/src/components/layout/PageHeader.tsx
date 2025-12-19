import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export const PageHeader = ({ title, subtitle, actions }: PageHeaderProps) => {
  return (
    <div className="mb-6 flex items-center justify-between gap-4">
      <div>
        <p className="text-[13px] uppercase tracking-[0.16em] text-textc-faint mb-1">Dashboard overview</p>
        <h1 className="text-[26px] md:text-[30px] font-semibold text-textc-primary leading-tight">{title}</h1>
        {subtitle && <p className="text-sm md:text-[15px] text-textc-secondary mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex-shrink-0 flex items-center gap-3">{actions}</div>}
    </div>
  );
};
