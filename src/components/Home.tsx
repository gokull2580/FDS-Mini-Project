
import React, { useState } from 'react';
import { SalesRecord, Product, DashboardSettings } from '../types';
import { formatCurrency } from '../lib/utils';
import { Plus, History, ShoppingBag, DollarSign, Package } from 'lucide-react';
import { motion } from 'motion/react';
import { format } from 'date-fns';

interface HomeProps {
  data: SalesRecord[];
  onAdd: (record: Omit<SalesRecord, 'id'>) => void;
  settings: DashboardSettings;
}

export default function Home({ data, onAdd, settings }: HomeProps) {
  const [formData, setFormData] = useState({
    product: 'Laptop' as Product,
    price: 75000,
    quantity: 1,
    date: format(new Date(), 'yyyy-MM-dd'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const category = ['Laptop', 'Monitor', 'TV'].includes(formData.product) ? 'Electronics' : 'Accessories';
    onAdd({
      ...formData,
      category: category as any,
      total: formData.price * formData.quantity,
    });
    alert('Entry added successfully!');
  };

  const recentTransactions = data.slice(0, 8);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Sales Management</h1>
        <p className="text-gray-500 dark:text-zinc-400">Capture and monitor your latest sales activity.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1 space-y-6"
        >
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-600" />
              New Sale Entry
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5 opacity-70">Product Name</label>
                <select 
                  value={formData.product}
                  onChange={(e) => setFormData({ ...formData, product: e.target.value as Product })}
                  className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                >
                  <option>Laptop</option>
                  <option>Monitor</option>
                  <option>TV</option>
                  <option>Headphones</option>
                  <option>Keyboard</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5 opacity-70">Price ({settings.currency})</label>
                  <input 
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    required
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 opacity-70">Quantity</label>
                  <input 
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                    className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    required
                    min="1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5 opacity-70">Sale Date</label>
                <input 
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  required
                />
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.98]"
                >
                  Confirm Sale
                </button>
              </div>
            </form>
          </div>

          <div className="bg-indigo-600 rounded-2xl p-6 text-white overflow-hidden relative group">
            <div className="relative z-10">
               <p className="text-indigo-100 text-sm font-medium mb-1">Lifetime Revenue</p>
               <h3 className="text-3xl font-bold">{formatCurrency(data.reduce((acc, curr) => acc + curr.total, 0), settings.currency)}</h3>
               <div className="mt-4 flex items-center gap-2 text-sm text-indigo-200">
                 <ShoppingBag className="w-4 h-4" />
                 <span>{data.reduce((acc, curr) => acc + curr.quantity, 0)} Units Sold</span>
               </div>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <DollarSign size={120} />
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          <div className="bg-white dark:bg-zinc-900 h-full rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <History className="w-5 h-5 text-indigo-600" />
                Recent Activity
              </h2>
            </div>
            
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-xs text-gray-500 uppercase tracking-wider border-b border-gray-50 dark:border-zinc-800">
                    <th className="px-6 py-4 font-semibold">Date</th>
                    <th className="px-6 py-4 font-semibold">Product</th>
                    <th className="px-6 py-4 font-semibold">Qty</th>
                    <th className="px-6 py-4 font-semibold">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-zinc-800">
                  {recentTransactions.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                      <td className="px-6 py-4 text-sm whitespace-nowrap opacity-70">
                        {format(new Date(item.date), 'MMM dd, yyyy')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
                            <Package className="w-4 h-4 text-gray-500" />
                          </div>
                          <span className="text-sm font-medium">{item.product}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-mono">{item.quantity}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                        {formatCurrency(item.total, settings.currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
