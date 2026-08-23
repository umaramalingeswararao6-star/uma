import React, { useState } from 'react';
import { ProductItem } from '../types';
import { Sparkles, Brain, Info, CheckCircle2, TrendingUp, AlertTriangle, ShieldCheck } from 'lucide-react';

interface PredictionTabProps {
  products: ProductItem[];
  onPredictClick: () => void;
  isPredicting: boolean;
}

export const PredictionTab: React.FC<PredictionTabProps> = ({
  products,
  onPredictClick,
  isPredicting
}) => {
  const [selectedProduct, setSelectedProduct] = useState<ProductItem>(products[0]);

  const riskBadgeMap = {
    LOW: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    MEDIUM: 'bg-amber-100 text-amber-800 border-amber-200',
    HIGH: 'bg-rose-100 text-rose-800 border-rose-200',
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
            <Brain className="w-3.5 h-3.5" />
            <span>Demand Forecasting Model</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">AI Product Demand Predictions</h2>
          <p className="text-sm text-slate-500 mt-1">
            Simulated forecast factoring in historical velocity, weather trends, shelf life, and regional demand patterns.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onPredictClick}
            disabled={isPredicting}
            className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isPredicting ? 'Recalculating...' : 'RUN AI PREDICTION'}</span>
          </button>
        </div>
      </div>

      {/* Simulated AI Explanation Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 flex items-start gap-4">
        <div className="p-2 bg-emerald-600 text-white rounded-xl shrink-0">
          <Info className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-emerald-900 text-sm">AI Explanation & Insight Factor</h4>
          <p className="text-xs text-emerald-800 leading-relaxed">
            “Demand increased because tomorrow is a weekend, summer temperature is rising sales for hydration/fresh items, and recent 3-day market velocity is trending upward by +14%.”
          </p>
          <span className="inline-block text-[10px] font-bold tracking-wider text-emerald-600 uppercase pt-1">
            SIMULATED AI FORECAST • DEMO DATA
          </span>
        </div>
      </div>

      {/* Product Cards / Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-lg">Product Demand Forecast Table</h3>
          <span className="text-xs text-slate-500">Click a product row to view detailed AI factor analysis</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-semibold text-xs uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Current Stock</th>
                <th className="px-6 py-4">Previous Sales</th>
                <th className="px-6 py-4">Predicted Demand</th>
                <th className="px-6 py-4">Recommended Purchase</th>
                <th className="px-6 py-4">Confidence</th>
                <th className="px-6 py-4">Risk Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {products.map((item) => {
                const recPurchase = Math.max(item.predictedDemand - item.stock, 0);
                const isSelected = selectedProduct.id === item.id;
                return (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedProduct(item)}
                    className={`
                      cursor-pointer transition-colors hover:bg-slate-50
                      ${isSelected ? 'bg-emerald-50/60 font-semibold' : ''}
                    `}
                  >
                    <td className="px-6 py-4 flex items-center gap-3">
                      <span className="text-2xl">{item.emoji}</span>
                      <div>
                        <span className="font-bold text-slate-900 block">{item.name}</span>
                        <span className="text-[11px] text-slate-400">{item.category}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-900">{item.stock} kg</td>
                    <td className="px-6 py-4 text-slate-600">{item.prevSales} kg</td>
                    <td className="px-6 py-4">
                      <span className="font-extrabold text-emerald-700">{item.predictedDemand} kg</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-800">{recPurchase} kg</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-emerald-600 h-full rounded-full" style={{ width: '91%' }}></div>
                        </div>
                        <span className="text-xs font-bold text-slate-700">91%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${riskBadgeMap[item.risk]}`}>
                        {item.risk}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Product Breakdown Detail */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{selectedProduct.emoji}</span>
            <div>
              <h3 className="text-xl font-bold text-slate-900">{selectedProduct.name} AI Factor Breakdown</h3>
              <p className="text-xs text-slate-500">Specific environmental & contextual drivers for this item</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${riskBadgeMap[selectedProduct.risk]}`}>
            {selectedProduct.risk} RISK
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <span className="text-xs text-slate-500 font-medium block">Weather</span>
            <span className="text-sm font-bold text-slate-800 mt-1 block">Sunny (32°C)</span>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <span className="text-xs text-slate-500 font-medium block">Day Type</span>
            <span className="text-sm font-bold text-slate-800 mt-1 block">Sunday Weekend</span>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <span className="text-xs text-slate-500 font-medium block">Festival Factor</span>
            <span className="text-sm font-bold text-slate-800 mt-1 block">Local Market Festival</span>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <span className="text-xs text-slate-500 font-medium block">Season</span>
            <span className="text-sm font-bold text-slate-800 mt-1 block">Summer Season</span>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <span className="text-xs text-slate-500 font-medium block">Shelf Life</span>
            <span className="text-sm font-bold text-slate-800 mt-1 block">{selectedProduct.shelfLifeDays} Days</span>
          </div>
        </div>

        <div className="bg-slate-900 text-white p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">AI Calculation Formula</span>
            <p className="text-xs text-slate-300 font-mono">
              predictedDemand = recentAvg({selectedProduct.prevSales}) + weekendAdj(+10%) + seasonalAdj(+5%) - currentStock({selectedProduct.stock})
            </p>
          </div>
          <div className="text-right shrink-0">
            <span className="text-xs text-slate-400 block">Calculated Net Need</span>
            <span className="text-xl font-black text-emerald-400">
              {Math.max(selectedProduct.predictedDemand - selectedProduct.stock, 0)} kg
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
