import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, MoreHorizontal, Home } from 'lucide-react';
import type { Room as RoomType, Device } from '../types';
import { cn } from '../lib/utils';
import { Tv, Speaker, Wifi, Heater, Plug, Router, Lightbulb } from 'lucide-react';

interface ZonesWidgetProps {
  rooms: RoomType[];
  onDeviceToggle: (deviceId: string) => void;
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

export const ZonesWidget: React.FC<ZonesWidgetProps> = ({ rooms, onDeviceToggle }) => {
  console.log('[ZonesWidget] Rendering with rooms:', rooms);
  
  if (!rooms || rooms.length === 0) {
    console.warn('[ZonesWidget] No rooms provided');
    return (
      <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100">
        <p className="text-gray-500">Нет данных о зонах</p>
      </div>
    );
  }

  const [activeRoom, setActiveRoom] = useState<string | null>(rooms[0]?.id || null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 280;
    const newPosition = direction === 'left'
      ? Math.max(0, scrollPosition - scrollAmount)
      : Math.min(container.scrollWidth - container.clientWidth, scrollPosition + scrollAmount);

    container.scrollTo({ left: newPosition, behavior: 'smooth' });
    setScrollPosition(newPosition);
  };

  const currentRoom = rooms.find(r => r.id === activeRoom);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-secondary-100"
    >
      {/* Room Tabs */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {rooms.map((room) => (
            <motion.button
              key={room.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveRoom(room.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                activeRoom === room.id
                  ? "bg-primary-500 text-white shadow-md"
                  : "bg-secondary-100 text-secondary-600 hover:bg-secondary-200"
              )}
            >
              <span className="text-lg">{room.icon}</span>
              <span>{room.name}</span>
              <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                {room.devices.filter(d => d.isOn).length}
              </span>
            </motion.button>
          ))}
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-8 h-8 rounded-full bg-secondary-100 flex items-center justify-center"
        >
          <MoreHorizontal className="w-4 h-4 text-secondary-600" />
        </motion.button>
      </div>

      {/* Devices Scroll Area */}
      <div className="relative">
        {/* Left Scroll Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleScroll('left')}
          disabled={scrollPosition === 0}
          className={cn(
            "absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center",
            "border border-secondary-200 disabled:opacity-30 disabled:cursor-not-allowed",
            "hover:bg-secondary-50 transition-colors"
          )}
        >
          <ChevronLeft className="w-5 h-5 text-secondary-600" />
        </motion.button>

        {/* Scroll Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <AnimatePresence mode="wait">
            {currentRoom && (
              <motion.div
                key={activeRoom}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex gap-4 min-w-max"
              >
                {currentRoom.devices.map((device, index) => (
                  <DeviceCard
                    key={device.id}
                    device={device}
                    onToggle={onDeviceToggle}
                    index={index}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Scroll Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleScroll('right')}
          disabled={scrollPosition >= (scrollContainerRef.current?.scrollWidth || 0) - (scrollContainerRef.current?.clientWidth || 0)}
          className={cn(
            "absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center",
            "border border-secondary-200 disabled:opacity-30 disabled:cursor-not-allowed",
            "hover:bg-secondary-50 transition-colors"
          )}
        >
          <ChevronRight className="w-5 h-5 text-secondary-600" />
        </motion.button>
      </div>

      {/* Room Info */}
      {currentRoom && (
        <div className="mt-4 pt-4 border-t border-secondary-100 flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-secondary-500">
              <Home className="w-4 h-4" />
              <span>🌡️ {currentRoom.temperature?.toFixed(1)}°C</span>
            </div>
            <div className="flex items-center gap-2 text-secondary-500">
              <span>💧</span>
              <span>{currentRoom.humidity?.toFixed(0)}%</span>
            </div>
          </div>
          <span className="text-secondary-400">
            {currentRoom.devices.length} устройств
          </span>
        </div>
      )}
    </motion.div>
  );
};

const DeviceCard: React.FC<{
  device: Device;
  onToggle: (deviceId: string) => void;
  index: number;
}> = ({ device, onToggle, index }) => {
  const Icon = iconMap[device.type] || iconMap.socket;
  const colors = colorMap[device.type] || colorMap.socket;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.03, y: -2 }}
      onClick={() => onToggle(device.id)}
      className={cn(
        "relative bg-white rounded-2xl p-4 shadow-sm border border-secondary-100 cursor-pointer transition-all duration-300",
        device.isOn && "shadow-lg"
      )}
    >
      {/* Active Indicator */}
      {device.isOn && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-3 right-3 w-2.5 h-2.5 bg-green-400 rounded-full"
          style={{ boxShadow: '0 0 8px rgba(74, 222, 128, 0.6)' }}
        />
      )}

      {/* Icon */}
      <div className={cn(
        "w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors duration-300",
        device.isOn ? colors.bg : 'bg-secondary-100'
      )}>
        <Icon className={cn(
          "w-6 h-6 transition-colors duration-300",
          device.isOn ? colors.icon : 'text-secondary-400'
        )} />
      </div>

      {/* Device Info */}
      <div className="space-y-1">
        <h3 className="font-semibold text-secondary-900 text-sm truncate">{device.name}</h3>
        <p className="text-xs text-secondary-500 truncate">{device.room}</p>
        <div className="flex items-center gap-1 mt-1">
          <span className={cn(
            "text-xs font-medium",
            device.isOn ? "text-primary-600" : "text-secondary-400"
          )}>
            {device.powerConsumption}W
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
          "absolute bottom-3 right-3 w-10 h-5 rounded-full transition-colors duration-300",
          device.isOn ? colors.active : 'bg-secondary-200'
        )}
      >
        <motion.div
          animate={{ x: device.isOn ? 18 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="w-4.5 h-4.5 bg-white rounded-full shadow-md mt-0.5"
        />
      </motion.button>
    </motion.div>
  );
};
