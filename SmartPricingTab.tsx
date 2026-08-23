import React, { useState } from 'react';
import { ProductItem } from '../types';
import { Tag, Sparkles, Sliders, CheckCircle2, TrendingUp, Zap, HelpCircle } from 'lucide-react';

interface SmartPricingTabProps {
  products: ProductItem[];
  showToast: (msg: string) => void;
}

export const SmartPricingTab: React.FC<SmartPricingTabProps> = ({
  products,
  showToast
}) => {
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0].id);
  const [discountPercent, setDiscountPercent] = useState<number>(15);

  const selectedProduct = products.find(p => p.id === selectedProductId) || products[0];
  const expectedSurplus = Math.max(selectedProduct.stock - selectedProduct.predictedDemand, 12);

  // Dynamic pricing calculations
  const originalPrice = selectedProduct.unitPrice;
  const discountedPrice = Math.round(originalPrice * (1 - discountPercent / 100));
  const expectedSalesUpliftPct = Math.min(discountPercent * 2.2, 85);
  const estimatedRevenueRecovered = Math.round(expectedSurplus * discountedPrice);

  const handleApplyDiscount = () => {
    showToast(`✓ ${discountPercent}% ${selectedProduct.name} discount activated!`);
  };

  const handleCreateBundle = () => {
    showToast(`✓ Smart Combo Bundle created for ${selectedProduct.name}!`);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
            <Tag className="w-3.5 h-3.5" />
            <span>Dynamic Pricing Engine</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">AI Smart Discount & Pricing</h2>
          <p className="text-sm text-slate-500 mt-1">
            Recommend optimal markdown rates to maximize sell-through velocity before shelf life expires.
          </p>
        </div>
      </div>

      {/* Product Selector Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {products.map((p) => {
          const isSelected = p.id === selectedProductId;
          return (
            <button
              key={p.id}
              onClick={() => setSelectedProductId(p.id)}
              className={`
                p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between
                ${isSelected 
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-600/20 scale-[1.02]' 
                  : 'bg-white text-slate-800 border-slate-200 hover:border-emerald-300'}
              `}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{p.emoji}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isSelected ? 'bg-emerald-700 text-emerald-100' : 'bg-slate-100 text-slate-600'}`}>
                  {p.stock} kg
                </span>
              </div>
              <div>
                <span className="font-bold text-sm block">{p.name}</span>
                <span className={`text-xs ${isSelected ? 'text-emerald-100' : 'text-slate-500'}`}>
                  ₹{p.unitPrice}/kg
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Pricing Breakdown Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-6 gap-4">
          <div className="flex items-center gap-4">
            <span className="text-5xl">{selectedProduct.emoji}</span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-black text-slate-900">{selectedProduct.name}</h3>
                <span className="bg-amber-100 text-amber-800 text-xs font-extrabold px-3 py-1 rounded-full border border-amber-200">
                  {expectedSurplus} kg Surplus Risk
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Current Stock: {selectedProduct.stock} kg • Predicted Demand: {selectedProduct.predictedDemand} kg • Freshness: {selectedProduct.freshnessPct}%
              </p>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 px-6 py-3 rounded-2xl text-center">
            <span className="text-xs text-emerald-800 font-semibold block">Recommended Discount</span>
            <span className="text-3xl font-black text-emerald-600">{discountPercent}% OFF</span>
          </div>
        </div>

        {/* AI Insight Box */}
        <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 flex items-start gap-4">
          <div className="p-2 bg-emerald-500 text-slate-950 rounded-xl font-bold shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-emerald-400 text-sm">AI Pricing Rationale</h4>
            <p className="text-xs text-slate-300 leading-relaxed mt-1">
              “{expectedSurplus} kg of {selectedProduct.name.toLowerCase()}s may remain unsold before evening. A moderate {discountPercent}% discount can accelerate retail sell-through by +{Math.round(expectedSalesUpliftPct)}% and recover approximately ₹{estimatedRevenueRecovered.toLocaleString('en-IN')} in revenue.”
            </p>
          </div>
        </div>

        {/* Interactive Discount Slider */}
        <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between">
            <label className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-600" />
              <span>Adjust Discount Rate:</span>
            </label>
            <span className="text-lg font-black text-emerald-700">{discountPercent}%</span>
          </div>
          <input
            type="range"
            min="5"
            max="50"
            step="5"
            value={discountPercent}
            onChange={(e) => setDiscountPercent(Number(e.target.value))}
            className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
          <div className="flex justify-between text-xs font-semibold text-slate-400">
            <span>5% (Low)</span>
            <span>15% (Recommended)</span>
            <span>30% (Aggressive)</span>
            <span>50% (Clearance)</span>
          </div>
        </div>

        {/* Impact Calculations Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <span className="text-xs text-slate-500 font-medium block mb-1">Original Price</span>
            <span className="text-lg font-extrabold text-slate-700 line-through">₹{originalPrice}/kg</span>
          </div>
          <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
            <span className="text-xs text-emerald-700 font-medium block mb-1">Discounted Price</span>
            <span className="text-xl font-black text-emerald-700">₹{discountedPrice}/kg</span>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <span className="text-xs text-slate-500 font-medium block mb-1">Expected Sales Uplift</span>
            <span className="text-lg font-bold text-emerald-600">+{Math.round(expectedSalesUpliftPct)}%</span>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <span className="text-xs text-slate-500 font-medium block mb-1">Estimated Revenue Recovered</span>
            <span className="text-lg font-extrabold text-slate-900">₹{estimatedRevenueRecovered.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-slate-100">
          <button
            onClick={handleApplyDiscount}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>APPLY {discountPercent}% DISCOUNT</span>
          </button>
          <button
            onClick={handleCreateBundle}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl border border-emerald-600 text-emerald-700 font-bold text-sm hover:bg-emerald-50 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>CREATE COMBO BUNDLE</span>
          </button>
          <button
            onClick={() => showToast('Discount recommendation dismissed.')}
            className="w-full sm:w-auto px-6 py-3.5 text-slate-400 hover:text-slate-600 text-xs font-semibold"
          >
            IGNORE
          </button>
        </div>
      </div>
    </div>
  );
};
