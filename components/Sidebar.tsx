import React from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Package, 
  AlertTriangle, 
  Tag, 
  Store, 
  Recycle, 
  BarChart3, 
  Leaf,
  X,
  ShoppingBag,
  ShoppingCart
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  cartCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  mobileOpen,
  setMobileOpen,
  cartCount = 0
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'vegetable-store', label: 'Vegetable Store', icon: Store },
    { id: 'cart', label: 'Cart', icon: ShoppingCart, badge: cartCount > 0 ? String(cartCount) : undefined, isCartBadge: true },
    { id: 'prediction', label: 'Demand Prediction', icon: TrendingUp },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'surplus', label: 'Surplus Alerts', icon: AlertTriangle, badge: 'High Risk' },
    { id: 'pricing', label: 'Smart Pricing', icon: Tag },
    { id: 'marketplace', label: 'Surplus Marketplace', icon: ShoppingBag },
    { id: 'waste', label: 'Waste-to-Value', icon: Recycle },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-300 ease-in-out
        lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div>
          {/* Logo Header */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
                <Leaf className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-bold text-slate-900 leading-none text-lg">SmartMarket <span className="text-emerald-600">AI</span></h1>
                <p className="text-[10px] font-medium text-emerald-700 tracking-wider uppercase mt-1">Sell Smarter. Waste Less.</p>
              </div>
            </div>
            <button 
              onClick={() => setMobileOpen(false)}
              className="lg:hidden text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-160px)]">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id || (item.id === 'vegetable-store' && currentTab === 'selling');
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentTab(item.id);
                    window.location.hash = item.id;
                    setMobileOpen(false);
                  }}
                  className={`
                    w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                    ${isActive 
                      ? 'bg-emerald-50 text-emerald-700 font-semibold shadow-xs' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.isCartBadge 
                        ? 'bg-emerald-600 text-white shadow-sm' 
                        : 'bg-rose-100 text-rose-700'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Badge */}
        <div className="p-4 border-t border-slate-100">
          <div className="bg-emerald-950 text-emerald-100 p-3.5 rounded-xl text-xs space-y-2 border border-emerald-800/40">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              <span className="font-semibold text-emerald-300">AI Engine Active</span>
            </div>
            <p className="text-[11px] text-emerald-200/80 leading-relaxed">
              Vegetable Store Buying & Selling Engine synced with SQLite.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
