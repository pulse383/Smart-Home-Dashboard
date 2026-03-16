import React from 'react';
import { motion } from 'framer-motion';
import { Cloud, Sun, CloudRain, Snowflake, Wind, Thermometer } from 'lucide-react';
import { cn } from '../lib/utils';

interface WeatherData {
  temperature: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'windy';
  humidity: number;
  windSpeed: number;
  feelsLike: number;
  location: string;
}

interface WeatherWidgetProps {
  weather: WeatherData;
}

const weatherConfig = {
  sunny: {
    icon: Sun,
    color: 'text-orange-500',
    bg: 'bg-orange-50',
    gradient: 'from-orange-400 to-yellow-400',
    label: 'Ясно'
  },
  cloudy: {
    icon: Cloud,
    color: 'text-gray-500',
    bg: 'bg-gray-50',
    gradient: 'from-gray-400 to-gray-300',
    label: 'Облачно'
  },
  rainy: {
    icon: CloudRain,
    color: 'text-blue-500',
    bg: 'bg-blue-50',
    gradient: 'from-blue-400 to-blue-300',
    label: 'Дождь'
  },
  snowy: {
    icon: Snowflake,
    color: 'text-cyan-500',
    bg: 'bg-cyan-50',
    gradient: 'from-cyan-400 to-cyan-300',
    label: 'Снег'
  },
  windy: {
    icon: Wind,
    color: 'text-teal-500',
    bg: 'bg-teal-50',
    gradient: 'from-teal-400 to-teal-300',
    label: 'Ветрено'
  },
};

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ weather }) => {
  console.log('[WeatherWidget] Rendering with data:', weather);
  
  if (!weather) {
    console.warn('[WeatherWidget] Weather data is null or undefined');
    return (
      <div className="bg-white rounded-2xl p-3 shadow-md border border-gray-100 w-[280px] h-[240px] flex items-center justify-center">
        <p className="text-gray-500 text-xs">Нет данных о погоде</p>
      </div>
    );
  }

  const config = weatherConfig[weather.condition];
  const Icon = config?.icon;

  if (!config) {
    console.warn('[WeatherWidget] Unknown weather condition:', weather.condition);
    return (
      <div className="bg-white rounded-2xl p-3 shadow-md border border-gray-100 w-[280px] h-[240px] flex items-center justify-center">
        <p className="text-gray-500 text-xs">Неизвестные погодные условия</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.45 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="bg-gradient-to-br from-primary-500/10 to-accent-500/10 backdrop-blur-sm rounded-2xl p-3 shadow-lg border border-white/20 overflow-hidden relative w-[280px] h-[240px] flex-shrink-0"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear'
          }}
          className="absolute -top-12 -right-12 w-28 h-28 bg-primary-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            rotate: -360,
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear'
          }}
          className="absolute -bottom-12 -left-12 w-32 h-32 bg-accent-500/10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-sm font-semibold text-secondary-900">Погода</h2>
            <p className="text-[10px] text-secondary-500 truncate max-w-[150px]">{weather.location}</p>
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            className="w-7 h-7 bg-white/50 rounded-full flex items-center justify-center backdrop-blur-sm"
          >
            <Icon className={cn('w-4 h-4', config.color)} />
          </motion.div>
        </div>

        {/* Temperature Display */}
        <div className="flex items-center justify-center mb-2">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            className="relative"
          >
            <Thermometer className="absolute -left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-500" />
            <div className="flex items-end gap-1">
              <motion.span
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-4xl font-bold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent"
              >
                {weather.temperature}°
              </motion.span>
              <span className="text-sm text-secondary-400 mb-1">C</span>
            </div>
          </motion.div>
        </div>

        {/* Condition */}
        <div className="text-center mb-2">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm font-semibold text-secondary-900"
          >
            {config.label}
          </motion.p>
          <p className="text-[10px] text-secondary-500">Ощущается как {weather.feelsLike}°C</p>
        </div>

        {/* Weather Details */}
        <div className="grid grid-cols-2 gap-2 mt-auto">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/50 backdrop-blur-sm rounded-lg p-2 text-center"
          >
            <div className="flex items-center justify-center gap-1 mb-1">
              <Cloud className="w-3 h-3 text-primary-500" />
              <span className="text-[9px] text-secondary-500">Влажность</span>
            </div>
            <p className="text-sm font-bold text-secondary-900">{weather.humidity}%</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/50 backdrop-blur-sm rounded-lg p-2 text-center"
          >
            <div className="flex items-center justify-center gap-1 mb-1">
              <Wind className="w-3 h-3 text-primary-500" />
              <span className="text-[9px] text-secondary-500">Ветер</span>
            </div>
            <p className="text-sm font-bold text-secondary-900">{weather.windSpeed} м/с</p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
