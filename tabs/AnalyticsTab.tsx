import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, Legend 
} from 'recharts';
import { BarChart3, Filter, Coins, Leaf, TrendingUp, ShieldCheck } from 'lucide-react';

export const AnalyticsTab: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState<'7' | '30' | '90'>('7');

  // Interactive mock dataset based on filter
  const salesDataMap = {
    '7': [
      { day: 'Mon', purchased: 180, sold: 165, demand: 170 },
      { day: 'Tue', purchased: 190, sold: 175, demand: 180 },
      { day: 'Wed', purchased: 210, sold: 195, demand: 200 },
      { day: 'Thu', purchased: 200, sold: 185, demand: 190 },
      { day: 'Fri', purchased: 240, sold: 230, demand: 235 },
      { day: 'Sat', purchased: 280, sold: 275, demand: 280 },
      { day: 'Sun', purchased: 310, sold: 295, demand: 300 },
    ],
    '30': [
      { day: 'Week 1', purchased: 1200, sold: 1120, demand: 1150 },
      { day: 'Week 2', purchased: 1350, sold: 1280, demand: 1300 },
      { day: 'Week 3', purchased: 1400, sold: 1360, demand: 1380 },
      { day: 'Week 4', purchased: 1550, sold: 1490, demand: 1500 },
    ],
    '90': [
      { day: 'Month 1', purchased: 4800, sold: 4500, demand: 4600 },
      { day: 'Month 2', purchased: 5200, sold: 4950, demand: 5000 },
      { day: 'Month 3', purchased: 5800, sold: 5600, demand: 5650 },
    ]
  };

  const wasteDiversionMap = {
    '7': [
      { name: 'Sold Fresh', value: 1520, color: '#16A34A' },
      { name: 'Redistributed', value: 120, color: '#3B82F6' },
      { name: 'Donated', value: 65, color: '#A855F7' },
      { name: 'Compost', value: 45, color: '#F59E0B' },
      { name: 'Biogas', value: 30, color: '#10B981' },
      { name: 'Unavoidable Waste', value: 15, color: '#EF4444' },
    ],
    '30': [
      { name: 'Sold Fresh', value: 5250, color: '#16A34A' },
      { name: 'Redistributed', value: 480, color: '#3B82F6' },
      { name: 'Donated', value: 240, color: '#A855F7' },
      { name: 'Compost', value: 180, color: '#F59E0B' },
      { name: 'Biogas', value: 110, color: '#10B981' },
      { name: 'Unavoidable Waste', value: 60, color: '#EF4444' },
    ],
    '90': [
      { name: 'Sold Fresh', value: 15050, color: '#16A34A' },
      { name: 'Redistributed', value: 1400, color: '#3B82F6' },
      { name: 'Donated', value: 720, color: '#A855F7' },
      { name: 'Compost', value: 550, color: '#F59E0B' },
      { name: 'Biogas', value: 380, color: '#10B981' },
      { name: 'Unavoidable Waste', value: 190, color: '#EF4444' },
    ]
  };

  const moneySavedDataMap = {
    '7': [
      { period: 'Mon', saved: 520 },
      { period: 'Tue', saved: 610 },
      { period: 'Wed', saved: 740 },
      { period: 'Thu', saved: 680 },
      { period: 'Fri', saved: 890 },
      { period: 'Sat', saved: 1120 },
      { period: 'Sun', saved: 1250 },
    ],
    '30': [
      { period: 'W1', saved: 3200 },
      { period: 'W2', saved: 4100 },
      { period: 'W3', saved: 4600 },
      { period: 'W4', saved: 5400 },
    ],
    '90': [
      { period: 'M1', saved: 12400 },
      { period: 'M2', saved: 15800 },
      { period: 'M3', saved: 19200 },
    ]
  };

  const currentSalesData = salesDataMap[timeFilter];
  const currentWasteData = wasteDiversionMap[timeFilter];
  const currentMoneyData = moneySavedDataMap[timeFilter];

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Sustainability & Financial Intelligence</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Analytics & Performance Reports</h2>
          <p className="text-sm text-slate-500 mt-1">
            Track sales accuracy, food waste prevention trends, and recovered financial capital.
          </p>
        </div>

        {/* Time Filters */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 self-start md:self-auto">
          {(['7', '30', '90'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`
                px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer
                ${timeFilter === filter 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'text-slate-600 hover:text-slate-900'}
              `}
            >
              {filter === '7' && '7 DAYS'}
              {filter === '30' && '30 DAYS'}
              {filter === '90' && '90 DAYS'}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Purchase vs Sales Line Chart */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Food Purchased vs Sold (kg)</h3>
              <p className="text-xs text-slate-400">Demand matching efficiency over time</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              94.2% Match
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={currentSalesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="purchased" name="Purchased Stock" stroke="#94A3B8" strokeWidth={2} />
                <Line type="monotone" dataKey="sold" name="Food Sold" stroke="#16A34A" strokeWidth={3} />
                <Line type="monotone" dataKey="demand" name="Predicted Demand" stroke="#F59E0B" strokeWidth={2} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Waste Diversion Donut Chart */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Waste Recovery Stream Breakdown</h3>
              <p className="text-xs text-slate-400">Distribution across zero-waste channels</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              95% Diversion
            </span>
          </div>

          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={currentWasteData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {currentWasteData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cumulative Money Saved Area Chart */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Money Saved via AI (₹ INR)</h3>
              <p className="text-xs text-slate-400">Prevented losses & dynamic markdowns</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              +18.4% WoW
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentMoneyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="period" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="saved" name="Rupees Saved (₹)" stroke="#10B981" fill="#DCFCE7" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Product Sales & Recovery Efficiency Bar Chart */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Top Produce Sales Velocity</h3>
              <p className="text-xs text-slate-400">Comparing total demand vs stock</p>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Tomato', stock: 100, demand: 65 },
                { name: 'Potato', stock: 70, demand: 60 },
                { name: 'Onion', stock: 55, demand: 50 },
                { name: 'Banana', stock: 40, demand: 15 },
                { name: 'Apple', stock: 35, demand: 30 },
                { name: 'Mango', stock: 25, demand: 22 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="stock" name="Current Stock (kg)" fill="#94A3B8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="demand" name="Predicted Demand (kg)" fill="#16A34A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
