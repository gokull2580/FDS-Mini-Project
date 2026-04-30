
import React, { useMemo } from 'react';
import { SalesRecord, DashboardSettings } from '../types';
import { cn, formatCurrency } from '../lib/utils';
import { 
  ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Scatter
} from 'recharts';
import { format, parseISO, addDays, startOfDay, differenceInDays } from 'date-fns';
import { TrendingUp, Calendar, Zap, Info } from 'lucide-react';
import { motion } from 'motion/react';
import { linearRegression, predict } from '../lib/math';

interface PredictionsProps {
  data: SalesRecord[];
  settings: DashboardSettings;
}

export default function Predictions({ data, settings }: PredictionsProps) {
  const forecast = useMemo(() => {
    if (data.length < 5) return null;

    // 1. Group daily revenue
    const dailyTotals = data.reduce((acc, curr) => {
      const date = curr.date;
      acc[date] = (acc[date] || 0) + curr.total;
      return acc;
    }, {} as Record<string, number>);

    // 2. Prepare data for regression
    const sortedDates = Object.keys(dailyTotals).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    const minDate = new Date(sortedDates[0]);
    
    const regressionPoints = sortedDates.map(date => ({
      x: differenceInDays(new Date(date), minDate),
      y: dailyTotals[date]
    }));

    // 3. Compute regression
    const { m, b } = linearRegression(regressionPoints);

    // 4. Generate next 30 days
    const lastDateStr = sortedDates[sortedDates.length - 1];
    const lastDate = new Date(lastDateStr);
    const futureData = [];

    for (let i = 1; i <= 30; i++) {
      const futureDate = addDays(lastDate, i);
      const x = differenceInDays(futureDate, minDate);
      const predictedY = Math.max(0, predict(m, b, x));
      
      futureData.push({
        date: format(futureDate, 'yyyy-MM-dd'),
        predicted: predictedY,
        isForecast: true
      });
    }

    // Combine for plotting
    const historicalPlot = regressionPoints.map((p, i) => ({
      date: sortedDates[i],
      revenue: p.y,
      trend: predict(m, b, p.x),
      isForecast: false
    }));

    return {
      plotData: [...historicalPlot, ...futureData],
      m,
      b,
      totalForecastedRevenue: futureData.reduce((acc, c) => acc + c.predicted, 0)
    };
  }, [data]);

  if (!forecast) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20 bg-white dark:bg-zinc-900 rounded-2xl border border-dashed border-gray-200 dark:border-zinc-800">
        <Zap className="w-12 h-12 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-400">Insufficient Data for Predictions</h3>
        <p className="text-sm text-gray-500">Need at least 5 days of sales history to calculate trends.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Predictive Analytics</h1>
        <p className="text-gray-500 dark:text-zinc-400">AI-powered sales forecasting using linear regression modeling.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm h-[500px]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold italic">Sales Projection (Next 30 Days)</h2>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 text-xs">
                <span className="w-3 h-3 bg-indigo-500 rounded-full"></span>
                <span className="opacity-70">Actual</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="w-3 h-3 border border-dashed border-indigo-400 rounded-full"></span>
                <span className="opacity-70">Forecast</span>
              </div>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height="85%">
            <ComposedChart data={forecast.plotData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
              <XAxis 
                dataKey="date" 
                tickFormatter={(str) => format(parseISO(str), 'MMM dd')}
                strokeOpacity={0.3}
                fontSize={10}
              />
              <YAxis strokeOpacity={0.3} fontSize={10} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                formatter={(val: number) => [formatCurrency(val, settings.currency), 'Value']}
              />
              <Legend />
              <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} opacity={0.6} name="Actual Revenue" />
              <Line 
                type="monotone" 
                dataKey="predicted" 
                stroke="#6366f1" 
                strokeWidth={2} 
                strokeDasharray="5 5" 
                dot={false}
                name="Projected Trend" 
              />
              <Line 
                type="monotone" 
                dataKey="trend" 
                stroke="#a855f7" 
                strokeWidth={1} 
                dot={false}
                name="Best Fit Line"
                opacity={0.3}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-6">
          <div className="bg-indigo-600 rounded-2xl p-6 text-white">
            <h4 className="text-sm font-medium text-indigo-100 mb-1">Forecast Revenue</h4>
            <p className="text-3xl font-bold mb-1">{formatCurrency(forecast.totalForecastedRevenue, settings.currency)}</p>
            <p className="text-xs text-indigo-200">Estimated for next 30 days</p>
            
            <div className="mt-6 pt-6 border-t border-indigo-500/50">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="opacity-70">Trend Momentum</span>
                <span>{forecast.m > 0 ? 'Positive ↑' : 'Negative ↓'}</span>
              </div>
              <div className="w-full bg-indigo-700 h-1.5 rounded-full overflow-hidden">
                <div 
                  className={cn("h-full rounded-full bg-white", forecast.m > 0 ? "w-3/4" : "w-1/4")} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
