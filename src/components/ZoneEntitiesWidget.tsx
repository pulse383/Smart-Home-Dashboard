import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Home, Wifi, Thermometer, Droplets, Wind, Power, AlertCircle, Activity } from 'lucide-react';
import { cn } from '../lib/utils';

interface ZoneEntity {
  id: string;
  name: string;
  state: string;
  attributes?: any;
}

interface Zone {
  id: string;
  name: string;
  entities: ZoneEntity[];
}

interface ZoneEntitiesWidgetProps {
  zones: Zone[];
}

export const ZoneEntitiesWidget: React.FC<ZoneEntitiesWidgetProps> = ({ zones }) => {
  const [activeZone, setActiveZone] = useState<string | null>(zones[0]?.id || null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 300;
    const newPosition = direction === 'left'
      ? Math.max(0, scrollPosition - scrollAmount)
      : Math.min(container.scrollWidth - container.clientWidth, scrollPosition + scrollAmount);

    container.scrollTo({ left: newPosition, behavior: 'smooth' });
    setScrollPosition(newPosition);
  };

  const currentZone = zones.find(z => z.id === activeZone);

  const getEntityIcon = (entity: ZoneEntity) => {
    const state = entity.state.toLowerCase();
    if (state.includes('light') || state.includes('lamp')) return '💡';
    if (state.includes('tv') || state.includes('media')) return '📺';
    if (state.includes('speaker') || state.includes('audio')) return '🔊';
    if (state.includes('heater') || state.includes('aircon')) return '🌡️';
    if (state.includes('fan')) return '🌀';
    if (state.includes('switch') || state.includes('socket')) return '🔌';
    if (state.includes('sensor') || state.includes('temperature')) return '🌡️';
    if (state.includes('humidity')) return '💧';
    if (state.includes('door') || state.includes('window')) return '🚪';
    if (state.includes('motion')) return '🏃';
    if (state.includes('water') || state.includes('leak')) return '💦';
    if (state.includes('air') || state.includes('air_quality')) return '🌬️';
    if (state.includes('battery')) return '🔋';
    if (state.includes('wifi') || state.includes('network')) return '📶';
    if (state.includes('power') || state.includes('energy')) return '⚡';
    if (state.includes('alarm') || state.includes('security')) return '🚨';
    return '🏠';
  };

  const getEntityStatus = (entity: ZoneEntity) => {
    const state = entity.state.toLowerCase();
    if (state === 'on' || state === 'home' || state === 'open' || state === 'active') return 'text-green-500';
    if (state === 'off' || state === 'away' || state === 'closed' || state === 'inactive') return 'text-gray-400';
    if (state === 'unavailable') return 'text-red-500';
    return 'text-blue-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-secondary-100"
    >
      {/* Zone Tabs */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {zones.map((zone) => (
            <motion.button
              key={zone.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveZone(zone.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                activeZone === zone.id
                  ? "bg-primary-500 text-white shadow-md"
                  : "bg-secondary-100 text-secondary-600 hover:bg-secondary-200"
              )}
            >
              <span className="text-lg">{zone.name === 'Гостиная' ? '🛋️' : zone.name === 'Кухня' ? '🍳' : zone.name === 'Прихожая' ? '🚪' : zone.name === 'Спальня' ? '🛏️' : zone.name === 'Улица' ? '🌳' : '🏠'}</span>
              <span>{zone.name}</span>
              <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                {zone.entities.length}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Scroll Controls */}
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleScroll('left')}
            className="p-2 rounded-lg bg-secondary-100 hover:bg-secondary-200 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-secondary-600" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleScroll('right')}
            className="p-2 rounded-lg bg-secondary-100 hover:bg-secondary-200 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-secondary-600" />
          </motion.button>
        </div>
      </div>

      {/* Zone Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeZone}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="relative"
        >
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
          >
            {currentZone?.entities.map((entity, index) => (
              <motion.div
                key={entity.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="flex-shrink-0 w-48 bg-gradient-to-br from-secondary-50 to-white rounded-xl p-4 border border-secondary-200 hover:border-primary-300 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-2xl">{getEntityIcon(entity)}</span>
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    className={cn(
                      "w-3 h-3 rounded-full",
                      getEntityStatus(entity)
                    )}
                  />
                </div>
                <h3 className="text-sm font-semibold text-secondary-900 mb-1 line-clamp-2">
                  {entity.name}
                </h3>
                <p className="text-xs text-secondary-500 capitalize">
                  {entity.state}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};