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
  ChevronRight
} from 'lucide-react';
import type { User } from '../types';
import { cn } from '../lib/utils';

interface SidebarProps {
  user: User;
  activeItem?: string;
  onItemClick?: (item: string) => void;
}

const menuItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'home', icon: Home, label: 'Smart Home' },
  { id: 'schedule', icon: Clock, label: 'Schedule' },
  { id: 'saved', icon: Bookmark, label: 'Saved' },
  { id: 'notifications', icon: Bell, label: 'Notifications', badge: 3 },
  { id: 'downloads', icon: Download, label: 'Downloads' },
  { id: 'help', icon: HelpCircle, label: 'Help & Support' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

export const Sidebar: React.FC<SidebarProps> = ({ 
  user, 
  activeItem = 'dashboard',
  onItemClick 
}) => {
  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed left-0 top-0 h-screen w-72 bg-white border-r border-secondary-100 flex flex-col shadow-sm z-50"
    >
      {/* Logo */}
      <div className="p-6 border-b border-secondary-100">
        <motion.div 
          className="flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
            <Home className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-secondary-900">Smart Home</h1>
            <p className="text-xs text-secondary-500">Dashboard v2.0</p>
          </div>
        </motion.div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-b border-secondary-100">
        <motion.div 
          className="flex items-center gap-3 p-3 bg-secondary-50 rounded-xl"
          whileHover={{ backgroundColor: '#f1f5f9' }}
        >
          <img 
            src={user.avatar} 
            alt={user.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
          />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-secondary-900 truncate">{user.name}</p>
            <p className="text-xs text-secondary-500 capitalize">{user.role}</p>
          </div>
          <ChevronRight className="w-4 h-4 text-secondary-400" />
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            
            return (
              <motion.button
                key={item.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onItemClick?.(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative",
                  isActive 
                    ? "bg-primary-50 text-primary-600" 
                    : "text-secondary-600 hover:bg-secondary-50"
                )}
              >
                <Icon className={cn(
                  "w-5 h-5",
                  isActive && "text-primary-500"
                )} />
                <span className={cn(
                  "font-medium",
                  isActive && "text-primary-700"
                )}>{item.label}</span>
                
                {item.badge && (
                  <span className="ml-auto bg-primary-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
                
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary-500 rounded-r-full"
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-secondary-100">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Log Out</span>
        </motion.button>
      </div>
    </motion.aside>
  );
};
