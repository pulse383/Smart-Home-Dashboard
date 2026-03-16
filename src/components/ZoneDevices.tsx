import React from 'react';
import { motion } from 'framer-motion';
import { motion as framerMotion } from 'framer-motion';
import type { Device } from '../types';
import { cn } from '../lib/utils';
import { DeviceCard } from './DeviceCard';

interface ZoneDevicesProps {
  zoneId: string;
  zoneName: string;
  devices: Device[];
  onDeviceToggle: (deviceId: string) => void;
}

export const ZoneDevices: React.FC<ZoneDevicesProps> = ({ zoneId, zoneName, devices, onDeviceToggle }) => {
  console.log(`[ZoneDevices] Rendering zone: ${zoneName}, devices:`, devices);

  if (!devices || devices.length === 0) {
    console.warn(`[ZoneDevices] No devices found for zone: ${zoneName}`);
    return (
      <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100">
        <div className="flex items-center justify-center gap-4">
          <div className="text-4xl">🏠</div>
          <div>
            <p className="text-sm text-gray-500">Нет устройств в зоне</p>
            <p className="text-xs text-gray-400 mt-1">Добавьте устройства в Home Assistant</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Zone Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold text-secondary-900">{zoneName}</h2>
          <p className="text-sm text-secondary-500">{devices.length} устройств</p>
        </div>
        <div className="text-3xl">{getZoneIcon(zoneName)}</div>
      </motion.div>

      {/* Devices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {devices.map((device, index) => (
          <motion.div
            key={device.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <DeviceCard
              device={device}
              onToggle={onDeviceToggle}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

function getZoneIcon(zoneName: string): string {
  const icons: Record<string, string> = {
    'Гостиная': '🛋️',
    'Кухня': '🍳',
    'Спальня': '🛏️',
    'Ванная': '🚿',
    'Кабинет': '💻',
    'Коридор': '🚪',
    'Гараж': '🚗',
    'Улица': '🌳',
    'Кладовая': '📦',
    'Балкон': '🌤️',
    'Детская': '🧸',
    'Лифт': '🛗',
    'Подъезд': '🚶',
    'Хоз. помещение': '🧹',
    'Терраса': '🌴',
  };

  return icons[zoneName] || '🏠';
}
