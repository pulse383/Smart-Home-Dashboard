import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import type { EnergyUsage } from '../types';

interface EnergyUsageChartProps {
  data: EnergyUsage[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-4 py-2 rounded-lg shadow-lg border border-secondary-100">
        <p className="text-sm font-medium text-secondary-900">{label}</p>
        <p className="text-sm text-primary-600">
          {payload[0].value} kWh
        </p>
        {payload[0].payload.cost && (
          <p className="text-xs text-secondary-500">
            ${payload[0].payload.cost.toFixed(2)}
          </p>
        )}
      </div>
    );
  }
  return null;
};

export const EnergyUsageChart: React.FC<EnergyUsageChartProps> = ({ data }) => {
  const totalUsage = data.reduce((acc, item) => acc + item.usage, 0);
  const avgUsage = totalUsage / data.length;
  const maxUsage = Math.max(...data.map(d => d.usage));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-secondary-100"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-secondary-900">Energy Usage</h2>
          <p className="text-sm text-secondary-500">Weekly consumption</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-secondary-900">{totalUsage.toFixed(1)}</p>
          <p className="text-sm text-secondary-500">kWh total</p>
        </div>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis 
              dataKey="day" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#64748b' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#64748b' }}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
            <Bar 
              dataKey="usage" 
              radius={[6, 6, 0, 0]}
              maxBarSize={40}
            >
              {data.map((entry, index) => {
                const isHighest = entry.usage === maxUsage;
                return (
                  <Cell 
                    key={`cell-${index}`}
                    fill={isHighest ? '#0ea5e9' : '#bae6fd'}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-secondary-100">
        <div className="text-center">
          <p className="text-sm text-secondary-500">Average</p>
          <p className="font-semibold text-secondary-900">{avgUsage.toFixed(1)} kWh</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-secondary-500">Peak</p>
          <p className="font-semibold text-secondary-900">{maxUsage.toFixed(1)} kWh</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-secondary-500">Cost</p>
          <p className="font-semibold text-secondary-900">
            ${(data.reduce((acc, item) => acc + (item.cost || 0), 0)).toFixed(2)}
          </p>
        </div>
      </div>
    </motion.div>
  );
};
