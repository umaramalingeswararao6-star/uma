import React, { useState } from 'react';
import { ProductItem } from '../types';
import { ShoppingCart, Search, Check, AlertCircle, TrendingDown, ArrowUpRight } from 'lucide-react';

interface VegetableStoreTabProps {
  products: ProductItem[];
  onAddToCart: (product: ProductItem, quantityKg: number, type: 'buy' | 'sell') => void;
  onNavigateToCart: () => void;
}

export const VegetableStoreTab: React.FC<VegetableStoreTabProps> = ({
  products,
  onAddToCart,
  onNavigateToCart
}) => {
  const [activeSection, setActiveSection] = useState<'buying' | 'selling'>('selling');
  const [searchQuery, setSearchQuery] = useState('');
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  const handleQuantityChange = (id: string, val: number, maxStock?: number) => {
    const minVal = activeSection === 'buying' ? 1 : 0.5;
    const clamped = maxStock !== undefined 
      ? Math.max(minVal, Math.min(val, maxStock))
      : Math.max(minVal, val);
    setQuantities(prev => ({ ...prev, [`${activeSection}_${id}`]: clamped }));
  };

  const handleAddClick = (product: ProductItem) => {
    const key = `${activeSection}_${product.id}`;
    const defaultQty = activeSection === 'buying' ? 5 : 1;
    const qty = quantities[key] || defaultQty;

    const itemType: 'buy' | 'sell' = activeSection === 'buying' ? 'buy' : 'sell';
    onAddToCart(product, qty, itemType);

    setAddedIds(prev => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setAddedIds(prev => ({ ...prev, [key]: false }));
    }, 1500);
  };

  // Filter products by search
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // BUYING products: Zero stock, low stock (< 30 kg), or all products for restock
  const buyingProducts = filteredProducts.filter(p => p.stock <= 40);
  // SELLING products: Current stock > 0
  const sellingProducts = filteredProducts.filter(p => p.stock > 0);

  const displayedProducts = activeSection === 'buying' ? buyingProducts : sellingProducts;

  return (
    <div className="space-y-8">
      {/* Header Banner & Section Switcher */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 rounded-3xl p-8 text-white shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold px-3 py-1 rounded-full border border-emerald-500/30 uppercase">
                🥦 KOYAMBEDU VEGETABLE STORE
              </span>
            </div>
            <h2 className="text-3xl font-black">Vegetable Store Management</h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mt-1">
              Switch between purchasing restock produce for your inventory and selling available fresh vegetables to customers.
            </p>
          </div>

          <button
            onClick={onNavigateToCart}
            className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>View Cart & Checkout →</span>
          </button>
        </div>

        {/* Section Tabs & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-800">
          {/* BUYING / SELLING Tabs */}
          <div className="bg-slate-900 p-1.5 rounded-2xl border border-slate-800 flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setActiveSection('buying')}
              className={`flex-1 sm:flex-initial px-6 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeSection === 'buying'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <TrendingDown className="w-4 h-4" />
              <span>BUYING (Restock)</span>
              <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-blue-700/60 font-mono">
                {buyingProducts.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSection('selling')}
              className={`flex-1 sm:flex-initial px-6 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeSection === 'selling'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>SELLING (Store Stock)</span>
              <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-emerald-700/60 font-mono">
                {sellingProducts.length}
              </span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search vegetables..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs font-semibold focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Product Cards Grid */}
      {displayedProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-md mx-auto space-y-3">
          <p className="text-base font-bold text-slate-700">No vegetables match your filter.</p>
          <p className="text-xs text-slate-500">Try searching for another produce item or switch tabs.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedProducts.map(product => {
            const key = `${activeSection}_${product.id}`;
            const defaultQty = activeSection === 'buying' ? 5 : 1;
            const selectedQty = quantities[key] || defaultQty;
            const isAdded = addedIds[key];
            const isOutOfStock = activeSection === 'selling' && product.stock <= 0;
            const displayPrice = activeSection === 'buying' 
              ? (product.purchasePrice || Math.round(product.unitPrice * 0.7)) 
              : product.unitPrice;

            return (
              <div 
                key={key} 
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-5 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-4xl shadow-inner">
                        {product.emoji}
                      </div>
                      <div>
                        <h3 className="text-lg font-extrabold text-slate-900">{product.name}</h3>
                        <span className="text-xs font-semibold text-slate-500">{product.category}</span>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                      activeSection === 'buying'
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}>
                      {activeSection === 'buying' ? 'RESTOCK BUY' : 'STORE SELL'}
                    </span>
                  </div>

                  {/* Price & Stock Stats */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 font-medium block">
                        {activeSection === 'buying' ? 'Buying Price' : 'Selling Price'}
                      </span>
                      <span className={`text-lg font-black ${activeSection === 'buying' ? 'text-blue-700' : 'text-emerald-700'}`}>
                        ₹{displayPrice}/kg
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium block">Current Stock</span>
                      <span className={`text-base font-extrabold ${product.stock <= 0 ? 'text-rose-600 font-black' : 'text-slate-900'}`}>
                        {product.stock} kg
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
                    <span>Freshness: <strong className="text-slate-800 font-bold">{product.freshnessPct}%</strong></span>
                    <span>Shelf Life: <strong className="text-slate-800 font-bold">{product.shelfLifeDays} days</strong></span>
                  </div>
                </div>

                {/* Quantity Controls & Add to Cart */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between gap-3 bg-slate-100 p-2 rounded-2xl border border-slate-200">
                    <span className="text-xs font-bold text-slate-600 pl-2">Quantity (kg):</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={selectedQty <= (activeSection === 'buying' ? 1 : 0.5)}
                        onClick={() => handleQuantityChange(product.id, selectedQty - (activeSection === 'buying' ? 1 : 0.5), activeSection === 'selling' ? product.stock : undefined)}
                        className="w-8 h-8 rounded-xl bg-white text-slate-800 font-extrabold text-sm flex items-center justify-center border border-slate-200 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        step={activeSection === 'buying' ? '1' : '0.5'}
                        min={activeSection === 'buying' ? '1' : '0.5'}
                        max={activeSection === 'selling' ? product.stock : undefined}
                        value={selectedQty}
                        onChange={(e) => handleQuantityChange(product.id, parseFloat(e.target.value) || 1, activeSection === 'selling' ? product.stock : undefined)}
                        className="w-16 text-center font-black text-slate-900 text-sm bg-transparent focus:outline-none"
                      />
                      <button
                        type="button"
                        disabled={activeSection === 'selling' && selectedQty >= product.stock}
                        onClick={() => handleQuantityChange(product.id, selectedQty + (activeSection === 'buying' ? 1 : 0.5), activeSection === 'selling' ? product.stock : undefined)}
                        className="w-8 h-8 rounded-xl bg-white text-slate-800 font-extrabold text-sm flex items-center justify-center border border-slate-200 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={isOutOfStock}
                    onClick={() => handleAddClick(product)}
                    className={`
                      w-full py-3.5 rounded-2xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer
                      ${isAdded 
                        ? 'bg-slate-800 text-white' 
                        : isOutOfStock 
                          ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                          : activeSection === 'buying'
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'}
                    `}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Added to Cart!</span>
                      </>
                    ) : isOutOfStock ? (
                      <>
                        <AlertCircle className="w-4 h-4" />
                        <span>Out of Stock</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        <span>ADD TO CART ({selectedQty} kg {activeSection.toUpperCase()}) →</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
