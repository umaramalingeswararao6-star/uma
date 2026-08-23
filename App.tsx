import React, { useState, useEffect } from 'react';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_MARKETPLACE, 
  ProductItem, 
  MarketplaceListing, 
  WasteStreamData,
  KPIState,
  CartItem 
} from './types';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import DashboardTab from "./DashboardTab";
import { PredictionTab } from './tabs/PredictionTab';
import { InventoryTab } from './tabs/InventoryTab';
import { SurplusAlertsTab } from './tabs/SurplusAlertsTab';
import { SmartPricingTab } from './tabs/SmartPricingTab';
import { MarketplaceTab } from './tabs/MarketplaceTab';
import { WasteToValueTab } from './tabs/WasteToValueTab';
import { AnalyticsTab } from './tabs/AnalyticsTab';
import { VegetableStoreTab } from './tabs/VegetableStoreTab';
import { CartTab } from './tabs/CartTab';
import { CheckoutTab } from './tabs/CheckoutTab';
import { 
  CheckCircle2, 
  ShoppingBag, 
  LogOut, 
  AlertTriangle,
  UserCheck,
  ShoppingCart,
  Store
} from 'lucide-react';

const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL;
  if (envUrl) {
    return envUrl.endsWith('/api') ? envUrl : `${envUrl.replace(/\/$/, '')}/api`;
  }
  if (typeof window !== 'undefined' && !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1')) {
    return "https://0c979cbae3fd65.lhr.life/api";
  }
  return "http://localhost:8001/api";
};

const API_BASE = getApiBaseUrl();

export function App() {
  // Safe Authentication State Initialization
  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem('smartmarket_token');
    } catch (e) {
      return null;
    }
  });

  const [user, setUser] = useState<any | null>(() => {
    try {
      const saved = localStorage.getItem('smartmarket_user');
      if (saved && saved !== 'undefined' && saved !== 'null') {
        return JSON.parse(saved);
      }
      return null;
    } catch (e) {
      return null;
    }
  });

  const [authView, setAuthView] = useState<'login' | 'register' | 'forgot'>('login');

  // Auth Form State
  const [email, setEmail] = useState('manager@smartmarket.ai');
  const [password, setPassword] = useState('managerpassword');
  const [authError, setAuthError] = useState('');
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);

  // Routing State
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  // Application Data State
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS);
  const [marketplace, setMarketplace] = useState<MarketplaceListing[]>(INITIAL_MARKETPLACE);
  const [wasteData, setWasteData] = useState<WasteStreamData>({
    redistributedKg: 15,
    donatedKg: 8,
    compostKg: 10,
    biogasKg: 7,
    disposalKg: 2
  });
  const [transactionsList, setTransactionsList] = useState<any[]>([]);

  // Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('smartmarket_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Sync Cart to LocalStorage
  useEffect(() => {
    localStorage.setItem('smartmarket_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Selected Date & Prediction State
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
  });
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictionDone, setPredictionDone] = useState(false);
  const [predictionStepText, setPredictionStepText] = useState('Analyzing sales history...');

  // Modals State
  const [showRecordTransactionModal, setShowRecordTransactionModal] = useState(false);
  const [txProductId, setTxProductId] = useState<number>(1);
  const [txQuantity, setTxQuantity] = useState<number>(5);
  const [txPrice, setTxPrice] = useState<number>(40);
  const [txSubmitting, setTxSubmitting] = useState(false);
  const [txError, setTxError] = useState('');

  const [showEditMarketModal, setShowEditMarketModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  // Toast System
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Verify session with /api/auth/me if token exists
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) return;
      try {
        const res = await fetch(`${API_BASE}/auth/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
          localStorage.setItem('smartmarket_user', JSON.stringify(userData));
        } else {
          setToken(null);
          setUser(null);
          localStorage.removeItem('smartmarket_token');
          localStorage.removeItem('smartmarket_user');
        }
      } catch (err) {
        console.error("Auth verification error:", err);
      }
    };
    verifyToken();
  }, [token]);

  // Fetch Data from FastAPI Backend
  const fetchBackendData = async () => {
    try {
      const [prodRes, mktRes, txRes] = await Promise.all([
        fetch(`${API_BASE}/products`),
        fetch(`${API_BASE}/marketplace`),
        fetch(`${API_BASE}/transactions`)
      ]);
      const prodData = await prodRes.json();
      const mktData = await mktRes.json();
      const txData = await txRes.json();

      if (Array.isArray(txData)) setTransactionsList(txData);

      if (Array.isArray(prodData)) {
        setProducts(prodData.map(p => ({
          id: String(p.id),
          name: p.name,
          emoji: p.emoji || '📦',
          stock: p.current_stock,
          unitPrice: p.price_per_kg,
          purchasePrice: p.purchase_price_per_kg || Math.round(p.price_per_kg * 0.7),
          salesToday: p.todays_sales,
          prevSales: p.previous_sales?.[0] || 60,
          predictedDemand: Math.round(p.todays_sales * 0.9) + 5,
          shelfLifeDays: p.shelf_life_days,
          freshnessPct: p.freshness,
          status: p.freshness < 75 ? 'Critical' : p.freshness < 85 ? 'Aging' : 'Fresh',
          risk: (p.current_stock - (Math.round(p.todays_sales * 0.9) + 5)) > 15 ? 'HIGH' : 'LOW',
          category: (p.category || 'Vegetables') as any
        })));
      }

      if (Array.isArray(mktData)) {
        setMarketplace(mktData.map(m => ({
          id: String(m.id),
          productName: m.product_name,
          emoji: m.emoji || '📦',
          quantityKg: m.quantity,
          freshnessPct: m.freshness,
          originalPrice: m.original_price,
          discountedPrice: m.discounted_price,
          pickupLocation: m.pickup_location,
          suitableBuyer: m.suitable_buyer || 'Restaurants',
          sellerName: m.seller_name || 'Koyambedu Vendor',
          timeRemainingHours: m.time_remaining_hours || 12
        })));
      }
    } catch (err) {
      console.error("Backend fetch error:", err);
    }
  };

  useEffect(() => {
    fetchBackendData();
  }, []);

  // Hash Routing Sync (Supports /selling -> /vegetable-store redirect)
  useEffect(() => {
    const handleHashChange = () => {
      let hash = window.location.hash.replace('#', '');
      if (hash === 'selling') hash = 'vegetable-store';
      if (!user && (hash === 'checkout' || hash === 'vegetable-store')) return;

      if (['admin/dashboard', 'admin-dashboard', 'manager/dashboard', 'manager-dashboard', 'staff/dashboard', 'staff-dashboard', 'customer/dashboard', 'customer-dashboard'].includes(hash)) {
        setCurrentTab('dashboard');
      } else if (hash) {
        setCurrentTab(hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [user]);

  // Auth Login Handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsSubmittingAuth(true);

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.detail || 'Invalid credentials. Please try again.');
        setIsSubmittingAuth(false);
        return;
      }

      const authToken = data.token || data.access_token;
      if (!authToken) {
        setAuthError('Authentication token not returned by backend.');
        setIsSubmittingAuth(false);
        return;
      }

      setToken(authToken);
      localStorage.setItem('smartmarket_token', authToken);

      const meRes = await fetch(`${API_BASE}/auth/me`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });

      let authenticatedUser = data.user;
      if (meRes.ok) {
        authenticatedUser = await meRes.json();
      }

      setUser(authenticatedUser);
      localStorage.setItem('smartmarket_user', JSON.stringify(authenticatedUser));

      setCurrentTab('dashboard');
      window.location.hash = 'dashboard';
      setIsSubmittingAuth(false);

      showToast(`✓ Welcome ${authenticatedUser.name}! Signed in as ${authenticatedUser.role.toUpperCase()}`);
    } catch (err) {
      console.error("Login error:", err);
      setAuthError('Network error connecting to auth server.');
      setIsSubmittingAuth(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('smartmarket_token');
    localStorage.removeItem('smartmarket_user');
    window.location.hash = 'login';
  };

  const quickLogin = (userEmail: string, pass: string) => {
    setEmail(userEmail);
    setPassword(pass);
  };

  // Cart Operations (Distinguishes BUY vs SELL lines)
  const handleAddToCart = (product: ProductItem, quantityKg: number, type: 'buy' | 'sell') => {
    const itemPrice = type === 'buy' 
      ? (product.purchasePrice || Math.round(product.unitPrice * 0.7)) 
      : product.unitPrice;

    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => item.id === product.id && item.type === type);
      if (existingIndex > -1) {
        const updated = [...prev];
        const currentQty = updated[existingIndex].quantity;
        const newQty = type === 'sell' 
          ? Math.min(currentQty + quantityKg, product.stock)
          : currentQty + quantityKg;
        updated[existingIndex] = { ...updated[existingIndex], quantity: newQty };
        return updated;
      } else {
        return [...prev, {
          id: product.id,
          name: product.name,
          emoji: product.emoji,
          type,
          unitPrice: itemPrice,
          stock: product.stock,
          quantity: type === 'sell' ? Math.min(quantityKg, product.stock) : quantityKg,
          freshnessPct: product.freshnessPct,
          shelfLifeDays: product.shelfLifeDays
        }];
      }
    });

    showToast(`✓ Added ${quantityKg} kg of ${product.name} to Cart (${type.toUpperCase()})!`);
  };

  const handleUpdateCartQuantity = (id: string, type: 'buy' | 'sell', newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(id, type);
      return;
    }
    setCartItems(prev => prev.map(item => {
      if (item.id === id && item.type === type) {
        const clamped = type === 'sell' ? Math.min(newQty, item.stock) : newQty;
        return { ...item, quantity: clamped };
      }
      return item;
    }));
  };

  const handleRemoveCartItem = (id: string, type: 'buy' | 'sell') => {
    setCartItems(prev => prev.filter(item => !(item.id === id && item.type === type)));
    showToast('Item removed from cart.');
  };

  // Checkout Completion Handler:
  // - SELLING items -> POST /api/transactions
  // - BUYING items -> POST /api/purchases
  const handleCompleteCheckout = async (): Promise<boolean> => {
    if (!user) {
      showToast('Please sign in to complete checkout.');
      window.location.hash = 'login';
      return false;
    }

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      for (const item of cartItems) {
        if (item.type === 'sell') {
          // Sales transaction endpoint
          const payload = {
            product_id: Number(item.id),
            quantity_sold: Number(item.quantity),
            price_per_kg: Number(item.unitPrice)
          };
          const res = await fetch(`${API_BASE}/transactions`, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload)
          });
          if (!res.ok) {
            const errData = await res.json();
            showToast(`Error selling ${item.name}: ${errData.detail || 'Failed'}`);
            return false;
          }
        } else {
          // Purchase restock endpoint
          const payload = {
            product_id: Number(item.id),
            quantity_purchased: Number(item.quantity),
            price_per_kg: Number(item.unitPrice)
          };
          const res = await fetch(`${API_BASE}/purchases`, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload)
          });
          if (!res.ok) {
            const errData = await res.json();
            showToast(`Error purchasing ${item.name}: ${errData.detail || 'Failed'}`);
            return false;
          }
        }
      }

      // Refresh stock inventory from backend
      await fetchBackendData();
      // Clear cart
      setCartItems([]);
      showToast('✓ Payment Successful! Transactions recorded and inventory updated in SQLite.');
      return true;
    } catch (err) {
      console.error("Checkout process error:", err);
      showToast('Network error processing backend transactions.');
      return false;
    }
  };

  // Quick Modal Sale Handler
  const openRecordTransactionModal = (prodId: number = 1) => {
    setTxProductId(prodId);
    setTxQuantity(5);
    const p = products.find(prod => Number(prod.id) === prodId);
    if (p) setTxPrice(p.unitPrice);
    else setTxPrice(40);
    setTxError('');
    setShowRecordTransactionModal(true);
  };

  const handleCreateTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    setTxError('');
    setTxSubmitting(true);

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE}/transactions`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          product_id: Number(txProductId),
          quantity_sold: Number(txQuantity),
          price_per_kg: Number(txPrice)
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setTxError(typeof data.detail === 'string' ? data.detail : 'Transaction failed.');
        setTxSubmitting(false);
        return;
      }

      await fetchBackendData();
      setShowRecordTransactionModal(false);
      setTxSubmitting(false);
      showToast(`✓ Transaction #${data.id} recorded! Sold ${data.quantity_sold} kg of ${data.product_name} for ₹${data.total_amount}`);
    } catch (err) {
      setTxError('Network error connecting to backend.');
      setTxSubmitting(false);
    }
  };

  // AI Prediction Handler
  const handlePredictTomorrow = async () => {
    setIsPredicting(true);
    setPredictionDone(false);
    setPredictionStepText('Calculating AI demand forecast...');

    try {
      const res = await fetch(`${API_BASE}/predictions/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: selectedDate })
      });
      const data = await res.json();

      setTimeout(() => {
        setIsPredicting(false);
        setPredictionDone(true);
        if (data.predictions) {
          setProducts(prev => prev.map(p => {
            const pred = data.predictions.find((item: any) => String(item.product_id) === p.id || item.product === p.name);
            if (pred) {
              return { ...p, predictedDemand: pred.predicted_demand, risk: pred.risk };
            }
            return p;
          }));
        }
        showToast(`✨ AI Forecast Complete for ${selectedDate}!`);
      }, 500);
    } catch (err) {
      setIsPredicting(false);
      showToast('Unable to connect to prediction engine.');
    }
  };

  // Product Edit Handler
  const handleSaveProductEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      await fetch(`${API_BASE}/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          current_stock: Number(editingProduct.stock),
          todays_sales: Number(editingProduct.salesToday),
          price_per_kg: Number(editingProduct.unitPrice),
          purchase_price_per_kg: Number(editingProduct.purchasePrice),
          freshness: Number(editingProduct.freshnessPct),
          shelf_life_days: Number(editingProduct.shelfLifeDays)
        })
      });
      await fetchBackendData();
      setShowEditMarketModal(false);
      setEditingProduct(null);
      showToast('✓ Produce stock & pricing saved to SQLite database!');
    } catch (err) {
      showToast('Error saving product.');
    }
  };

  const handleUpdateStock = (id: string, newStock: number) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: newStock } : p));
  };

  const handleAddProduct = (item: ProductItem) => {
    setProducts(prev => [...prev, item]);
  };

  const handleAddListing = (item: MarketplaceListing) => {
    setMarketplace(prev => [item, ...prev]);
  };

  const handleRemoveListing = (id: string) => {
    setMarketplace(prev => prev.filter(l => l.id !== id));
  };

  const handleUpdateWaste = (data: Partial<WasteStreamData>) => {
    setWasteData(prev => ({ ...prev, ...data }));
  };

  // Render Login Page if unauthenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto text-white text-3xl font-bold shadow-lg shadow-emerald-600/30">
              🌱
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">SmartMarket AI</h2>
            <p className="text-xs text-slate-500 font-medium">Koyambedu Fresh Produce Demand & Inventory Engine</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-[11px] font-bold text-slate-500 block text-center uppercase tracking-wider">⚡ 1-Click Quick Demo Sign In</span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button type="button" onClick={() => quickLogin('vendor@smartmarket.ai', 'password123')} className="p-2.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold border border-emerald-300 transition-all text-left">
                🧑‍🌾 Staff Demo
              </button>
              <button type="button" onClick={() => quickLogin('manager@smartmarket.ai', 'managerpassword')} className="p-2.5 rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold border border-blue-300 transition-all text-left">
                👔 Manager Demo
              </button>
              <button type="button" onClick={() => quickLogin('admin@smartmarket.ai', 'adminpassword')} className="p-2.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold border border-purple-300 transition-all text-left">
                👑 Admin Demo
              </button>
              <button type="button" onClick={() => quickLogin('customer@smartmarket.ai', 'customerpassword')} className="p-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold border border-amber-300 transition-all text-left">
                🛒 Customer Demo
              </button>
            </div>
          </div>

          {authError && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs font-semibold">
            <div>
              <label className="block text-slate-600 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="manager@smartmarket.ai"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmittingAuth}
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-600/30 transition-all cursor-pointer text-sm disabled:opacity-50"
            >
              {isSubmittingAuth ? 'Signing In...' : 'Sign In to Dashboard →'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // KPI Calculations
  const totalStockKg = products.reduce((acc, p) => acc + p.stock, 0);
  const totalSalesRupees = products.reduce((acc, p) => acc + (p.salesToday * p.unitPrice), 0);
  const totalDemandKg = products.reduce((acc, p) => acc + p.predictedDemand, 0);
  const totalSurplusKg = products.reduce((acc, p) => acc + Math.max(p.stock - p.predictedDemand, 0), 0);
  const totalShortageKg = products.reduce((acc, p) => acc + Math.max(p.predictedDemand - p.stock, 0), 0);

  const kpis: KPIState = {
    currentInventoryKg: totalStockKg,
    todaySalesRupees: totalSalesRupees || 18450,
    tomorrowDemandKg: totalDemandKg,
    expectedSurplusKg: totalSurplusKg,
    expectedShortageKg: totalShortageKg,
    moneySavedRupees: 4280,
    wasteAvoidedKg: 47,
    diversionRatePct: 91,
    surplusTransactions: 24
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-emerald-500/40 flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Main Sidebar Navigation */}
      <Sidebar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        cartCount={cartItems.length}
      />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex-1 flex flex-col min-w-0">
        <Header 
          onPredictClick={handlePredictTomorrow}
          isPredicting={isPredicting}
          setMobileOpen={setMobileOpen}
        />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Top Quick Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Active Account:</span>
              <span className="px-2.5 py-1 rounded-full text-xs font-extrabold uppercase bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5" />
                {user.name} ({user.role})
              </span>
              <span className="text-xs font-semibold text-slate-500 hidden sm:inline">• Stall: {user.stall || 'Koyambedu Hub'}</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setCurrentTab('cart');
                  window.location.hash = 'cart';
                }}
                className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs shadow-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4 text-emerald-600" />
                <span>Cart ({cartItems.length})</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCurrentTab('vegetable-store');
                  window.location.hash = 'vegetable-store';
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Store className="w-4 h-4" />
                <span>🥦 Vegetable Store</span>
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-rose-50 hover:text-rose-600 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Active Tab Router */}
          {(currentTab === 'dashboard' || currentTab.includes('dashboard')) && (
            <DashboardTab 
              products={products}
              kpis={kpis}
              onPredictClick={handlePredictTomorrow}
              isPredicting={isPredicting}
              predictionDone={predictionDone}
              predictionStepText={predictionStepText}
              onNavigate={setCurrentTab}
            />
          )}

          {(currentTab === 'vegetable-store' || currentTab === 'selling') && (
            <VegetableStoreTab 
              products={products}
              onAddToCart={handleAddToCart}
              onNavigateToCart={() => {
                setCurrentTab('cart');
                window.location.hash = 'cart';
              }}
            />
          )}

          {currentTab === 'cart' && (
            <CartTab 
              cartItems={cartItems}
              onUpdateQuantity={handleUpdateCartQuantity}
              onRemoveItem={handleRemoveCartItem}
              onProceedToCheckout={() => {
                setCurrentTab('checkout');
                window.location.hash = 'checkout';
              }}
              onNavigateToStore={() => {
                setCurrentTab('vegetable-store');
                window.location.hash = 'vegetable-store';
              }}
            />
          )}

          {currentTab === 'checkout' && (
            <CheckoutTab 
              cartItems={cartItems}
              onCompleteCheckout={handleCompleteCheckout}
              onNavigateToCart={() => {
                setCurrentTab('cart');
                window.location.hash = 'cart';
              }}
              onNavigateToStore={() => {
                setCurrentTab('vegetable-store');
                window.location.hash = 'vegetable-store';
              }}
            />
          )}

          {currentTab === 'prediction' && (
            <PredictionTab 
              products={products}
              onPredictClick={handlePredictTomorrow}
              isPredicting={isPredicting}
            />
          )}

          {currentTab === 'inventory' && (
            <InventoryTab 
              products={products}
              onUpdateStock={handleUpdateStock}
              onAddProduct={handleAddProduct}
              showToast={showToast}
            />
          )}

          {currentTab === 'surplus' && (
            <SurplusAlertsTab 
              products={products}
              showToast={showToast}
              onNavigate={setCurrentTab}
            />
          )}

          {currentTab === 'pricing' && (
            <SmartPricingTab 
              products={products}
              showToast={showToast}
            />
          )}

          {currentTab === 'marketplace' && (
            <MarketplaceTab 
              listings={marketplace}
              onAddListing={handleAddListing}
              onRemoveListing={handleRemoveListing}
              showToast={showToast}
            />
          )}

          {currentTab === 'waste' && (
            <WasteToValueTab 
              wasteData={wasteData}
              onUpdateWaste={handleUpdateWaste}
              showToast={showToast}
            />
          )}

          {currentTab === 'analytics' && (
            <AnalyticsTab />
          )}
        </main>
      </div>

      {/* Quick Modal Sale */}
      {showRecordTransactionModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">Record Sales Transaction</h3>
                <p className="text-xs text-slate-500 font-medium">Connects to POST /api/transactions</p>
              </div>
              <button type="button" onClick={() => setShowRecordTransactionModal(false)} className="text-slate-400 hover:text-slate-600 text-xl font-bold">×</button>
            </div>

            {txError && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{txError}</span>
              </div>
            )}

            <form onSubmit={handleCreateTransaction} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-600 mb-1">Select Produce Item</label>
                <select
                  value={txProductId}
                  onChange={(e) => {
                    const id = Number(e.target.value);
                    setTxProductId(id);
                    const p = products.find(prod => Number(prod.id) === id);
                    if (p) setTxPrice(p.unitPrice);
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-bold bg-white text-slate-800"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.emoji} {p.name} (Stock: {p.stock} kg, Price: ₹{p.unitPrice}/kg)</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1">Quantity Sold (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    value={txQuantity}
                    onChange={(e) => setTxQuantity(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-1">Price per kg (₹)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    required
                    value={txPrice}
                    onChange={(e) => setTxPrice(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center justify-between">
                <span className="text-slate-600 font-bold text-xs">Total Sales Amount:</span>
                <span className="text-lg font-black text-emerald-800">
                  ₹{(Number(txQuantity || 0) * Number(txPrice || 0)).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRecordTransactionModal(false)}
                  className="w-1/2 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={txSubmitting}
                  className="w-1/2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md cursor-pointer disabled:opacity-50"
                >
                  {txSubmitting ? 'Saving...' : 'Record Sale →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Market Data Modal (PUT /api/products/{id}) */}
      {showEditMarketModal && editingProduct && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xl font-bold text-slate-900">Edit Market Data</h3>
              <button type="button" onClick={() => setShowEditMarketModal(false)} className="text-slate-400 hover:text-slate-600 text-xl font-bold">×</button>
            </div>

            <form onSubmit={handleSaveProductEdit} className="space-y-4 text-sm font-semibold">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Select Product</label>
                <select
                  value={editingProduct.id}
                  onChange={(e) => {
                    const p = products.find(item => item.id === e.target.value);
                    if (p) setEditingProduct({ ...p });
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white font-bold text-slate-900"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.emoji} {p.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Current Stock (kg)</label>
                  <input
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Today's Sales (kg)</label>
                  <input
                    type="number"
                    value={editingProduct.salesToday}
                    onChange={(e) => setEditingProduct({ ...editingProduct, salesToday: Number(e.target.value) })}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Price (₹/kg)</label>
                  <input
                    type="number"
                    value={editingProduct.unitPrice}
                    onChange={(e) => setEditingProduct({ ...editingProduct, unitPrice: Number(e.target.value) })}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Freshness (%)</label>
                  <input
                    type="number"
                    value={editingProduct.freshnessPct}
                    onChange={(e) => setEditingProduct({ ...editingProduct, freshnessPct: Number(e.target.value) })}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Shelf Life (days)</label>
                  <input
                    type="number"
                    value={editingProduct.shelfLifeDays}
                    onChange={(e) => setEditingProduct({ ...editingProduct, shelfLifeDays: Number(e.target.value) })}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 font-bold"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditMarketModal(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
