import React from 'react';
import { motion } from 'framer-motion';
import { Thermometer, Droplets, Sun, CloudRain, Fan } from 'lucide-react';
import type { ThermostatData } from '../types';
import { cn } from '../lib/utils';

interface ThermostatWidgetProps {
  data: ThermostatData;
  onSettingsChange?: (data: ThermostatData) => void;
}

const modes = [
  { id: 'cool', icon: CloudRain, label: 'Охлаждение', color: 'text-blue-500' },
  { id: 'heat', icon: Sun, label: 'Обогрев', color: 'text-orange-500' },
  { id: 'auto', icon: Thermometer, label: 'Авто', color: 'text-green-500' },
  { id: 'fan', icon: Fan, label: 'Вентиляция', color: 'text-purple-500' },
] as const;

const fanSpeeds = ['low', 'medium', 'high'] as const;

export const ThermostatWidget: React.FC<ThermostatWidgetProps> = ({
  data,
  onSettingsChange,
}) => {
  console.log('[ThermostatWidget] Rendering with data:', data);

  if (!data) {
    console.warn('[ThermostatWidget] Thermostat data is null or undefined');
    return (
      <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100">
        <p className="text-gray-500">Нет данных термостата</p>
      </div>
    );
  }

  const handleTempChange = (direction: 'up' | 'down') => {
    if (!onSettingsChange) return;
    const newTemp = direction === 'up'
      ? Math.min(data.targetTemp + 1, 30)
      : Math.max(data.targetTemp - 1, 16);
    onSettingsChange({ ...data, targetTemp: newTemp });
  };

  const handleModeChange = (mode: typeof modes[number]['id']) => {
    if (!onSettingsChange) return;
    onSettingsChange({ ...data, mode });
  };

  const handleFanSpeedChange = (speed: typeof fanSpeeds[number]) => {
    if (!onSettingsChange) return;
    onSettingsChange({ ...data, fanSpeed: speed });
  };

  const togglePower = () => {
    if (!onSettingsChange) return;
    onSettingsChange({ ...data, isOn: !data.isOn });
  };

  // Calculate progress for circular display (16-30 range)
  const progress = ((data.targetTemp - 16) / 14) * 100;
  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-secondary-100"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-secondary-900">Термостат</h2>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={togglePower}
          className={cn(
            "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
            data.isOn
              ? "bg-green-100 text-green-600"
              : "bg-secondary-100 text-secondary-500"
          )}
        >
          {data.isOn ? 'ВКЛ' : 'ВЫКЛ'}
        </motion.button>
      </div>

      {/* Circular Temperature Control */}
      <div className="relative flex items-center justify-center mb-6">
        <svg className="w-52 h-52 transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="104"
            cy="104"
            r="90"
            fill="none"
            stroke="#f1f5f9"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <motion.circle
            cx="104"
            cy="104"
            r="90"
            fill="none"
            stroke={data.isOn ? "#0ea5e9" : "#cbd5e1"}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </svg>

        {/* Temperature Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn(
            "text-5xl font-bold",
            data.isOn ? "text-secondary-900" : "text-secondary-300"
          )}>
            {data.targetTemp}°
          </span>
          <span className="text-sm text-secondary-500 mt-1">Цель</span>
        </div>
      </div>

      {/* Temperature Controls */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleTempChange('down')}
          className="w-10 h-10 rounded-full bg-secondary-100 hover:bg-secondary-200 flex items-center justify-center transition-colors"
        >
          <span className="text-2xl text-secondary-600">−</span>
        </motion.button>

        <div className="text-center">
          <p className="text-sm text-secondary-500">Сейчас</p>
          <p className={cn(
            "text-2xl font-semibold",
            data.isOn ? "text-secondary-900" : "text-secondary-300"
          )}>
            {data.temperature}°C
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleTempChange('up')}
          className="w-10 h-10 rounded-full bg-secondary-100 hover:bg-secondary-200 flex items-center justify-center transition-colors"
        >
          <span className="text-2xl text-secondary-600">+</span>
        </motion.button>
      </div>

      {/* Mode Selection */}
      <div className="mb-4">
        <p className="text-sm text-secondary-500 mb-2">Режим</p>
        <div className="grid grid-cols-4 gap-2">
          {modes.map((mode) => {
            const Icon = mode.icon;
            const isActive = data.mode === mode.id && data.isOn;

            return (
              <motion.button
                key={mode.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleModeChange(mode.id)}
                className={cn(
                  "flex flex-col items-center gap-1 p-3 rounded-xl transition-all",
                  isActive
                    ? "bg-primary-50 border-2 border-primary-200"
                    : "bg-secondary-50 border-2 border-transparent hover:bg-secondary-100"
                )}
              >
                <Icon className={cn(
                  "w-5 h-5",
                  isActive ? mode.color : "text-secondary-400"
                )} />
                <span className={cn(
                  "text-xs font-medium",
                  isActive ? "text-secondary-900" : "text-secondary-500"
                )}>
                  {mode.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Fan Speed */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-secondary-500">Скорость вентилятора</p>
          <div className="flex items-center gap-2">
            <Fan className={cn(
              "w-4 h-4",
              data.isOn ? "text-primary-500" : "text-secondary-400"
            )} />
            <span className="text-sm font-medium text-secondary-700 capitalize">
              {data.fanSpeed}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          {fanSpeeds.map((speed) => (
            <motion.button
              key={speed}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleFanSpeedChange(speed)}
              className={cn(
                "flex-1 py-2 rounded-lg text-sm font-medium transition-colors capitalize",
                data.fanSpeed === speed && data.isOn
                  ? "bg-primary-500 text-white"
                  : "bg-secondary-100 text-secondary-600 hover:bg-secondary-200"
              )}
            >
              {speed}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Humidity */}
      <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-xl">
        <div className="flex items-center gap-2">
          <Droplets className="w-5 h-5 text-blue-500" />
          <span className="text-sm text-secondary-600">Влажность</span>
        </div>
        <span className="font-semibold text-secondary-900">{data.humidity}%</span>
      </div>
    </motion.div>
  );
};
