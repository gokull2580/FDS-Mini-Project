
import React from 'react';
import { LayoutDashboard, BarChart3, TrendingUp, Settings, LogOut } from 'lucide-react';
import { Page } from '../types';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface NavigationProps {
  current: Page;
  onChange: (page: Page) => void;
}

const navItems: { id: Page; icon: any; label: string }[] = [
  { id: 'Home', icon: LayoutDashboard, label: 'Home' },
  { id: 'Insights', icon: BarChart3, label: 'Insights' },
  { id: 'Predictions', icon: TrendingUp, label: 'Predictions' },
  { id: 'Settings', icon: Settings, label: 'Settings' },
  { id: 'Logout', icon: LogOut, label: 'Logout' },
];

export default function Navigation({ current, onChange }: NavigationProps) {
  return (
    <nav className="w-full md:w-64 bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 flex flex-col h-auto md:h-screen sticky top-0 z-50">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <TrendingUp className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight">Sales Analysis</span>
        </div>

        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = current === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group relative",
                  isActive 
                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400" 
                    : "text-gray-500 hover:bg-gray-50 dark:text-zinc-400 dark:hover:bg-zinc-800/50"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute left-0 w-1 h-6 bg-indigo-600 dark:bg-indigo-500 rounded-r-full"
                  />
                )}
                <Icon className={cn("w-5 h-5", isActive ? "text-indigo-600 dark:text-indigo-400" : "text-gray-400 dark:text-zinc-500")} />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
