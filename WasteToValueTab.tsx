import React, { useState } from 'react';
import { WasteStreamData } from '../types';
import { Recycle, Zap, HeartHandshake, Trash2, ArrowDown, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

interface WasteToValueTabProps {
  wasteData: WasteStreamData;
  onUpdateWaste: (data: Partial<WasteStreamData>) => void;
  showToast: (msg: string) => void;
}

export const WasteToValueTab: React.FC<WasteToValueTabProps> = ({
  wasteData,
  onUpdateWaste,
  showToast
}) => {
  const totalOrganicWaste = wasteData.redistributedKg + wasteData.donatedKg + wasteData.compostKg + wasteData.biogasKg + wasteData.disposalKg;
  const divertedFromWaste = wasteData.redistributedKg + wasteData.donatedKg + wasteData.compostKg + wasteData.biogasKg;
  const diversionRatePct = Math.round((divertedFromWaste / (totalOrganicWaste || 1)) * 100);

  const handleAllocateCompost = () => {
    onUpdateWaste({ compostKg: wasteData.compostKg + 5, disposalKg: Math.max(wasteData.disposalKg - 2, 0) });
    showToast('✓ Allocated 5 kg surplus to Organic Composting!');
  };

  const handleAllocateBiogas = () => {
    onUpdateWaste({ biogasKg: wasteData.biogasKg + 5, disposalKg: Math.max(wasteData.disposalKg - 2, 0) });
    showToast('✓ Allocated 5 kg wet organic waste to Biogas Energy Facility!');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <span className="inline-block text-xs font-bold text-emerald-300 uppercase tracking-widest bg-emerald-800/60 px-3 py-1 rounded-full">
            Zero Landfill Strategy
          </span>
          <h2 className="text-2xl sm:text-3xl font-black">“Food doesn't have to become waste.”</h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            Cascading recovery framework ensuring every kilogram of unsold produce finds highest-value economic or environmental reuse.
          </p>
        </div>
      </div>

      {/* Visual Recovery Cascading Pipeline */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <h3 className="text-lg font-bold text-slate-900 text-center">Cascading Recovery Pipeline</h3>

        <div className="max-w-xl mx-auto space-y-3 text-center text-xs font-bold">
          <div className="bg-slate-900 text-white py-3 px-6 rounded-2xl shadow-md">
            UNSOLD FOOD (Total: {totalOrganicWaste} kg)
          </div>
          <ArrowDown className="w-5 h-5 mx-auto text-emerald-600 animate-bounce" />

          <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 py-3 px-6 rounded-2xl">
            REDISTRIBUTION (Marketplace / Nearby Vendors) — <strong>{wasteData.redistributedKg} kg</strong>
          </div>
          <ArrowDown className="w-5 h-5 mx-auto text-emerald-600" />

          <div className="bg-purple-50 border border-purple-200 text-purple-900 py-3 px-6 rounded-2xl">
            DONATION (NGOs / Feeding Programs) — <strong>{wasteData.donatedKg} kg</strong>
          </div>
          <ArrowDown className="w-5 h-5 mx-auto text-emerald-600" />

          <div className="bg-amber-50 border border-amber-200 text-amber-900 py-3 px-6 rounded-2xl">
            COMPOST & BIOGAS (Soil Nutrient & Renewable Energy) — <strong>{wasteData.compostKg + wasteData.biogasKg} kg</strong>
          </div>
          <ArrowDown className="w-5 h-5 mx-auto text-emerald-600" />

          <div className="bg-rose-50 border border-rose-200 text-rose-800 py-2.5 px-6 rounded-2xl text-[11px]">
            FINAL DISPOSAL (Unavoidable Residual Waste) — <strong>{wasteData.disposalKg} kg</strong>
          </div>
        </div>
      </div>

      {/* Diversion Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-center space-y-2">
          <span className="text-xs font-semibold text-slate-500 block uppercase">TOTAL ORGANIC WASTE</span>
          <span className="text-3xl font-black text-slate-900 block">{totalOrganicWaste} kg</span>
          <span className="text-[11px] text-slate-400">Total surplus tracked</span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-center space-y-2">
          <span className="text-xs font-semibold text-emerald-700 block uppercase">DIVERTED FROM LANDFILL</span>
          <span className="text-3xl font-black text-emerald-600 block">{divertedFromWaste} kg</span>
          <span className="text-[11px] text-emerald-600 font-medium">Prevented methane emissions</span>
        </div>

        {/* Circular Progress Display */}
        <div className="bg-emerald-900 text-white rounded-3xl p-6 shadow-md flex items-center justify-around">
          <div className="space-y-1">
            <span className="text-xs font-bold text-emerald-300 block uppercase">DIVERSION RATE</span>
            <span className="text-4xl font-black text-white block">{diversionRatePct}%</span>
            <span className="text-[11px] text-emerald-200">Target: &gt;90%</span>
          </div>

          {/* SVG Circular Ring */}
          <div className="relative w-20 h-20">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-emerald-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-emerald-400"
                strokeDasharray={`${diversionRatePct}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">
              {diversionRatePct}%
            </div>
          </div>
        </div>
      </div>

      {/* 3 Main Recovery Stream Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Compost */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-2xl font-bold">
                ♻️
              </div>
              <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                Soil Nutrient
              </span>
            </div>

            <div>
              <h4 className="text-xl font-black text-slate-900">Organic Compost</h4>
              <p className="text-xs text-slate-500 mt-1">Suitable dry vegetable trimmings and peels.</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
              <div className="flex justify-between text-xs text-slate-600">
                <span>Diverted:</span>
                <strong className="text-slate-900">{wasteData.compostKg} kg</strong>
              </div>
              <div className="flex justify-between text-xs text-slate-600">
                <span>Compost Yield:</span>
                <strong className="text-emerald-700">~{Math.round(wasteData.compostKg * 0.4)} kg rich soil</strong>
              </div>
            </div>
          </div>

          <button
            onClick={handleAllocateCompost}
            className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
          >
            + Assign 5 kg to Compost
          </button>
        </div>

        {/* Biogas */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center text-2xl font-bold">
                ⚡
              </div>
              <span className="text-xs font-bold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                Clean Energy
              </span>
            </div>

            <div>
              <h4 className="text-xl font-black text-slate-900">Biogas Energy</h4>
              <p className="text-xs text-slate-500 mt-1">Suitable wet organic fruit pulp and overripe waste.</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
              <div className="flex justify-between text-xs text-slate-600">
                <span>Diverted:</span>
                <strong className="text-slate-900">{wasteData.biogasKg} kg</strong>
              </div>
              <div className="flex justify-between text-xs text-slate-600">
                <span>Energy Yield:</span>
                <strong className="text-blue-700">~{(wasteData.biogasKg * 0.6).toFixed(1)} kWh power</strong>
              </div>
            </div>
          </div>

          <button
            onClick={handleAllocateBiogas}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
          >
            + Assign 5 kg to Biogas
          </button>
        </div>

        {/* Final Disposal */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center text-2xl font-bold">
                🗑️
              </div>
              <span className="text-xs font-bold text-rose-800 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                Minimized
              </span>
            </div>

            <div>
              <h4 className="text-xl font-black text-slate-900">Residual Disposal</h4>
              <p className="text-xs text-slate-500 mt-1">Non-recyclable inorganic packaging & spoiled remnants.</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
              <div className="flex justify-between text-xs text-slate-600">
                <span>Residual Landfill:</span>
                <strong className="text-rose-600">{wasteData.disposalKg} kg</strong>
              </div>
              <div className="flex justify-between text-xs text-slate-600">
                <span>Loss Ratio:</span>
                <strong className="text-slate-700">{(100 - diversionRatePct)}% of total</strong>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-center text-xs font-bold text-emerald-800">
            Targeting Zero Landfill Waste
          </div>
        </div>
      </div>
    </div>
  );
};
