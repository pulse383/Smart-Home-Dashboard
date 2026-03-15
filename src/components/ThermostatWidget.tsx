import React from 'react';
import { motion } from 'framer-motion';
import { Thermometer, Droplets, Sun, CloudRain, Fan } from 'lucide-react';
import type { ThermostatSettings } from '../types';
import { cn } from '../lib/utils';

interface ThermostatWidgetProps {
  settings: ThermostatSettings;
  onSettingsChange: (settings: ThermostatSettings) => void;
}

const modes = [
  { id: 'cool', icon: CloudRain, label: 'Cool', color: 'text-blue-500' },
  { id: 'heat', icon: Sun, label: 'Heat', color: 'text-orange-500' },
  { id: 'auto', icon: Thermometer, label: 'Auto', color: 'text-green-500' },
  { id: 'fan', icon: Fan, label: 'Fan', color: 'text-purple-500' },
] as const;

const fanSpeeds = ['low', 'medium', 'high'] as const;

export const ThermostatWidget: React.FC<ThermostatWidgetProps> = ({
  settings,
  onSettingsChange,
}) => {

  const handleTempChange = (direction: 'up' | 'down') => {
    const newTemp = direction === 'up' 
      ? Math.min(settings.targetTemp + 1, 30)
      : Math.max(settings.targetTemp - 1, 16);
    onSettingsChange({ ...settings, targetTemp: newTemp });
  };

  const handleModeChange = (mode: typeof modes[number]['id']) => {
    onSettingsChange({ ...settings, mode });
  };

  const handleFanSpeedChange = (speed: typeof fanSpeeds[number]) => {
    onSettingsChange({ ...settings, fanSpeed: speed });
  };

  const togglePower = () => {
    onSettingsChange({ ...settings, isOn: !settings.isOn });
  };

  // Calculate progress for circular display (16-30 range)
  const progress = ((settings.targetTemp - 16) / 14) * 100;
  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-secondary-100"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-secondary-900">Thermostat</h2>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={togglePower}
          className={cn(
            "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
            settings.isOn 
              ? "bg-green-100 text-green-600" 
              : "bg-secondary-100 text-secondary-500"
          )}
        >
          {settings.isOn ? 'ON' : 'OFF'}
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
            stroke={settings.isOn ? "#0ea5e9" : "#cbd5e1"}
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
            settings.isOn ? "text-secondary-900" : "text-secondary-300"
          )}>
            {settings.targetTemp}°
          </span>
          <span className="text-sm text-secondary-500 mt-1">Target</span>
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
          <p className="text-sm text-secondary-500">Current</p>
          <p className={cn(
            "text-2xl font-semibold",
            settings.isOn ? "text-secondary-900" : "text-secondary-300"
          )}>
            {settings.temperature}°C
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
        <p className="text-sm text-secondary-500 mb-2">Mode</p>
        <div className="grid grid-cols-4 gap-2">
          {modes.map((mode) => {
            const Icon = mode.icon;
            const isActive = settings.mode === mode.id && settings.isOn;
            
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
          <p className="text-sm text-secondary-500">Fan Speed</p>
          <div className="flex items-center gap-2">
            <Fan className={cn(
              "w-4 h-4",
              settings.isOn ? "text-primary-500" : "text-secondary-400"
            )} />
            <span className="text-sm font-medium text-secondary-700 capitalize">
              {settings.fanSpeed}
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
                settings.fanSpeed === speed && settings.isOn
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
          <span className="text-sm text-secondary-600">Humidity</span>
        </div>
        <span className="font-semibold text-secondary-900">{settings.humidity}%</span>
      </div>
    </motion.div>
  );
};
