
import React from 'react';
import { DashboardSettings } from '../types';
import { User, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';

interface SettingsProps {
  settings: DashboardSettings;
  setSettings: (s: DashboardSettings) => void;
  onLogout: () => void;
  email: string | null;
}

export default function SettingsPage({ settings, setSettings, onLogout, email }: SettingsProps) {
  const userInitial = email ? email.substring(0, 2).toUpperCase() : 'AD';

  return (
    <div className="max-w-3xl space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
        <p className="text-gray-500 dark:text-zinc-400">Configure your workspace preferences.</p>
      </header>

      <div className="space-y-6">
        {/* Profile Section */}
        <section className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-500" />
            Account Profile
          </h2>
          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl border border-gray-100 dark:border-zinc-800">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-indigo-500/20">
              {userInitial}
            </div>
            <div className="text-center sm:text-left">
              <p className="font-bold text-lg leading-tight">Administrator</p>
              <p className="text-sm text-gray-500">{email || 'Not authenticated'}</p>
            </div>
            <button 
              onClick={onLogout}
              className="sm:ml-auto w-full sm:w-auto flex items-center justify-center gap-2 text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 px-4 py-2 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </section>

        {/* Preferences */}
        <section className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm">
          <h2 className="text-lg font-semibold mb-6">Interface Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="max-w-[70%]">
                <p className="font-medium">Dark Mode Appearance</p>
                <p className="text-sm text-gray-500">Enable a high-contrast dark theme for better visual focus and reduced eye strain.</p>
              </div>
              <button 
                onClick={() => setSettings({ ...settings, theme: settings.theme === 'light' ? 'dark' : 'light' })}
                className={cn(
                  "relative w-14 h-7 rounded-full transition-all duration-300 focus:outline-none ring-offset-2 ring-offset-white dark:ring-offset-zinc-900 focus:ring-2 focus:ring-indigo-500",
                  settings.theme === 'dark' ? "bg-indigo-600" : "bg-gray-200"
                )}
              >
                <span 
                  className={cn(
                    "absolute top-1 left-1 bg-white w-5 h-5 rounded-full transition-transform duration-300 shadow-md",
                    settings.theme === 'dark' ? "translate-x-7" : "translate-x-0"
                  )}
                />
              </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
