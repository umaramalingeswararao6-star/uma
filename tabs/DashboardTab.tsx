import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Tag, 
  Package, 
  Share2, 
  HeartHandshake, 
  ArrowRight,
  TrendingUp,
  Brain,
  ShieldAlert
} from 'lucide-react';
import { KPICard } from '../components/KPICard';
import { ProductItem, KPIState } from '../types';
import { 
  PackageCheck, 
  IndianRupee, 
  TrendingDown, 
  Scale, 
  ShieldCheck, 
  Coins, 
  Leaf 
} from 'lucide-react';

interface DashboardTabProps {
  products: ProductItem[];
  kpis: KPIState;
  onPredictClick: () => void;
  isPredicting: boolean;
  predictionDone: boolean;
  predictionStepText: string;
  onNavigate: (tab: string) => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  products,
  kpis,
  onPredictClick,
  isPredicting,
  predictionDone,
  predictionStepText,
  onNavigate
}) => {
  const tomato = products.find(p => p.id === 'tomato') || products[0];

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl space-y-3">
            <div className="inline-flex items-center gap-2 bg-emerald-700/60 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-semibold text-emerald-200">
              <Brain className="w-3.5 h-3.5 text-emerald-300" />
              <span>AI Sustainability Engine Active</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Sell Smarter. Waste Less.
            </h2>
            <p className="text-sm text-emerald-100/90 leading-relaxed">
              Predict customer demand with Indian market factors, optimize ordering quantities, and convert surplus produce into value before it spoils.
            </p>
          </div>
          <button
            onClick={onPredictClick}
            disabled={isPredicting}
            className="self-start md:self-center px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 font-bold text-slate-950 text-sm shadow-lg shadow-emerald-500/30 transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-slate-950 animate-bounce" />
            <span>{isPredicting ? 'Running Engine...' : 'Run Predict Tomorrow'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <KPICard
          title="Current Inventory"
          value={kpis.currentInventoryKg}
          unit="kg"
          icon={PackageCheck}
          subtitle="Total stock across 6 items"
          trend="Balanced"
          badgeColor="blue"
        />
        <KPICard
          title="Today's Sales"
          value={`₹${kpis.todaySalesRupees.toLocaleString('en-IN')}`}
          icon={IndianRupee}
          subtitle="Estimated total gross"
          trend="↑ 8.4% vs yesterday"
          trendUp={true}
          badgeColor="green"
        />
        <KPICard
          title="Tomorrow's Demand"
          value={kpis.tomorrowDemandKg}
          unit="kg"
          icon={TrendingUp}
          subtitle="AI predicted customer demand"
          trend="↑ 12% weekend spike"
          trendUp={true}
          badgeColor="amber"
        />
        <KPICard
          title="Expected Surplus"
          value={kpis.expectedSurplusKg}
          unit="kg"
          icon={Scale}
          subtitle="At risk of overstock"
          trend={kpis.expectedSurplusKg > 0 ? "⚠️ High Risk" : "Low Risk"}
          trendUp={false}
          badgeColor="rose"
        />
        <KPICard
          title="Expected Shortage"
          value={kpis.expectedShortageKg}
          unit="kg"
          icon={TrendingDown}
          subtitle="Understock potential"
          trend="Managed"
          badgeColor="blue"
        />
        <KPICard
          title="Money Saved"
          value={`₹${kpis.moneySavedRupees.toLocaleString('en-IN')}`}
          icon={Coins}
          subtitle="Prevented loss & discounts"
          trend="↑ ₹850 today"
          trendUp={true}
          badgeColor="emerald"
        />
        <KPICard
          title="Food Waste Avoided"
          value={kpis.wasteAvoidedKg}
          unit="kg"
          icon={Leaf}
          subtitle="Saved from landfill"
          trend="91% diversion rate"
          trendUp={true}
          badgeColor="green"
        />
        <KPICard
          title="Surplus Transactions"
          value={kpis.surplusTransactions}
          unit="orders"
          icon={ShieldCheck}
          subtitle="Redistributed & sold"
          trend="Active"
          badgeColor="emerald"
        />
      </div>

      {/* AI FORECAST CENTER */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative">
        <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Brain className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">AI FORECAST CENTER</h3>
              <p className="text-xs text-slate-500">Local predictive model with Indian market indicators</p>
            </div>
          </div>
          {predictionDone && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              AI FORECAST COMPLETE ✓
            </span>
          )}
        </div>

        {isPredicting ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
            <p className="text-base font-semibold text-emerald-800 animate-pulse">{predictionStepText}</p>
            <p className="text-xs text-slate-400">Evaluating local weather, weekend sales velocity, and shelf life...</p>
          </div>
        ) : !predictionDone ? (
          <div className="py-8 text-center space-y-4">
            <p className="text-slate-600 text-sm font-medium">
              Run <strong className="text-emerald-700">Predict Tomorrow</strong> to generate the latest demand forecast and surplus risk analysis.
            </p>
            <button
              onClick={onPredictClick}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md transition-all duration-150 inline-flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Forecast Now</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
              <span className="text-xs text-slate-500 font-medium block mb-1">Tomorrow's Demand</span>
              <span className="text-xl font-extrabold text-slate-900">{kpis.tomorrowDemandKg} kg</span>
            </div>
            <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100 text-center">
              <span className="text-xs text-rose-600 font-medium block mb-1">Expected Surplus</span>
              <span className="text-xl font-extrabold text-rose-700">{kpis.expectedSurplusKg} kg</span>
            </div>
            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 text-center">
              <span className="text-xs text-blue-600 font-medium block mb-1">Expected Shortage</span>
              <span className="text-xl font-extrabold text-blue-700">{kpis.expectedShortageKg} kg</span>
            </div>
            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 text-center">
              <span className="text-xs text-emerald-700 font-medium block mb-1">Recommended Purchase</span>
              <span className="text-xl font-extrabold text-emerald-800">157 kg</span>
            </div>
            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 text-center">
              <span className="text-xs text-amber-700 font-medium block mb-1">Recommended Discount</span>
              <span className="text-xl font-extrabold text-amber-800">15%</span>
            </div>
            <div className="bg-emerald-100 p-4 rounded-2xl border border-emerald-200 text-center">
              <span className="text-xs text-emerald-800 font-semibold block mb-1">Waste Avoided</span>
              <span className="text-xl font-extrabold text-emerald-900">{kpis.wasteAvoidedKg} kg</span>
            </div>
          </div>
        )}
      </div>

      {/* MAIN HACKATHON DEMO SCENARIO */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden border border-emerald-800/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-5 mb-6 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-rose-500/20 text-rose-300 border border-rose-500/40 px-3 py-1 rounded-full text-xs font-bold mb-2">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>MAIN HACKATHON DEMO SCENARIO</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold">Tomato Overstock & Prevention Workflow</h3>
          </div>
          <div className="flex items-center gap-3 bg-slate-800/80 px-4 py-2 rounded-xl text-xs border border-slate-700">
            <span>Tomato Current Stock: <strong>{tomato.stock} kg</strong></span>
            <span>•</span>
            <span>Predicted Demand: <strong>{tomato.predictedDemand} kg</strong></span>
          </div>
        </div>

        {/* Surplus Warning Banner */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 mb-8 flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0" />
          <div>
            <h4 className="font-bold text-amber-300 text-sm sm:text-base">⚠️ 35 KG SURPLUS RISK DETECTED</h4>
            <p className="text-xs text-amber-200/80">Tomato stock exceeds predicted demand by 35 kg. Immediate AI mitigation plan generated.</p>
          </div>
        </div>

        {/* 3 Recommendation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="bg-slate-800/90 rounded-2xl p-5 border border-slate-700/80 hover:border-emerald-500/50 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xs">1</span>
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">Step 1</span>
            </div>
            <h5 className="font-bold text-base text-slate-100 flex items-center gap-2 mb-1">
              <Tag className="w-4 h-4 text-emerald-400" />
              DISCOUNT SALE
            </h5>
            <div className="text-2xl font-extrabold text-white mb-2">20 kg</div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Apply 15% discount to accelerate retail sell-through before freshness drops.
            </p>
            <button 
              onClick={() => onNavigate('pricing')}
              className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>Apply 15% Discount</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-slate-800/90 rounded-2xl p-5 border border-slate-700/80 hover:border-emerald-500/50 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xs">2</span>
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">Step 2</span>
            </div>
            <h5 className="font-bold text-base text-slate-100 flex items-center gap-2 mb-1">
              <Package className="w-4 h-4 text-emerald-400" />
              SMART BUNDLE
            </h5>
            <div className="text-2xl font-extrabold text-white mb-2">10 kg</div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Bundle with potatoes and onions into a "Rasam & Sambar Combo".
            </p>
            <button 
              onClick={() => onNavigate('pricing')}
              className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>Create Combo Bundle</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-slate-800/90 rounded-2xl p-5 border border-slate-700/80 hover:border-emerald-500/50 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xs">3</span>
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">Step 3</span>
            </div>
            <h5 className="font-bold text-base text-slate-100 flex items-center gap-2 mb-1">
              <Share2 className="w-4 h-4 text-emerald-400" />
              REDISTRIBUTE
            </h5>
            <div className="text-2xl font-extrabold text-white mb-2">5 kg</div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              List on Marketplace for nearby restaurants or Koyambedu vendors.
            </p>
            <button 
              onClick={() => onNavigate('marketplace')}
              className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>List on Marketplace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Visual Waste Prevention Flow Pipeline */}
        <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800 mb-6">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-4 text-center">
            Zero Waste Recovery Flow
          </span>
          <div className="flex flex-col sm:flex-row items-center justify-around gap-3 text-center">
            <div className="bg-rose-500/10 border border-rose-500/30 px-4 py-2 rounded-xl">
              <span className="text-xs text-rose-300 font-medium block">Starting Surplus</span>
              <span className="text-base font-extrabold text-rose-400">35 KG SURPLUS</span>
            </div>
            <span className="text-slate-500 font-bold hidden sm:inline">↓</span>
            <div className="bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-xl">
              <span className="text-xs text-emerald-300 font-medium block">Discount Sale</span>
              <span className="text-base font-bold text-emerald-400">20 KG DISCOUNT</span>
            </div>
            <span className="text-slate-500 font-bold hidden sm:inline">↓</span>
            <div className="bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-xl">
              <span className="text-xs text-emerald-300 font-medium block">Combo Bundle</span>
              <span className="text-base font-bold text-emerald-400">10 KG BUNDLE</span>
            </div>
            <span className="text-slate-500 font-bold hidden sm:inline">↓</span>
            <div className="bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-xl">
              <span className="text-xs text-emerald-300 font-medium block">Marketplace</span>
              <span className="text-base font-bold text-emerald-400">5 KG REDISTRIBUTE</span>
            </div>
            <span className="text-slate-500 font-bold hidden sm:inline">↓</span>
            <div className="bg-emerald-400 text-slate-950 font-extrabold px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-400/20">
              0 KG FOOD WASTE
            </div>
          </div>
        </div>

        {/* Success Banner */}
        <div className="bg-emerald-500/20 border border-emerald-400/40 rounded-2xl p-4 text-center">
          <p className="text-emerald-300 font-extrabold text-sm sm:text-base flex items-center justify-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            AI prevented 35 kg of potential food waste.
          </p>
        </div>
      </div>

      {/* DASHBOARD IMPACT SECTION */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div>
          <h3 className="text-xl font-extrabold text-slate-900 mb-1">SMARTER MARKET IMPACT</h3>
          <p className="text-xs text-slate-500">Cumulative sustainability and revenue metrics</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100 text-center">
            <span className="text-3xl font-black text-emerald-700 block mb-1">47 kg</span>
            <span className="text-xs font-semibold text-slate-600">Food Waste Avoided</span>
          </div>
          <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100 text-center">
            <span className="text-3xl font-black text-emerald-700 block mb-1">₹4,280</span>
            <span className="text-xs font-semibold text-slate-600">Estimated Savings</span>
          </div>
          <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100 text-center">
            <span className="text-3xl font-black text-emerald-700 block mb-1">91%</span>
            <span className="text-xs font-semibold text-slate-600">Waste Diversion</span>
          </div>
          <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100 text-center">
            <span className="text-3xl font-black text-emerald-700 block mb-1">24</span>
            <span className="text-xs font-semibold text-slate-600">Surplus Transactions</span>
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center text-xs font-medium text-slate-700 leading-relaxed">
          Predict demand <span className="text-emerald-600 font-bold">→</span> Purchase smarter <span className="text-emerald-600 font-bold">→</span> Sell more <span className="text-emerald-600 font-bold">→</span> Detect surplus early <span className="text-emerald-600 font-bold">→</span> Redistribute food <span className="text-emerald-600 font-bold">→</span> Convert waste into value.
        </div>
      </div>
    </div>
  );
};
