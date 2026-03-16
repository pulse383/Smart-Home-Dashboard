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
      <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100">
        <p className="text-gray-500">Нет данных о погоде</p>
      </div>
    );
  }

  const config = weatherConfig[weather.condition];
  const Icon = config?.icon;

  if (!config) {
    console.warn('[WeatherWidget] Unknown weather condition:', weather.condition);
    return (
      <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100">
        <p className="text-gray-500">Неизвестные погодные условия</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.45 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="bg-gradient-to-br from-primary-500/10 to-accent-500/10 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-white/20 overflow-hidden relative"
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
            ease: "linear"
          }}
          className="absolute -top-20 -right-20 w-60 h-60 bg-primary-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            rotate: -360,
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-20 -left-20 w-72 h-72 bg-accent-500/10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-secondary-900">Погода</h2>
            <p className="text-sm text-secondary-500">{weather.location}</p>
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 bg-white/50 rounded-full flex items-center justify-center backdrop-blur-sm"
          >
            <Icon className={cn("w-6 h-6", config.color)} />
          </motion.div>
        </div>

        {/* Temperature Display */}
        <div className="flex items-center justify-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="relative"
          >
            <Thermometer className="absolute -left-8 top-1/2 -translate-y-1/2 w-8 h-8 text-primary-500" />
            <div className="flex items-end gap-2">
              <motion.span
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-7xl font-bold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent"
              >
                {weather.temperature}°
              </motion.span>
              <span className="text-2xl text-secondary-400 mb-2">C</span>
            </div>
          </motion.div>
        </div>

        {/* Condition */}
        <div className="text-center mb-6">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl font-semibold text-secondary-900"
          >
            {config.label}
          </motion.p>
          <p className="text-sm text-secondary-500">Ощущается как {weather.feelsLike}°C</p>
        </div>

        {/* Weather Details */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Cloud className="w-5 h-5 text-primary-500" />
              <span className="text-xs text-secondary-500">Влажность</span>
            </div>
            <p className="text-2xl font-bold text-secondary-900">{weather.humidity}%</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Wind className="w-5 h-5 text-primary-500" />
              <span className="text-xs text-secondary-500">Ветер</span>
            </div>
            <p className="text-2xl font-bold text-secondary-900">{weather.windSpeed} м/с</p>
          </motion.div>
        </div>

        {/* Hourly Forecast */}
        <div className="mt-6 pt-6 border-t border-white/20">
          <h3 className="text-sm font-semibold text-secondary-900 mb-4">Прогноз на час</h3>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide">
            {[1, 2, 3, 4, 5].map((hour, index) => (
              <motion.div
                key={hour}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex-shrink-0 bg-white/50 backdrop-blur-sm rounded-2xl p-3 text-center min-w-[70px]"
              >
                <p className="text-xs text-secondary-500 mb-2">{hour}:00</p>
                <div className="w-10 h-10 mx-auto mb-2 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-full flex items-center justify-center">
                  <Sun className="w-5 h-5 text-orange-500" />
                </div>
                <p className="text-sm font-semibold text-secondary-900">
                  {weather.temperature + (index * 2)}°
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
