import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  header?: ReactNode;
  footer?: ReactNode;
  padding?: boolean;
  elevated?: boolean;
  headerGradient?: boolean;
  variant?: 'default' | 'subtle' | 'muted' | 'navy' | 'table';
  rounded?: 'xl' | 'lg' | 'md' | 'sm' | 'none' | 'top-none' | 'bottom-none';
}

export const Card = ({ children, className = '', header, footer, padding = true, elevated = true, headerGradient, variant = 'default', rounded = 'xl' }: CardProps) => {
  const bg = variant === 'subtle'
    ? 'bg-surface-subtle'
    : variant === 'muted'
      ? 'bg-surface-muted'
      : variant === 'navy'
        ? 'bg-[#111827] text-white'
        : variant === 'table'
          ? 'bg-white border border-[#E5E7EB]'
        : 'bg-white';
  const shadow = elevated ? 'shadow-card' : '';
  const roundedCls =
    rounded === 'none' ? 'rounded-none'
    : rounded === 'top-none' ? 'rounded-b-xl rounded-t-none'
    : rounded === 'bottom-none' ? 'rounded-t-xl rounded-b-none'
    : rounded === 'lg' ? 'rounded-lg'
    : rounded === 'md' ? 'rounded-md'
    : rounded === 'sm' ? 'rounded-sm'
    : 'rounded-xl';
  const base = `${bg} ${roundedCls} ${shadow}`;
  return (
    <div className={`${base} ${className}`}>
      {header && (
        <div
          className={`px-5 pt-5 pb-3 text-[13px] font-medium flex items-center justify-between ${variant === 'navy' ? 'text-white' : 'text-textc-primary'} ${headerGradient ? `card-header-gradient ${rounded === 'top-none' ? '' : 'rounded-t-xl'}` : ''}`}
        >
          {header}
        </div>
      )}
      <div className={padding ? 'px-5 pb-5 pt-4' : ''}>{children}</div>
      {footer && <div className={`px-5 pt-3 pb-5 text-xs ${variant === 'navy' ? 'text-white/80' : 'text-textc-secondary'}`}>{footer}</div>}
    </div>
  );
};
