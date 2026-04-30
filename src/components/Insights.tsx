
import React, { useMemo } from 'react';
import { SalesRecord, DashboardSettings } from '../types';
import { cn, formatCurrency } from '../lib/utils';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { format, parseISO, startOfDay } from 'date-fns';
import { Filter, Calendar, TrendingUp, ShoppingCart, DollarSign, Award } from 'lucide-react';
import { motion } from 'motion/react';

interface InsightsProps {
  data: SalesRecord[];
  settings: DashboardSettings;
  dateFilter: { start: string; end: string };
  setDateFilter: (f: { start: string; end: string }) => void;
  productFilter: string[];
  setProductFilter: (p: string[]) => void;
  allProducts: string[];
}

export default function Insights({ 
  data, settings, dateFilter, setDateFilter, productFilter, setProductFilter, allProducts 
}: InsightsProps) {
  
  const metrics = useMemo(() => {
    const totalRevenue = data.reduce((acc, curr) => acc + curr.total, 0);
    const totalUnits = data.reduce((acc, curr) => acc + curr.quantity, 0);
    const avgOrderValue = data.length > 0 ? totalRevenue / data.length : 0;
    
    const productCounts = data.reduce((acc, curr) => {
      acc[curr.product] = (acc[curr.product] || 0) + curr.quantity;
      return acc;
    }, {} as Record<string, number>);
    
    const bestSeller = Object.entries(productCounts)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || 'N/A';

    return { totalRevenue, totalUnits, avgOrderValue, bestSeller };
  }, [data]);

  const trends = useMemo(() => {
    const grouped = data.reduce((acc, curr) => {
      const date = curr.date;
      acc[date] = (acc[date] || 0) + curr.total;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped)
      .map(([date, total]) => ({ date, total }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [data]);

  const productData = useMemo(() => {
    const grouped = data.reduce((acc, curr) => {
      acc[curr.product] = (acc[curr.product] || 0) + curr.total;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [data]);

  const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f97316', '#22c55e'];

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Data Insights</h1>
          <p className="text-gray-500 dark:text-zinc-400">Deep dive into your sales performance metrics.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 px-4 py-2 rounded-xl border border-gray-200 dark:border-zinc-800 text-sm font-medium">
            <Calendar className="w-4 h-4 text-indigo-500" />
            <input 
              type="date" 
              value={dateFilter.start} 
              onChange={e => setDateFilter({ ...dateFilter, start: e.target.value })}
              className="bg-transparent border-none outline-none text-xs w-24"
            />
            <span className="opacity-50">to</span>
            <input 
              type="date" 
              value={dateFilter.end} 
              onChange={e => setDateFilter({ ...dateFilter, end: e.target.value })}
              className="bg-transparent border-none outline-none text-xs w-24"
            />
          </div>

          <div className="relative group">
            <button className="flex items-center gap-2 bg-white dark:bg-zinc-900 px-4 py-2 rounded-xl border border-gray-200 dark:border-zinc-800 text-sm font-medium">
              <Filter className="w-4 h-4 text-indigo-500" />
              Products ({productFilter.length || 'All'})
            </button>
            <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-xl p-2 hidden group-hover:block z-20">
              {allProducts.map(p => (
                <label key={p} className="flex items-center gap-2 p-2 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-lg cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={productFilter.includes(p)}
                    onChange={() => {
                      if (productFilter.includes(p)) setProductFilter(productFilter.filter(x => x !== p));
                      else setProductFilter([...productFilter, p]);
                    }}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm">{p}</span>
                </label>
              ))}
              {productFilter.length > 0 && (
                <button 
                  onClick={() => setProductFilter([])}
                  className="w-full text-center text-xs text-indigo-600 py-2 border-t mt-1"
                >
                  Clear Selection
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard label="Revenue" value={formatCurrency(metrics.totalRevenue, settings.currency)} sub="Cumulative revenue" icon={DollarSign} color="indigo" />
        <MetricCard label="Units Sold" value={metrics.totalUnits.toString()} sub="Total volume" icon={ShoppingCart} color="purple" />
        <MetricCard label="Avg. Order" value={formatCurrency(metrics.avgOrderValue, settings.currency)} sub="Ticket average" icon={TrendingUp} color="pink" />
        <MetricCard label="Best Seller" value={metrics.bestSeller} sub="Top performer" icon={Award} color="emerald" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm h-[400px]">
          <h2 className="text-lg font-semibold mb-6">Revenue Trend</h2>
          <ResponsiveContainer width="100%" height="85%">
            <AreaChart data={trends}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
              <XAxis 
                dataKey="date" 
                tickFormatter={(str) => format(parseISO(str), 'MMM dd')}
                strokeOpacity={0.3}
                fontSize={12}
              />
              <YAxis strokeOpacity={0.3} fontSize={12} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                formatter={(val: number) => [formatCurrency(val, settings.currency), 'Revenue']}
              />
              <Area type="monotone" dataKey="total" stroke="#6366f1" fillOpacity={1} fill="url(#colorTotal)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm h-[400px]">
          <h2 className="text-lg font-semibold mb-6">Product Mix</h2>
          <ResponsiveContainer width="100%" height="85%">
            <PieChart>
              <Pie
                data={productData}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {productData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(val: number) => formatCurrency(val, settings.currency)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}

function MetricCard({ label, value, sub, icon: Icon, color }: { label: string; value: string; sub: string; icon: any; color: string }) {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm"
    >
      <div className="flex items-center gap-4">
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", `bg-${color}-500/10`)}>
          <Icon className={cn("w-6 h-6", `text-${color}-600 dark:text-${color}-400`)} />
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 dark:text-zinc-500 uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">{sub}</p>
        </div>
      </div>
    </motion.div>
  );
}
