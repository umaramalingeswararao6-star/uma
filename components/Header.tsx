import React from 'react';
import { Menu, Sparkles, MapPin, Bell } from 'lucide-react';

interface HeaderProps {
  onPredictClick: () => void;
  isPredicting: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onPredictClick,
  isPredicting,
  setMobileOpen
}) => {
  return (
    <header className="h-20 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 lg:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            Good evening, Vendor <span className="animate-bounce inline-block">👋</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 hidden sm:block">
            AI-powered insights to help you sell more and waste less.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <div className="hidden md:flex items-center gap-2 bg-slate-50 text-slate-600 px-3 py-1.5 rounded-lg border border-slate-200 text-xs">
          <MapPin className="w-4 h-4 text-emerald-600" />
          <span className="font-semibold">Koyambedu Market, Chennai</span>
        </div>

        <button
          onClick={onPredictClick}
          disabled={isPredicting}
          className={`
            flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white shadow-md shadow-emerald-600/25 transition-all duration-200
            ${isPredicting 
              ? 'bg-emerald-400 cursor-not-allowed' 
              : 'bg-emerald-600 hover:bg-emerald-700 hover:scale-[1.02] active:scale-[0.98]'}
          `}
        >
          <Sparkles className={`w-4 h-4 ${isPredicting ? 'animate-spin' : 'animate-pulse'}`} />
          <span>{isPredicting ? 'Predicting...' : '✨ Predict Tomorrow'}</span>
        </button>
      </div>
    </header>
  );
};

