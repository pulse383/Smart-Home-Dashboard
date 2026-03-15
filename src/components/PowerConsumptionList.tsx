import React from 'react';
import { motion } from 'framer-motion';
import { Snowflake, Lightbulb, Tv, Speaker } from 'lucide-react';

interface PowerItem {
  name: string;
  power: number;
  icon: string;
}

interface PowerConsumptionListProps {
  data: PowerItem[];
}

const iconMap: Record<string, React.ElementType> = {
  snowflake: Snowflake,
  lightbulb: Lightbulb,
  tv: Tv,
  speaker: Speaker,
};

const colorMap: Record<string, { bg: string; icon: string }> = {
  snowflake: { bg: 'bg-blue-50', icon: 'text-blue-500' },
  lightbulb: { bg: 'bg-yellow-50', icon: 'text-yellow-500' },
  tv: { bg: 'bg-purple-50', icon: 'text-purple-500' },
  speaker: { bg: 'bg-green-50', icon: 'text-green-500' },
};

export const PowerConsumptionList: React.FC<PowerConsumptionListProps> = ({ data }) => {
  const maxPower = Math.max(...data.map(d => d.power));
  const totalPower = data.reduce((acc, item) => acc + item.power, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-secondary-100"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-secondary-900">Power Consumption</h2>
          <p className="text-sm text-secondary-500">By device type</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-secondary-900">{totalPower}</p>
          <p className="text-sm text-secondary-500">Watts total</p>
        </div>
      </div>

      <div className="space-y-4">
        {data.map((item, index) => {
          const Icon = iconMap[item.icon] || Lightbulb;
          const colors = colorMap[item.icon] || colorMap.lightbulb;
          const percentage = (item.power / maxPower) * 100;

          return (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg ${colors.bg} flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${colors.icon}`} />
                  </div>
                  <span className="text-sm font-medium text-secondary-700">{item.name}</span>
                </div>
                <span className="text-sm font-semibold text-secondary-900">{item.power}W</span>
              </div>
              
              <div className="relative h-2 bg-secondary-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
                  className={`absolute top-0 left-0 h-full rounded-full ${
                    item.icon === 'snowflake' ? 'bg-blue-400' :
                    item.icon === 'lightbulb' ? 'bg-yellow-400' :
                    item.icon === 'tv' ? 'bg-purple-400' :
                    'bg-green-400'
                  }`}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-secondary-100">
        <div className="flex items-center justify-between text-sm">
          <span className="text-secondary-500">Active devices</span>
          <span className="font-medium text-secondary-900">{data.length} devices</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="text-secondary-500">Est. daily cost</span>
          <span className="font-medium text-secondary-900">
            ${((totalPower / 1000) * 24 * 0.12).toFixed(2)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
