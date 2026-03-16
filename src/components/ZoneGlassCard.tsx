import React from 'react';
import { motion } from 'framer-motion';

export type ZoneEntityChip = {
  id: string;
  label: string;
  state: string;
  icon?: React.ReactNode;
  entity_id?: string;
  isFallback?: boolean;
};

type ZoneGlassCardProps = {
  id: string;
  name: string;
  icon: string;
  temperature?: number;
  humidity?: number;
  entities: ZoneEntityChip[];
};

export const ZoneGlassCard: React.FC<ZoneGlassCardProps> = ({
  id,
  name,
  icon,
  temperature,
  humidity,
  entities,
}) => {
  return (
    <motion.div
      key={id}
      className="zone-card"
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 200, damping: 18 }}
    >
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Зона</p>
          <h3>{name}</h3>
        </div>
        <span className="text-3xl text-sky-200">{icon}</span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-white">
        <div className="min-w-0">
          <p className="truncate text-[10px] uppercase tracking-[0.16em] text-slate-500">Темп.</p>
          <p className="text-xl font-semibold">{(temperature ?? 22).toFixed(1)}°C</p>
        </div>
        <div className="min-w-0">
          <p className="truncate text-[10px] uppercase tracking-[0.16em] text-slate-500">Влажн.</p>
          <p className="text-xl font-semibold">{(humidity ?? 45).toFixed(0)}%</p>
        </div>
      </div>

      {entities.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-2 text-[12px] text-slate-200">
          {entities.slice(0, 4).map(entity => (
            <motion.button
              key={entity.entity_id ?? entity.id}
              className="glass-panel rounded-2xl border border-white/10 px-3 py-2 text-left overflow-hidden"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <p className="truncate text-[10px] uppercase tracking-[0.12em] text-slate-500">
                {entity.label}
              </p>
              <p className="mt-1 text-sm font-semibold text-white">{entity.state}</p>
            </motion.button>
          ))}
        </div>
      )}

      <div className="mt-4 flex gap-3">
        <button className="neo-button">
          <span>Сцены</span>
        </button>
        <button className="neo-button">
          <span>Управлять</span>
        </button>
      </div>
    </motion.div>
  );
};

export default ZoneGlassCard;
