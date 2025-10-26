import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

export function Pill ({ children }: PropsWithChildren) {
  return (
    <span className="inline-flex items-center rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-300">
      {children}
    </span>
  );
}

export function Button ({ variant = 'primary', className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' }) {
  const base = variant === 'primary'
    ? 'rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400'
    : 'rounded-md border border-slate-600 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-800';
  return <button className={`${base} ${className}`} {...props} />;
}
