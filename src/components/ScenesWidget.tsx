import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Tv, Home, Activity, Zap, Coffee, BookOpen } from 'lucide-react';
import type { Scene } from '../types';
import { cn } from '../lib/utils';

interface ScenesWidgetProps {
  scenes: Scene[];
  onSceneActivate: (sceneId: string) => void;
}

const sceneConfig = {
  morning: { icon: Sun, color: 'text-orange-500', bg: 'bg-orange-50', label: 'Утро' },
  evening: { icon: Moon, color: 'text-indigo-500', bg: 'bg-indigo-50', label: 'Вечер' },
  movie: { icon: Tv, color: 'text-purple-500', bg: 'bg-purple-50', label: 'Кино' },
  away: { icon: Home, color: 'text-blue-500', bg: 'bg-blue-50', label: 'Уход' },
  sleep: { icon: BookOpen, color: 'text-pink-500', bg: 'bg-pink-50', label: 'Сон' },
  workout: { icon: Activity, color: 'text-green-500', bg: 'bg-green-50', label: 'Спорт' },
  reading: { icon: Coffee, color: 'text-amber-500', bg: 'bg-amber-50', label: 'Чтение' },
};

export const ScenesWidget: React.FC<ScenesWidgetProps> = ({ scenes, onSceneActivate }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-secondary-100"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-secondary-900">Сцены</h2>
          <p className="text-sm text-secondary-500">Быстрые действия</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center text-primary-600"
        >
          <Zap className="w-4 h-4" />
        </motion.button>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {scenes.map((scene) => {
          const config = sceneConfig[scene.id as keyof typeof sceneConfig];
          const Icon = config?.icon || BookOpen;

          return (
            <motion.button
              key={scene.id}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSceneActivate(scene.id)}
              className={cn(
                "flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-200",
                "bg-secondary-50 hover:bg-secondary-100 border-2 border-transparent",
                "active:scale-95 active:shadow-md"
              )}
            >
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", config?.bg)}>
                <Icon className={cn("w-5 h-5", config?.color)} />
              </div>
              <span className="text-xs font-medium text-secondary-700 text-center line-clamp-1">
                {scene.name}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Recent Scenes */}
      <div className="mt-6 pt-6 border-t border-secondary-100">
        <h3 className="text-sm font-semibold text-secondary-900 mb-4">Последние сцены</h3>
        <div className="space-y-2">
          {scenes.slice(0, 3).map((scene) => (
            <motion.div
              key={scene.id}
              whileHover={{ x: 4 }}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary-50 transition-colors cursor-pointer"
              onClick={() => onSceneActivate(scene.id)}
            >
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", sceneConfig[scene.id as keyof typeof sceneConfig]?.bg)}>
                <SceneIcon sceneId={scene.id} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-secondary-900 truncate">{scene.name}</p>
                <p className="text-xs text-secondary-500">{scene.devices.length} устройств</p>
              </div>
              <ChevronRight className="w-4 h-4 text-secondary-400" />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const SceneIcon: React.FC<{ sceneId: string }> = ({ sceneId }) => {
  const config = sceneConfig[sceneId as keyof typeof sceneConfig];
  const Icon = config?.icon || BookOpen;
  return <Icon className={cn("w-4 h-4", config?.color)} />;
};

const ChevronRight: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={cn("w-4 h-4", className)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);
