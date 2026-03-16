import React from 'react';
import { motion } from 'framer-motion';
import { CloudRain, Wind, Droplets, Thermometer } from 'lucide-react';
import { cn } from '../lib/utils';

interface WeatherData {
  temperature: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'windy';
  humidity: number;
  windSpeed: number;
  feelsLike: number;
  location: string;
}

interface MiniWeatherWidgetProps {
  weather: WeatherData;
}

const weatherConfig = {
  sunny: {
    icon: '☀️',
    color: 'text-orange-500',
    bg: 'bg-orange-50'
  },
  cloudy: {
    icon: '☁️',
    color: 'text-gray-500',
    bg: 'bg-gray-50'
  },
  rainy: {
    icon: '🌧️',
    color: 'text-blue-500',
    bg: 'bg-blue-50'
  },
  snowy: {
    icon: '❄️',
    color: 'text-cyan-500',
    bg: 'bg-cyan-50'
  },
  windy: {
    icon: '💨',
    color: 'text-teal-500',
    bg: 'bg-teal-50'
  }
};

export const MiniWeatherWidget: React.FC<MiniWeatherWidgetProps> = ({ weather }) => {
  const config = weatherConfig[weather.condition];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-primary-500/20 to-accent-500/20 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-white/30 overflow-hidden relative min-w-[200px] flex-shrink-0"
    >
      {/* Animated Background */}
      <motion.div
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute -top-10 -right-10 w-30 h-30 bg-primary-500/20 rounded-full blur-xl"
      />
      
      <div className="relative z-10 flex items-center gap-3">
        {/* Animated Icon */}
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-3xl"
        >
          {config.icon}
        </motion.div>
        
        {/* Weather Info */}
        <div className="flex flex-col">
          <span className="text-lg font-bold text-secondary-900">{weather.temperature}°C</span>
          <span className="text-xs text-secondary-600 capitalize">{config.color === 'text-blue-500' ? 'Дождь' : config.color === 'text-orange-500' ? 'Ясно' : 'Облачно'}</span>
        </div>
        
        {/* Additional Info */}
        <div className="flex gap-2 ml-auto">
          <Droplets className="w-4 h-4 text-blue-500" />
          <Wind className="w-4 h-4 text-gray-500" />
        </div>
      </div>
    </motion.div>
  );
};
