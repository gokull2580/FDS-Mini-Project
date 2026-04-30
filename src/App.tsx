import React, { useState, useMemo, useEffect } from 'react';
import { LayoutDashboard, BarChart3, TrendingUp, Settings, LogOut, Plus, Search, Filter, History, Download, RefreshCw, AlertTriangle, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format, subDays, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { Page, SalesRecord, DashboardSettings, Product } from './types';
import { cn, formatCurrency } from './lib/utils';
import Navigation from './components/Navigation';
import Home from './components/Home';
import Insights from './components/Insights';
import Predictions from './components/Predictions';
import SettingsPage from './components/Settings';
import Login from './components/Login';

// --- DEMO DATA GENERATOR ---
const generateDemoData = (): SalesRecord[] => {
  const products: { name: Product; category: 'Electronics' | 'Accessories'; basePrice: number }[] = [
    { name: 'Laptop', category: 'Electronics', basePrice: 75000 },
    { name: 'Monitor', category: 'Electronics', basePrice: 15000 },
    { name: 'TV', category: 'Electronics', basePrice: 45000 },
    { name: 'Headphones', category: 'Accessories', basePrice: 5000 },
    { name: 'Keyboard', category: 'Accessories', basePrice: 2500 },
  ];

  const data: SalesRecord[] = [];
  const today = new Date();

  for (let i = 0; i < 90; i++) {
    const date = subDays(today, i);
    const numSales = Math.floor(Math.random() * 5) + 1;

    for (let j = 0; j < numSales; j++) {
      const product = products[Math.floor(Math.random() * products.length)];
      const quantity = Math.floor(Math.random() * 3) + 1;
      const price = product.basePrice + (Math.random() * 50 - 25);
      
      data.push({
        id: Math.random().toString(36).substr(2, 9),
        date: format(date, 'yyyy-MM-dd'),
        product: product.name,
        category: product.category,
        price,
        quantity,
        total: price * quantity,
      });
    }
  }
  return data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => localStorage.getItem('auth_token') === 'simulated-token');
  const [userEmail, setUserEmail] = useState<string | null>(() => localStorage.getItem('user_email'));
  const [currentPage, setCurrentPage] = useState<Page>('Home');
  const [salesData, setSalesData] = useState<SalesRecord[]>(() => {
    const saved = localStorage.getItem('sales_data');
    return saved ? JSON.parse(saved) : generateDemoData();
  });
  
  const [settings, setSettings] = useState<DashboardSettings>(() => {
    const saved = localStorage.getItem('dashboard_settings');
    const defaultSettings: DashboardSettings = { currency: '₹', theme: 'light' };
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...parsed, currency: '₹' }; // Force ₹ even if previously saved as $
    }
    return defaultSettings;
  });

  const [dateFilter, setDateFilter] = useState<{ start: string; end: string }>({
    start: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    end: format(new Date(), 'yyyy-MM-dd'),
  });

  const [productFilter, setProductFilter] = useState<string[]>([]);

  // Persistence
  useEffect(() => {
    localStorage.setItem('sales_data', JSON.stringify(salesData));
  }, [salesData]);

  useEffect(() => {
    localStorage.setItem('dashboard_settings', JSON.stringify(settings));
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  const userSpecificData = useMemo(() => {
    return salesData.filter(item => !item.userId || item.userId === userEmail);
  }, [salesData, userEmail]);

  const filteredData = useMemo(() => {
    return userSpecificData.filter(item => {
      const dateMatch = isWithinInterval(parseISO(item.date), {
        start: parseISO(dateFilter.start),
        end: parseISO(dateFilter.end),
      });
      const productMatch = productFilter.length === 0 || productFilter.includes(item.product);
      return dateMatch && productMatch;
    });
  }, [userSpecificData, dateFilter, productFilter]);

  const addRecord = (record: Omit<SalesRecord, 'id'>) => {
    const newRecord: SalesRecord = { 
      ...record, 
      id: Math.random().toString(36).substr(2, 9),
      userId: userEmail || undefined
    };
    setSalesData(prev => [newRecord, ...prev]);
  };

  const resetData = () => {
    setSalesData(generateDemoData());
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_email');
    setIsAuthenticated(false);
    setUserEmail(null);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'Home':
        return <Home data={userSpecificData} onAdd={addRecord} settings={settings} />;
      case 'Insights':
        return (
          <Insights 
            data={filteredData} 
            settings={settings}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            productFilter={productFilter}
            setProductFilter={setProductFilter}
            allProducts={Array.from(new Set(userSpecificData.map(d => d.product)))}
          />
        );
      case 'Predictions':
        return <Predictions data={userSpecificData} settings={settings} />;
      case 'Settings':
        return <SettingsPage settings={settings} setSettings={setSettings} onLogout={handleLogout} email={userEmail} />;
      default:
        return <div>Page coming soon...</div>;
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={(email) => {
      localStorage.setItem('auth_token', 'simulated-token');
      localStorage.setItem('user_email', email);
      setUserEmail(email);
      setIsAuthenticated(true);
    }} />;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-zinc-50 font-sans">
      <Navigation 
        current={currentPage} 
        onChange={(p) => p === 'Logout' ? handleLogout() : setCurrentPage(p)} 
      />
      
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="max-w-7xl mx-auto h-full"
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

