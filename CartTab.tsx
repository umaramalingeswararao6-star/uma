import React from 'react';
import { CartItem } from '../types';
import { ShoppingCart, Trash2, ArrowRight, Store, TrendingDown, ArrowUpRight } from 'lucide-react';

interface CartTabProps {
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, type: 'buy' | 'sell', newQty: number) => void;
  onRemoveItem: (id: string, type: 'buy' | 'sell') => void;
  onProceedToCheckout: () => void;
  onNavigateToStore: () => void;
}

export const CartTab: React.FC<CartTabProps> = ({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onNavigateToStore
}) => {
  const subtotalSum = cartItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);

  if (cartItems.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm text-center max-w-lg mx-auto space-y-6 my-8">
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600">
          <ShoppingCart className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-extrabold text-slate-900">Your Cart is Empty</h3>
          <p className="text-sm text-slate-500 max-w-xs mx-auto">
            You have no buying or selling produce items in your cart. Visit the Vegetable Store to select items.
          </p>
        </div>
        <button
          onClick={onNavigateToStore}
          className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 mx-auto cursor-pointer"
        >
          <Store className="w-4 h-4" />
          <span>GO TO VEGETABLE STORE →</span>
        </button>
      </div>
    );
  }

  const buyingItems = cartItems.filter(i => i.type === 'buy');
  const sellingItems = cartItems.filter(i => i.type === 'sell');

  return (
    <div className="space-y-8">
      {/* Cart Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 rounded-3xl p-8 text-white shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Shopping Cart ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
            </span>
          </div>
          <h2 className="text-3xl font-extrabold mt-2">Review Buying & Selling Items</h2>
        </div>
        <button
          onClick={onNavigateToStore}
          className="hidden sm:flex px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all cursor-pointer items-center gap-1.5"
        >
          <span>+ Add More Items</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Item List */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map(item => {
            const itemSubtotal = item.quantity * item.unitPrice;
            const isBuy = item.type === 'buy';

            return (
              <div 
                key={`${item.type}_${item.id}`}
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-3xl shrink-0">
                    {item.emoji}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase flex items-center gap-1 ${
                        isBuy 
                          ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}>
                        {isBuy ? <TrendingDown className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                        {isBuy ? 'BUYING (RESTOCK)' : 'SELLING (STORE)'}
                      </span>
                    </div>
                    <h4 className="font-extrabold text-slate-900 text-base mt-1">{item.name}</h4>
                    <p className="text-xs text-slate-500 font-medium">
                      ₹{item.unitPrice}/kg • {isBuy ? 'Purchase Order' : `Stock: ${item.stock} kg`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.id, item.type, item.quantity - (isBuy ? 1 : 0.5))}
                      className="w-8 h-8 rounded-xl bg-white text-slate-800 font-black text-sm flex items-center justify-center hover:bg-slate-50 border border-slate-200 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-14 text-center font-black text-slate-900 text-sm">
                      {item.quantity} kg
                    </span>
                    <button
                      type="button"
                      disabled={!isBuy && item.quantity >= item.stock}
                      onClick={() => onUpdateQuantity(item.id, item.type, item.quantity + (isBuy ? 1 : 0.5))}
                      className="w-8 h-8 rounded-xl bg-white text-slate-800 font-black text-sm flex items-center justify-center hover:bg-slate-50 border border-slate-200 disabled:opacity-40 cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right min-w-[90px]">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Subtotal</span>
                    <span className={`text-lg font-black ${isBuy ? 'text-blue-700' : 'text-emerald-700'}`}>
                      ₹{itemSubtotal.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.id, item.type)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                    title="Remove line item"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6 h-fit">
          <h3 className="text-xl font-extrabold text-slate-900 border-b border-slate-100 pb-3">Order Summary</h3>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between text-slate-600">
              <span>Buying Restock Items:</span>
              <span className="font-bold text-blue-700">{buyingItems.length} SKUs</span>
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <span>Selling Store Items:</span>
              <span className="font-bold text-emerald-700">{sellingItems.length} SKUs</span>
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <span>Total Produce Weight:</span>
              <span className="font-bold text-slate-900">
                {cartItems.reduce((acc, i) => acc + i.quantity, 0)} kg
              </span>
            </div>

            <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-base">
              <span className="font-bold text-slate-800">Grand Total:</span>
              <span className="text-2xl font-black text-slate-900">
                ₹{subtotalSum.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onProceedToCheckout}
            className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>PROCEED TO CHECKOUT</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
