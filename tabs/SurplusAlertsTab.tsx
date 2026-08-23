import React from 'react';
import { ProductItem } from '../types';
import { AlertTriangle, ShieldAlert, Tag, Package, Store, HeartHandshake, Recycle, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';

interface SurplusAlertsTabProps {
  products: ProductItem[];
  showToast: (msg: string) => void;
  onNavigate: (tab: string) => void;
}

export const SurplusAlertsTab: React.FC<SurplusAlertsTabProps> = ({
  products,
  showToast,
  onNavigate
}) => {
  const surplusProducts = products.filter(p => p.stock > p.predictedDemand || p.risk === 'HIGH' || p.risk === 'MEDIUM');

  const riskStyles = {
    HIGH: {
      border: 'border-rose-200 bg-rose-50/30',
      badge: 'bg-rose-100 text-rose-800 border-rose-300',
      icon: 'text-rose-600',
    },
    MEDIUM: {
      border: 'border-amber-200 bg-amber-50/30',
      badge: 'bg-amber-100 text-amber-800 border-amber-300',
      icon: 'text-amber-600',
    },
    LOW: {
      border: 'border-emerald-200 bg-emerald-50/30',
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      icon: 'text-emerald-600',
    }
  };

  const handleAction = (productName: string, actionType: string) => {
    showToast(`✓ Action recorded for ${productName}: ${actionType}`);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Early Surplus Detection Active</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Surplus Alerts & Early Mitigation</h2>
          <p className="text-sm text-slate-500 mt-1">
            Identify food likely to remain unsold BEFORE it spoils and route it to high-value recovery channels.
          </p>
        </div>
      </div>

      {/* Grid of Surplus Product Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {surplusProducts.map((p) => {
          const surplusKg = Math.max(p.stock - p.predictedDemand, 0);
          const style = riskStyles[p.risk];

          return (
            <div 
              key={p.id} 
              className={`bg-white rounded-3xl p-6 border ${style.border} shadow-sm space-y-5 transition-all hover:shadow-md`}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{p.emoji}</span>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{p.name}</h3>
                    <p className="text-xs text-slate-500">Current Stock: {p.stock} kg • Predicted Demand: {p.predictedDemand} kg</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${style.badge}`}>
                  Risk: {p.risk}
                </span>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-3 text-center bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-[11px] text-slate-500 block">Surplus Predicted</span>
                  <span className="text-base font-black text-rose-600">{surplusKg > 0 ? `${surplusKg} kg` : '12 kg'}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block">Freshness</span>
                  <span className="text-base font-bold text-slate-800">{p.freshnessPct}%</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block">Shelf Life</span>
                  <span className="text-base font-bold text-slate-800">{p.shelfLifeDays} day{p.shelfLifeDays > 1 ? 's' : ''}</span>
                </div>
              </div>

              {/* Recommended Action Buttons */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                  Recommended AI Mitigation Actions:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <button
                    onClick={() => {
                      handleAction(p.name, '15% Discount');
                      onNavigate('pricing');
                    }}
                    className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Apply 15% Discount</span>
                  </button>

                  <button
                    onClick={() => {
                      handleAction(p.name, 'Combo Bundle');
                      onNavigate('pricing');
                    }}
                    className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Package className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Create Bundle</span>
                  </button>

                  <button
                    onClick={() => {
                      handleAction(p.name, 'Sell to Nearby Vendor');
                      onNavigate('marketplace');
                    }}
                    className="p-2.5 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Store className="w-3.5 h-3.5 text-blue-600" />
                    <span>Nearby Vendor</span>
                  </button>

                  <button
                    onClick={() => {
                      handleAction(p.name, 'Sell to Restaurant');
                      onNavigate('marketplace');
                    }}
                    className="p-2.5 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Store className="w-3.5 h-3.5 text-blue-600" />
                    <span>Restaurant / Canteen</span>
                  </button>

                  <button
                    onClick={() => handleAction(p.name, 'Donated to NGO')}
                    className="p-2.5 rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <HeartHandshake className="w-3.5 h-3.5 text-purple-600" />
                    <span>Donate to NGO</span>
                  </button>

                  <button
                    onClick={() => {
                      handleAction(p.name, 'Sent to Compost / Biogas');
                      onNavigate('waste');
                    }}
                    className="p-2.5 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Recycle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Compost / Biogas</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
