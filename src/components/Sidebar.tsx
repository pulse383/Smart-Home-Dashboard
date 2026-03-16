import React from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Home,
  Clock,
  Bookmark,
  Bell,
  Download,
  HelpCircle,
  Settings,
  LogOut,
  ChevronRight,
  Home as HomeIcon
} from 'lucide-react';
import type { User } from '../types';
import { cn } from '../lib/utils';

interface SidebarProps {
  user: User;
  activeItem?: string;
  onItemClick?: (item: string) => void;
  zones?: Array<{ id: string; name: string; icon?: string }>;
}

const menuItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Главная' },
  { id: 'lights', icon: Home, label: 'Свет' },
  { id: 'climate', icon: Clock, label: 'Климат' },
  { id: 'security', icon: Bookmark, label: 'Безопасность' },
  { id: 'entertainment', icon: Bell, label: 'Развлечения' },
  { id: 'all', icon: Download, label: 'Все устройства' },
  { id: 'scenes', icon: HelpCircle, label: 'Сцены' },
  { id: 'settings', icon: Settings, label: 'Настройки' },
];

export const Sidebar: React.FC<SidebarProps> = ({
  user,
  activeItem = 'dashboard',
  onItemClick,
  zones = []
}) => {
  return (
    <motion.aside
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed left-0 top-0 right-0 bg-white border-b border-secondary-100 flex items-center shadow-sm z-50"
    >
      {/* Logo */}
      <div className="px-3 py-2 border-r border-secondary-100">
        <motion.div
          className="flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
        >
          <div className="w-7 h-7 bg-gradient-to-br from-primary-500 to-primary-600 rounded-md flex items-center justify-center">
            <Home className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <h1 className="text-[12px] font-bold text-secondary-900 leading-tight">Умный дом</h1>
            <p className="text-[8px] text-secondary-500 leading-tight hidden 2xl:block">Панель управления</p>
          </div>
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-1.5 overflow-x-auto">
        <div className="flex items-center gap-0.5">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;

            return (
              <motion.button
                key={item.id}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onItemClick?.(item.id)}
                className={cn(
                  "flex items-center gap-1 px-2 py-0.5 rounded-lg transition-all duration-200 relative whitespace-nowrap text-[10px]",
                  isActive
                    ? "bg-primary-50 text-primary-600"
                    : "text-secondary-600 hover:bg-secondary-50"
                )}
              >
                <Icon className={cn(
                  "w-3 h-3",
                  isActive && "text-primary-500"
                )} />
                <span className={cn(
                  "font-medium",
                  isActive && "text-primary-700"
                )}>{item.label}</span>

                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-3 right-3 -bottom-1 h-0.5 bg-primary-500 rounded-full"
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Zones Section */}
        {zones.length > 0 && (
          <div className="mt-2 pt-2 border-t border-secondary-100 hidden 2xl:block">
            <div className="px-1 mb-2">
              <p className="text-[10px] font-semibold text-secondary-500 uppercase tracking-wider">Зоны</p>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {zones.map((zone, index) => {
                const isActive = activeItem === zone.id;
                return (
                  <motion.button
                    key={zone.id}
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => onItemClick?.(zone.id)}
                    className={cn(
                      "flex items-center gap-1 px-2 py-1 rounded-lg transition-all duration-200 relative text-[10px]",
                      isActive
                        ? "bg-primary-50 text-primary-600"
                        : "text-secondary-600 hover:bg-secondary-50"
                    )}
                  >
                    {zone.icon ? (
                      <span className="text-[12px]">{zone.icon}</span>
                    ) : (
                      <HomeIcon className="w-3 h-3" />
                    )}
                    <span className={cn(
                      "font-medium",
                      isActive && "text-primary-700"
                    )}>{zone.name}</span>

                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute left-3 right-3 -bottom-1 h-0.5 bg-primary-500 rounded-full"
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Logout Button */}
      <div className="px-2 py-1.5 border-l border-secondary-100 flex items-center gap-2">
        <motion.div
          className="flex items-center gap-2 p-1.5 bg-secondary-50 rounded-lg"
          whileHover={{ backgroundColor: '#f1f5f9' }}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-[11px] font-bold">
            {user.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0 hidden xl:block">
            <p className="text-[11px] font-semibold text-secondary-900 truncate leading-tight">{user.name}</p>
            <p className="text-[9px] text-secondary-500 leading-tight">{user.role}</p>
          </div>
          <ChevronRight className="w-2.5 h-2.5 text-secondary-400" />
        </motion.div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-1 px-2 py-0.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors whitespace-nowrap text-[10px]"
        >
          <LogOut className="w-3 h-3" />
          <span className="font-medium hidden xl:inline">Выйти</span>
        </motion.button>
      </div>
    </motion.aside>
  );
};
