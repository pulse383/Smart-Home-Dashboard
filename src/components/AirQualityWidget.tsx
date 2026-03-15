import React from 'react';
import { motion } from 'framer-motion';
import { Wind, Activity, Droplets } from 'lucide-react';
import type { AirQuality } from '../types';
import { cn, getAQIColor } from '../lib/utils';

interface AirQualityWidgetProps {
  data: AirQuality;
}

const aqiLabels = {
  good: { text: 'Good', color: 'text-green-600', bg: 'bg-green-100' },
  moderate: { text: 'Moderate', color: 'text-yellow-600', bg: 'bg-yellow-100' },
  poor: { text: 'Poor', color: 'text-orange-600', bg: 'bg-orange-100' },
  hazardous: { text: 'Hazardous', color: 'text-red-600', bg: 'bg-red-100' },
};

export const AirQualityWidget: React.FC<AirQualityWidgetProps> = ({ data }) => {
  const aqiInfo = aqiLabels[data.level];
  const aqiColor = getAQIColor(data.level);

  // Calculate AQI arc (0-200 scale for display)
  const aqiAngle = Math.min((data.aqi / 200) * 180, 180);
  
  const metrics = [
    { label: 'PM2.5', value: data.pm25, unit: 'μg/m³', icon: Wind },
    { label: 'PM10', value: data.pm10, unit: 'μg/m³', icon: Activity },
    { label: 'CO₂', value: data.co2, unit: 'ppm', icon: Droplets },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-secondary-100"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-secondary-900">Air Quality</h2>
          <p className="text-sm text-secondary-500">Indoor environment</p>
        </div>
      </div>

      {/* AQI Gauge */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative w-40 h-20 overflow-hidden">
          {/* Background arc */}
          <div className="absolute inset-0">
            <div className="w-40 h-40 rounded-full border-[12px] border-secondary-100" 
                 style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)' }} />
          </div>
          
          {/* AQI Arc */}
          <svg className="absolute inset-0 w-40 h-20" viewBox="0 0 160 80">
            <defs>
              <linearGradient id="aqiGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="50%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
            </defs>
            <path
              d="M 10 70 A 70 70 0 0 1 150 70"
              fill="none"
              stroke="url(#aqiGradient)"
              strokeWidth="12"
              strokeLinecap="round"
            />
          </svg>
          
          {/* Pointer */}
          <motion.div
            initial={{ rotate: -90 }}
            animate={{ rotate: aqiAngle - 90 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute bottom-0 left-1/2 w-1 h-16 origin-bottom"
            style={{ marginLeft: '-2px' }}
          >
            <div className="w-full h-full bg-secondary-800 rounded-full" />
          </motion.div>
        </div>

        {/* AQI Value */}
        <div className="text-center -mt-2">
          <motion.p
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-4xl font-bold"
            style={{ color: aqiColor }}
          >
            {data.aqi}
          </motion.p>
          <span className={cn(
            "text-sm font-medium px-3 py-1 rounded-full",
            aqiInfo.bg,
            aqiInfo.color
          )}>
            {aqiInfo.text}
          </span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-3 gap-3">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-secondary-50 rounded-xl p-3 text-center"
            >
              <Icon className="w-4 h-4 mx-auto mb-1 text-secondary-500" />
              <p className="text-lg font-semibold text-secondary-900">{metric.value}</p>
              <p className="text-xs text-secondary-500">{metric.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* VOC Indicator */}
      <div className="mt-4 p-3 bg-secondary-50 rounded-xl">
        <div className="flex items-center justify-between">
          <span className="text-sm text-secondary-600">VOC Level</span>
          <span className={cn(
            "font-medium",
            data.voc < 0.5 ? 'text-green-600' : 
            data.voc < 1 ? 'text-yellow-600' : 'text-red-600'
          )}>
            {data.voc} mg/m³
          </span>
        </div>
        <div className="mt-2 h-1.5 bg-secondary-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(data.voc * 100, 100)}%` }}
            transition={{ duration: 0.8 }}
            className={cn(
              "h-full rounded-full",
              data.voc < 0.5 ? 'bg-green-400' : 
              data.voc < 1 ? 'bg-yellow-400' : 'bg-red-400'
            )}
          />
        </div>
      </div>
    </motion.div>
  );
};
