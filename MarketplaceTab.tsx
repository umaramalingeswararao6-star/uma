import React, { useState } from 'react';
import { MarketplaceListing } from '../types';
import { Store, Plus, MapPin, Clock, Tag, MessageSquare, Trash2, Filter, Search, CheckCircle2 } from 'lucide-react';

interface MarketplaceTabProps {
  listings: MarketplaceListing[];
  onAddListing: (listing: MarketplaceListing) => void;
  onRemoveListing: (id: string) => void;
  showToast: (msg: string) => void;
}

export const MarketplaceTab: React.FC<MarketplaceTabProps> = ({
  listings,
  onAddListing,
  onRemoveListing,
  showToast
}) => {
  const [buyerFilter, setBuyerFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [productName, setProductName] = useState('Fresh Tomatoes');
  const [emoji, setEmoji] = useState('🍅');
  const [quantityKg, setQuantityKg] = useState(20);
  const [freshnessPct, setFreshnessPct] = useState(88);
  const [originalPrice, setOriginalPrice] = useState(40);
  const [discountedPrice, setDiscountedPrice] = useState(30);
  const [pickupLocation, setPickupLocation] = useState('Koyambedu Market, Stall #14');
  const [suitableBuyer, setSuitableBuyer] = useState<'Nearby Vendors' | 'Restaurants' | 'Canteens' | 'NGOs'>('Restaurants');

  const filteredListings = listings.filter(l => {
    const matchesBuyer = buyerFilter === 'ALL' || l.suitableBuyer === buyerFilter;
    const matchesSearch = l.productName.toLowerCase().includes(searchQuery.toLowerCase()) || l.pickupLocation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBuyer && matchesSearch;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newListing: MarketplaceListing = {
      id: `listing-${Date.now()}`,
      productName,
      emoji: emoji || '📦',
      quantityKg: Number(quantityKg),
      freshnessPct: Number(freshnessPct),
      originalPrice: Number(originalPrice),
      discountedPrice: Number(discountedPrice),
      pickupLocation,
      suitableBuyer,
      sellerName: 'Koyambedu Vendor Hub',
      timeRemainingHours: 12
    };

    onAddListing(newListing);
    setShowModal(false);
    showToast('Surplus listing created successfully.');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-2">
            <Store className="w-3.5 h-3.5" />
            <span>B2B Surplus Redistribution</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Surplus Food Marketplace</h2>
          <p className="text-sm text-slate-500 mt-1">
            Connect local vendors with nearby restaurants, canteens, and NGOs to redistribute excess produce quickly.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-5 h-5" />
          <span>+ ADD SURPLUS LISTING</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search produce or market location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-600 bg-slate-50"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-500 font-semibold">Suitable Buyer:</span>
          <select
            value={buyerFilter}
            onChange={(e) => setBuyerFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-600"
          >
            <option value="ALL">All Buyers</option>
            <option value="Nearby Vendors">Nearby Vendors</option>
            <option value="Restaurants">Restaurants</option>
            <option value="Canteens">Canteens</option>
            <option value="NGOs">NGOs</option>
          </select>
        </div>
      </div>

      {/* Marketplace Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map((item) => (
          <div key={item.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-3xl">{item.emoji}</span>
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-extrabold text-xs border border-emerald-200">
                  Freshness: {item.freshnessPct}%
                </span>
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-slate-900">{item.productName}</h3>
                <span className="text-sm font-black text-emerald-600 block">{item.quantityKg} kg Available</span>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 block line-through">₹{item.originalPrice}/kg</span>
                  <span className="text-lg font-black text-slate-900">₹{item.discountedPrice}/kg</span>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-lg">
                  {Math.round(((item.originalPrice - item.discountedPrice) / item.originalPrice) * 100)}% OFF
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{item.pickupLocation}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Buyer: <strong className="text-slate-800">{item.suitableBuyer}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Pickup window: {item.timeRemainingHours} hrs remaining</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
              <button
                onClick={() => showToast(`Contacting seller for ${item.productName}...`)}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Contact Buyer</span>
              </button>
              <button
                onClick={() => {
                  onRemoveListing(item.id);
                  showToast(`Removed listing for ${item.productName}`);
                }}
                className="p-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
                title="Remove listing"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Surplus Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xl font-bold text-slate-900">Add Surplus Listing</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 text-xl font-bold">×</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Product Name</label>
                  <input
                    type="text"
                    required
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Emoji</label>
                  <input
                    type="text"
                    value={emoji}
                    onChange={(e) => setEmoji(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 text-center"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Quantity (kg)</label>
                  <input
                    type="number"
                    required
                    value={quantityKg}
                    onChange={(e) => setQuantityKg(Number(e.target.value))}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Freshness (%)</label>
                  <input
                    type="number"
                    value={freshnessPct}
                    onChange={(e) => setFreshnessPct(Number(e.target.value))}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Original Price (₹/kg)</label>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(Number(e.target.value))}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Discount Price (₹/kg)</label>
                  <input
                    type="number"
                    value={discountedPrice}
                    onChange={(e) => setDiscountedPrice(Number(e.target.value))}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Pickup Location</label>
                <input
                  type="text"
                  required
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Suitable Buyer Type</label>
                <select
                  value={suitableBuyer}
                  onChange={(e) => setSuitableBuyer(e.target.value as any)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="Nearby Vendors">Nearby Vendors</option>
                  <option value="Restaurants">Restaurants</option>
                  <option value="Canteens">Canteens</option>
                  <option value="NGOs">NGOs</option>
                </select>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md"
                >
                  LIST SURPLUS
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
