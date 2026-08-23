import React, { useState } from 'react';
import { ProductItem } from '../types';
import { Package, Plus, Search, Filter, Edit2, Save, CheckCircle } from 'lucide-react';

interface InventoryTabProps {
  products: ProductItem[];
  onUpdateStock: (id: string, newStock: number) => void;
  onAddProduct: (item: ProductItem) => void;
  showToast: (msg: string) => void;
}

export const InventoryTab: React.FC<InventoryTabProps> = ({
  products,
  onUpdateStock,
  onAddProduct,
  showToast
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState<string>('ALL');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<number>(0);

  // Add Item Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmoji, setNewEmoji] = useState('🥦');
  const [newStock, setNewStock] = useState(30);
  const [newPrice, setNewPrice] = useState(40);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = filterRisk === 'ALL' || p.risk === filterRisk;
    return matchesSearch && matchesRisk;
  });

  const handleStartEdit = (p: ProductItem) => {
    setEditingId(p.id);
    setEditValue(p.stock);
  };

  const handleSaveEdit = (id: string) => {
    onUpdateStock(id, editValue);
    setEditingId(null);
    showToast(`Inventory updated to ${editValue} kg`);
  };

  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newItem: ProductItem = {
      id: `item-${Date.now()}`,
      name: newName,
      emoji: newEmoji || '📦',
      stock: Number(newStock),
      unitPrice: Number(newPrice),
      salesToday: 0,
      prevSales: 20,
      predictedDemand: Math.round(Number(newStock) * 0.8),
      shelfLifeDays: 5,
      freshnessPct: 95,
      status: 'Fresh',
      risk: 'LOW',
      category: 'Vegetables'
    };

    onAddProduct(newItem);
    setShowAddModal(false);
    setNewName('');
    showToast(`Added ${newName} to inventory!`);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">Live Inventory Management</h2>
          <p className="text-sm text-slate-500 mt-1">
            Real-time stock tracking, freshness assessment, and shelf-life alerts.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add New Product</span>
        </button>
      </div>

      {/* Controls Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search produce..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-600 bg-slate-50"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-500 font-semibold">Risk Filter:</span>
          <select
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-600"
          >
            <option value="ALL">All Risks</option>
            <option value="HIGH">High Risk</option>
            <option value="MEDIUM">Medium Risk</option>
            <option value="LOW">Low Risk</option>
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-semibold text-xs uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Current Stock</th>
                <th className="px-6 py-4">Today's Sales</th>
                <th className="px-6 py-4">Predicted Demand</th>
                <th className="px-6 py-4">Shelf Life</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredProducts.map((item) => {
                const isEditing = editingId === item.id;
                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <span className="text-2xl">{item.emoji}</span>
                      <div>
                        <span className="font-bold text-slate-900 block">{item.name}</span>
                        <span className="text-[11px] text-slate-400">₹{item.unitPrice}/kg</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={editValue}
                            onChange={(e) => setEditValue(Number(e.target.value))}
                            className="w-20 px-2 py-1 border border-emerald-500 rounded-lg text-sm font-bold text-slate-900 focus:outline-none"
                          />
                          <button
                            onClick={() => handleSaveEdit(item.id)}
                            className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="font-extrabold text-slate-900">{item.stock} kg</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-700">{item.salesToday} kg</td>
                    <td className="px-6 py-4 text-emerald-700 font-bold">{item.predictedDemand} kg</td>
                    <td className="px-6 py-4 text-slate-600">{item.shelfLifeDays} days</td>
                    <td className="px-6 py-4">
                      <span className={`
                        px-2.5 py-1 rounded-full text-xs font-bold border inline-flex items-center gap-1
                        ${item.status === 'Fresh' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : ''}
                        ${item.status === 'Aging' ? 'bg-amber-100 text-amber-800 border-amber-200' : ''}
                        ${item.status === 'Critical' ? 'bg-rose-100 text-rose-800 border-rose-200' : ''}
                      `}>
                        {item.status === 'Fresh' && '🟢 Fresh'}
                        {item.status === 'Aging' && '🟡 Aging'}
                        {item.status === 'Critical' && '🔴 Critical'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleStartEdit(item)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Adjust Stock</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 space-y-6">
            <h3 className="text-xl font-bold text-slate-900">Add New Produce Item</h3>
            <form onSubmit={handleCreateNew} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Spinach / Cucumber"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Emoji Icon</label>
                  <input
                    type="text"
                    value={newEmoji}
                    onChange={(e) => setNewEmoji(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-center"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Price (₹/kg)</label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Initial Stock (kg)</label>
                <input
                  type="number"
                  value={newStock}
                  onChange={(e) => setNewStock(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200"
                />
              </div>
              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-md"
                >
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
