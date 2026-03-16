import React from 'react';
import { motion } from 'framer-motion';
import { Tv, Speaker, Wifi, Heater, Plug, Router, Lightbulb } from 'lucide-react';
import type { Device } from '../types';
import { cn, formatPower } from '../lib/utils';

interface DeviceCardProps {
  device: Device;
  onToggle: (deviceId: string) => void;
  index?: number;
}

const iconMap: Record<string, React.ElementType> = {
  tv: Tv,
  speaker: Speaker,
  wifi: Wifi,
  heater: Heater,
  socket: Plug,
  router: Router,
  lamp: Lightbulb,
};

const colorMap: Record<string, { bg: string; icon: string; active: string }> = {
  tv: { bg: 'bg-blue-50', icon: 'text-blue-500', active: 'bg-blue-500' },
  speaker: { bg: 'bg-purple-50', icon: 'text-purple-500', active: 'bg-purple-500' },
  wifi: { bg: 'bg-green-50', icon: 'text-green-500', active: 'bg-green-500' },
  heater: { bg: 'bg-orange-50', icon: 'text-orange-500', active: 'bg-orange-500' },
  socket: { bg: 'bg-yellow-50', icon: 'text-yellow-500', active: 'bg-yellow-500' },
  router: { bg: 'bg-indigo-50', icon: 'text-indigo-500', active: 'bg-indigo-500' },
  lamp: { bg: 'bg-amber-50', icon: 'text-amber-500', active: 'bg-amber-500' },
};

export const DeviceCard: React.FC<DeviceCardProps> = ({
  device,
  onToggle,
  index = 0
}) => {
  console.log('[DeviceCard] Rendering device:', device);

  if (!device) {
    console.warn('[DeviceCard] Device is null or undefined');
    return (
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-secondary-100">
        <p className="text-gray-500 text-center py-4">Нет данных об устройстве</p>
      </div>
    );
  }

  const Icon = iconMap[device.type] || Plug;
  const colors = colorMap[device.type] || colorMap.socket;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className={cn(
        "relative bg-white rounded-2xl p-5 shadow-sm border border-secondary-100 cursor-pointer transition-all duration-300",
        device.isOn && "shadow-lg"
      )}
    >
      {/* Active Indicator */}
      {device.isOn && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-3 right-3 w-2 h-2 bg-green-400 rounded-full"
          style={{ boxShadow: '0 0 8px rgba(74, 222, 128, 0.6)' }}
        />
      )}

      {/* Icon Container */}
      <div className={cn(
        "w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-colors duration-300",
        device.isOn ? colors.bg : 'bg-secondary-100'
      )}>
        <Icon className={cn(
          "w-7 h-7 transition-colors duration-300",
          device.isOn ? colors.icon : 'text-secondary-400'
        )} />
      </div>

      {/* Device Info */}
      <div className="space-y-1">
        <h3 className="font-semibold text-secondary-900 truncate">{device.name}</h3>
        <p className="text-sm text-secondary-500">{device.room}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className={cn(
            "text-sm font-medium",
            device.isOn ? "text-primary-600" : "text-secondary-400"
          )}>
            {formatPower(device.powerConsumption)}
          </span>
          <span className="text-secondary-300">•</span>
          <span className={cn(
            "text-sm",
            device.isOn ? "text-green-500" : "text-secondary-400"
          )}>
            {device.isOn ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      {/* Toggle Switch */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={(e) => {
          e.stopPropagation();
          onToggle(device.id);
        }}
        className={cn(
          "absolute bottom-5 right-5 w-12 h-6 rounded-full transition-colors duration-300",
          device.isOn ? colors.active : 'bg-secondary-200'
        )}
      >
        <motion.div
          animate={{ x: device.isOn ? 24 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="w-5 h-5 bg-white rounded-full shadow-md mt-0.5"
        />
      </motion.button>
    </motion.div>
  );
};
