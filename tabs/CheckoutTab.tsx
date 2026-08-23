import React, { useState } from 'react';
import { CartItem } from '../types';
import { CheckCircle2, CreditCard, QrCode, Wallet, ShieldCheck, ArrowLeft, Store, TrendingDown, ArrowUpRight } from 'lucide-react';

interface CheckoutTabProps {
  cartItems: CartItem[];
  onCompleteCheckout: () => Promise<boolean>;
  onNavigateToCart: () => void;
  onNavigateToStore: () => void;
}

export const CheckoutTab: React.FC<CheckoutTabProps> = ({
  cartItems,
  onCompleteCheckout,
  onNavigateToCart,
  onNavigateToStore
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'demo'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [completedCounts, setCompletedCounts] = useState({ buy: 0, sell: 0 });

  const totalAmount = cartItems.reduce((acc, i) => acc + (i.quantity * i.unitPrice), 0);

  const handlePayNow = async () => {
    setIsProcessing(true);
    
    const buyCount = cartItems.filter(i => i.type === 'buy').length;
    const sellCount = cartItems.filter(i => i.type === 'sell').length;

    setTimeout(async () => {
      const success = await onCompleteCheckout();
      setIsProcessing(false);
      
      if (success) {
        setCompletedCounts({ buy: buyCount, sell: sellCount });
        setPaymentCompleted(true);
      }
    }, 1000);
  };

  // Payment Success Screen
  if (paymentCompleted) {
    return (
      <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-xl text-center max-w-lg mx-auto space-y-6 my-8">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-inner">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <div className="space-y-2">
          <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-3 py-1 rounded-full uppercase">
            ✓ Transaction Completed
          </span>
          <h2 className="text-3xl font-black text-slate-900">Payment Successful</h2>
          <p className="text-sm text-slate-500 max-w-xs mx-auto">
            {completedCounts.sell > 0 && `${completedCounts.sell} sales transaction(s) recorded (POST /api/transactions). `}
            {completedCounts.buy > 0 && `${completedCounts.buy} purchase restock(s) recorded (POST /api/purchases).`}
          </p>
        </div>

        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-left space-y-2 text-xs">
          <div className="flex justify-between font-medium text-slate-500">
            <span>Payment Method:</span>
            <span className="font-bold text-slate-900 uppercase">{paymentMethod} (Demo)</span>
          </div>
          <div className="flex justify-between text-sm pt-1 border-t border-slate-200 font-bold">
            <span className="text-slate-700">Total Paid:</span>
            <span className="text-emerald-700 font-black">₹{totalAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <button
          onClick={onNavigateToStore}
          className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Store className="w-4 h-4" />
          <span>CONTINUE TO VEGETABLE STORE →</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Checkout Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onNavigateToCart}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold text-xs bg-white px-4 py-2.5 rounded-xl border border-slate-200 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Cart</span>
        </button>
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-full text-emerald-800 text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>SAFE DEMO PAYMENT FLOW</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payment Methods */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-xl font-extrabold text-slate-900">Select Payment Method</h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* UPI */}
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-5 rounded-2xl border-2 text-left space-y-3 transition-all cursor-pointer ${
                  paymentMethod === 'upi'
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">UPI Payment</h4>
                  <p className="text-[11px] text-slate-500">GPay, PhonePe, Paytm</p>
                </div>
              </button>

              {/* Card */}
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-5 rounded-2xl border-2 text-left space-y-3 transition-all cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">Card Payment</h4>
                  <p className="text-[11px] text-slate-500">Debit or Credit Card</p>
                </div>
              </button>

              {/* Demo Cash */}
              <button
                type="button"
                onClick={() => setPaymentMethod('demo')}
                className={`p-5 rounded-2xl border-2 text-left space-y-3 transition-all cursor-pointer ${
                  paymentMethod === 'demo'
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">Cash / Vendor Demo</h4>
                  <p className="text-[11px] text-slate-500">Stall Cash Counter</p>
                </div>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
              <span className="font-bold text-slate-900">ℹ️ Demo Checkout Notice:</span>
              <p>
                Clicking "PAY NOW (DEMO)" will automatically route <strong>SELLING</strong> items to <code>POST /api/transactions</code> (reducing stock) and <strong>BUYING</strong> items to <code>POST /api/purchases</code> (increasing stock).
              </p>
            </div>
          </div>
        </div>

        {/* Order Summary & Pay Action */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6 h-fit">
          <h3 className="text-xl font-extrabold text-slate-900 border-b border-slate-100 pb-3">Order Breakdown</h3>

          <div className="space-y-3 text-xs max-h-60 overflow-y-auto pr-1">
            {cartItems.map(item => {
              const isBuy = item.type === 'buy';
              return (
                <div key={`${item.type}_${item.id}`} className="flex justify-between items-center text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${
                      isBuy ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {isBuy ? 'BUY' : 'SELL'}
                    </span>
                    <span className="font-semibold">{item.emoji} {item.name} ({item.quantity} kg)</span>
                  </div>
                  <span className="font-bold text-slate-900">₹{(item.quantity * item.unitPrice).toLocaleString('en-IN')}</span>
                </div>
              );
            })}
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-3">
            <div className="flex items-center justify-between text-base">
              <span className="font-bold text-slate-800">Grand Total:</span>
              <span className="text-2xl font-black text-emerald-700">₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>

            <button
              type="button"
              disabled={isProcessing}
              onClick={handlePayNow}
              className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <span>Processing Demo Payment...</span>
              ) : (
                <span>PAY NOW (DEMO) →</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
