import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'blue' | 'amber' | 'red' | 'subtle' | 'green' | 'gray';
  children: ReactNode;
  size?: 'sm' | 'md';
  full?: boolean;
}

const variantClasses: Record<string, string> = {
  primary: 'bg-brand-primary text-slate-900 hover:bg-brand-primaryHover hover:shadow-lg hover:-translate-y-0.5 rounded-full',
  blue: 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 rounded-full',
  amber: 'bg-amber-500 text-white hover:bg-amber-600 hover:shadow-lg hover:-translate-y-0.5 rounded-full',
  red: 'bg-red-600 text-white hover:bg-red-700 hover:shadow-lg hover:-translate-y-0.5 rounded-full',
  green: 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-lg hover:-translate-y-0.5 rounded-full',
  subtle: 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:shadow-md hover:-translate-y-0.5 rounded-full',
  gray: 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 hover:shadow-lg hover:-translate-y-0.5 rounded-full',
};

export const Button = ({ variant = 'primary', size = 'md', full, className = '', children, ...rest }: ButtonProps) => {
  const sizeMap = {
    sm: 'text-[11px] px-3 py-1.5',
    md: 'text-[13px] px-4 py-2.5',
  };
  const base = `hms-btn inline-flex items-center justify-center font-medium tracking-wide transition-all cursor-pointer ${sizeMap[size]} ${full ? 'w-full' : ''}`;
  return (
    <button data-variant={variant} className={`${base} ${variantClasses[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
};