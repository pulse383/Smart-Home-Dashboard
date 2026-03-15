import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreHorizontal, MapPin, Moon, Home } from 'lucide-react';
import type { Occupant } from '../types';
import { cn } from '../lib/utils';

interface OccupantGridProps {
  occupants: Occupant[];
}

const statusConfig = {
  home: { icon: Home, color: 'text-green-500', bg: 'bg-green-100', label: 'Home' },
  away: { icon: MapPin, color: 'text-blue-500', bg: 'bg-blue-100', label: 'Away' },
  sleeping: { icon: Moon, color: 'text-purple-500', bg: 'bg-purple-100', label: 'Sleeping' },
};

export const OccupantGrid: React.FC<OccupantGridProps> = ({ occupants }) => {
  const [selectedOccupant, setSelectedOccupant] = useState<Occupant | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-secondary-100"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-secondary-900">Home Occupants</h2>
          <p className="text-sm text-secondary-500">
            {occupants.filter(o => o.status === 'home').length} of {occupants.length} home
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-8 h-8 rounded-full bg-secondary-100 flex items-center justify-center"
        >
          <MoreHorizontal className="w-4 h-4 text-secondary-600" />
        </motion.button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {occupants.map((occupant, index) => {
          const config = statusConfig[occupant.status];
          const StatusIcon = config.icon;
          const isSelected = selectedOccupant?.id === occupant.id;

          return (
            <motion.div
              key={occupant.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedOccupant(isSelected ? null : occupant)}
              className={cn(
                "relative p-4 rounded-xl border-2 cursor-pointer transition-all",
                isSelected 
                  ? "border-primary-200 bg-primary-50" 
                  : "border-transparent bg-secondary-50 hover:bg-secondary-100"
              )}
            >
              {/* Status Indicator */}
              <div className={cn(
                "absolute top-2 right-2 w-2.5 h-2.5 rounded-full",
                occupant.status === 'home' && "bg-green-400",
                occupant.status === 'away' && "bg-blue-400",
                occupant.status === 'sleeping' && "bg-purple-400"
              )}
              style={occupant.status === 'home' ? { boxShadow: '0 0 6px rgba(74, 222, 128, 0.6)' } : {}}
              />

              <div className="flex flex-col items-center text-center">
                {/* Avatar */}
                <div className="relative mb-2">
                  <img
                    src={occupant.avatar}
                    alt={occupant.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <div className={cn(
                    "absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center",
                    config.bg
                  )}>
                    <StatusIcon className={cn("w-3 h-3", config.color)} />
                  </div>
                </div>

                {/* Name */}
                <p className="font-medium text-secondary-900 text-sm truncate w-full">
                  {occupant.name.split(' ')[0]}
                </p>
                
                {/* Location */}
                <p className="text-xs text-secondary-500 truncate w-full">
                  {occupant.location}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Selected Occupant Details */}
      <AnimatePresence>
        {selectedOccupant && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 overflow-hidden"
          >
            <div className="p-4 bg-secondary-50 rounded-xl">
              <div className="flex items-center gap-4">
                <img
                  src={selectedOccupant.avatar}
                  alt={selectedOccupant.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="font-semibold text-secondary-900">
                    {selectedOccupant.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full",
                      statusConfig[selectedOccupant.status].bg,
                      statusConfig[selectedOccupant.status].color
                    )}>
                      {statusConfig[selectedOccupant.status].label}
                    </span>
                    <span className="text-xs text-secondary-500">
                      {selectedOccupant.location}
                    </span>
                  </div>
                </div>
              </div>
              {selectedOccupant.lastActive && (
                <p className="text-xs text-secondary-500 mt-3">
                  Last active: {new Date(selectedOccupant.lastActive).toLocaleString()}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
