import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'blue' | 'amber' | 'red' | 'subtle' | 'green' | 'gray';
  children: ReactNode;
  size?: 'sm' | 'md';
  full?: boolean;
}

const variantClasses: Record<string, string> = {
  primary: 'bg-brand-primary text-slate-900 hover:bg-brand-primaryHover shadow-card rounded-full',
  blue: 'text-brand-purple hover:text-brand-purple/80',
  amber: 'text-amber-600 hover:text-amber-700',
  red: 'text-red-600 hover:text-red-700',
  green: 'text-emerald-600 hover:text-emerald-700',
  subtle: 'text-textc-secondary hover:text-textc-primary',
  gray: 'text-textc-primary bg-white border border-border hover:bg-surface-muted hover:shadow-card rounded-full',
};

export const Button = ({ variant = 'primary', size = 'md', full, className = '', children, ...rest }: ButtonProps) => {
  const sizeMap = {
    sm: 'text-[11px] px-3 py-1.5',
    md: 'text-[13px] px-4 py-2.5',
  };
  const base = `inline-flex items-center justify-center font-medium tracking-wide transition-all cursor-pointer ${sizeMap[size]} ${full ? 'w-full' : ''}`;
  return (
    <button className={`${base} ${variantClasses[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
};