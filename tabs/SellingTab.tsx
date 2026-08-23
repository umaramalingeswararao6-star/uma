import React, { useState } from 'react';
import { ProductItem } from '../types';
import { ShoppingCart, Plus, Check, AlertCircle } from 'lucide-react';

interface SellingTabProps {
  products: ProductItem[];
  onAddToCart: (product: ProductItem, quantityKg: number) => void;
  onNavigateToCart: () => void;
}

export const SellingTab: React.FC<SellingTabProps> = ({
  products,
  onAddToCart,
  onNavigateToCart
}) => {
  // Local quantity selections for each product ID
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  const handleQuantityChange = (id: string, val: number, maxStock: number) => {
    const clamped = Math.max(0.5, Math.min(val, maxStock));
    setQuantities(prev => ({ ...prev, [id]: clamped }));
  };

  const handleAddClick = (product: ProductItem) => {
    const qty = quantities[product.id] || 1;
    onAddToCart(product, qty);
    
    // Show visual confirmation on button
    setAddedIds(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds(prev => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  return (
    <div className="space-y-8">
      {/* Selling Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-700/60 px-3 py-1 rounded-full text-xs font-bold text-emerald-200">🛒 Produce Counter</span>
            <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-0.5 rounded-full font-mono">LIVE API SYNC</span>
          </div>
          <h2 className="text-3xl font-extrabold">Sell Fresh Produce & Add to Cart</h2>
          <p className="text-sm text-emerald-100/90 max-w-xl">
            Select fresh produce items, adjust quantities, add to your cart, and proceed to checkout.
          </p>
        </div>
        <button
          onClick={onNavigateToCart}
          className="px-6 py-3.5 rounded-2xl bg-white hover:bg-emerald-50 text-slate-900 font-bold text-xs sm:text-sm shadow-lg transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <ShoppingCart className="w-4 h-4 text-emerald-600" />
          <span>View Cart & Checkout →</span>
        </button>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => {
          const selectedQty = quantities[product.id] || 1;
          const isAdded = addedIds[product.id];
          const isOutOfStock = product.stock <= 0;

          return (
            <div 
              key={product.id} 
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-5 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Header info */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-3xl shadow-inner">
                      {product.emoji}
                    </div>
                    <div>
                      <h3 className="text-lg font-extrabold text-slate-900">{product.name}</h3>
                      <span className="text-xs font-semibold text-slate-500">{product.category}</span>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                    product.risk === 'HIGH' ? 'bg-rose-100 text-rose-800 border border-rose-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}>
                    {product.risk} RISK
                  </span>
                </div>

                {/* Price & Stock Stats */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 font-medium block">Price per kg</span>
                    <span className="text-lg font-black text-emerald-700">₹{product.unitPrice}/kg</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Current Stock</span>
                    <span className={`text-base font-extrabold ${isOutOfStock ? 'text-rose-600' : 'text-slate-900'}`}>
                      {product.stock} kg
                    </span>
                  </div>
                </div>

                {/* Quality Stats */}
                <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
                  <span>Freshness: <strong className="text-slate-800 font-bold">{product.freshnessPct}%</strong></span>
                  <span>Shelf Life: <strong className="text-slate-800 font-bold">{product.shelfLifeDays} days</strong></span>
                </div>
              </div>

              {/* Quantity Input & Add to Cart Action */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between gap-3 bg-slate-100 p-2 rounded-2xl border border-slate-200">
                  <span className="text-xs font-bold text-slate-600 pl-2">Quantity (kg):</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={selectedQty <= 0.5 || isOutOfStock}
                      onClick={() => handleQuantityChange(product.id, selectedQty - 0.5, product.stock)}
                      className="w-8 h-8 rounded-xl bg-white text-slate-800 font-extrabold text-sm flex items-center justify-center border border-slate-200 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      step="0.5"
                      min="0.5"
                      max={product.stock}
                      disabled={isOutOfStock}
                      value={selectedQty}
                      onChange={(e) => handleQuantityChange(product.id, parseFloat(e.target.value) || 0.5, product.stock)}
                      className="w-16 text-center font-black text-slate-900 text-sm bg-transparent focus:outline-none"
                    />
                    <button
                      type="button"
                      disabled={selectedQty >= product.stock || isOutOfStock}
                      onClick={() => handleQuantityChange(product.id, selectedQty + 0.5, product.stock)}
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
                      ? 'bg-emerald-800 text-white' 
                      : isOutOfStock 
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
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
                      <span>Add to Cart ({selectedQty} kg) →</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
