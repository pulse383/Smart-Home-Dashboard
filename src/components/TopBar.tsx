import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, CalendarDays, Sparkles, SunDim } from 'lucide-react';
import type { TabId } from './Dashboard';
import { cn } from '../lib/utils';
import { currentUser } from '../data/ru_mockData';

interface TopBarProps {
  activeTab: TabId;
  onNavigate: (tab: TabId) => void;
  weather: {
    temperature: number;
    condition: string;
  };
  navItems?: { label: string; tab: TabId }[];
}

const defaultNavItems: { label: string; tab: TabId }[] = [
  { label: 'Обзор', tab: 'overview' },
  { label: 'Комнаты', tab: 'rooms' },
  { label: 'Сцены', tab: 'scenes' },
  { label: 'Энергия', tab: 'energy' },
  { label: 'Безопасность', tab: 'security' },
  { label: 'Сенсоры', tab: 'sensors' },
  { label: 'Настройки', tab: 'settings' },
];

const quickActions = [
  { icon: Sparkles, label: 'Сцены' },
  { icon: Bell, label: 'Уведомления' },
];

const conditionDictionary: Record<string, string> = {
  clear: 'Ясно',
  sunny: 'Солнечно',
  cloudy: 'Облачно',
  rain: 'Дождь',
  rainy: 'Дождь',
  snow: 'Снег',
  fog: 'Туман',
  storm: 'Шторм',
};

export const TopBar: React.FC<TopBarProps> = ({ activeTab, onNavigate, weather, navItems }) => {
  const [timestamp, setTimestamp] = useState(() => new Date());
  const navigation = navItems ?? defaultNavItems;

  useEffect(() => {
    const timer = setInterval(() => setTimestamp(new Date()), 60_000);
    return () => clearInterval(timer);
  }, []);

  const timeLabel = useMemo(
    () =>
      timestamp.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    [timestamp],
  );

  const dateLabel = useMemo(
    () =>
      timestamp
        .toLocaleDateString('ru-RU', {
          weekday: 'long',
          day: '2-digit',
          month: 'long',
        })
        .replace(',', ''),
    [timestamp],
  );

  const weatherLabel = useMemo(() => {
    const normalized = weather.condition?.toLowerCase() ?? '';
    const translated = conditionDictionary[normalized] ?? weather.condition ?? 'Комфортно';
    return `${Math.round(weather.temperature)}°C · ${translated}`;
  }, [weather]);

  const greetingLabel = useMemo(() => {
    const hour = timestamp.getHours();
    if (hour >= 5 && hour < 12) return 'Доброе утро';
    if (hour >= 12 && hour < 18) return 'Добрый день';
    if (hour >= 18 && hour < 23) return 'Добрый вечер';
    return 'Доброй ночи';
  }, [timestamp]);

  return (
    <header className="topbar-shell" aria-label="Заголовок панели">
      <div className="topbar-glass">
        <div className="topbar-profile">
          <div className="profile-avatar" aria-hidden>
            <img src={currentUser.avatar} alt={currentUser.name} loading="lazy" />
          </div>
          <div className="profile-copy" aria-label="Приветствие пользователя">
            <p className="profile-welcome">{greetingLabel}, {currentUser.name}</p>
            <p className="profile-subline">Панель управления домом</p>
          </div>
        </div>

        <nav className="topbar-nav" aria-label="Основная навигация">
          {navigation.map(item => (
            <button
              key={item.tab}
              type="button"
              onClick={() => onNavigate(item.tab)}
              className={cn('topbar-nav__item', activeTab === item.tab && 'is-active')}
              aria-current={activeTab === item.tab ? 'page' : undefined}
            >
              <span>{item.label}</span>
              {activeTab === item.tab && (
                <motion.span layoutId="topbar-nav-indicator" className="topbar-nav__indicator" />
              )}
            </button>
          ))}
        </nav>

        <div className="topbar-status">
          <div className="status-card" aria-label="Текущее время">
            <div className="status-icon">
              <CalendarDays size={18} />
            </div>
            <div>
              <p className="status-label">{dateLabel}</p>
              <p className="status-value">{timeLabel}</p>
            </div>
          </div>
          <div className="status-card" aria-label="Погодный статус">
            <div className="status-icon">
              <SunDim size={18} />
            </div>
            <div>
              <p className="status-label">Комфорт в доме</p>
              <p className="status-value">{weatherLabel}</p>
            </div>
          </div>
          <div className="topbar-actions" aria-label="Быстрые действия">
            {quickActions.map(action => (
              <button key={action.label} type="button" className="quick-action" aria-label={action.label}>
                <action.icon size={18} />
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
