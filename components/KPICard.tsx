import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  subtitle: string;
  badgeColor?: 'green' | 'amber' | 'rose' | 'emerald' | 'blue';
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  unit,
  icon: Icon,
  trend,
  trendUp,
  subtitle,
  badgeColor = 'green'
}) => {
  const colorMap = {
    green: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    emerald: 'bg-emerald-600 text-white border-emerald-600',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</span>
          <div className={`p-2.5 rounded-xl border ${colorMap[badgeColor]}`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5 mb-1">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{value}</span>
          {unit && <span className="text-sm font-semibold text-slate-500">{unit}</span>}
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-500 font-medium">{subtitle}</span>
        {trend && (
          <span className={`font-bold ${trendUp ? 'text-emerald-600' : 'text-rose-500'}`}>
            {trend}
          </span>
        )}
      </div>
    </div>
  );
};
