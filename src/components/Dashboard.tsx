import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useHomeAssistantData } from './HomeAssistantData';
import { cn } from '../lib/utils';
import { TopBar } from './TopBar';
import { ZoneGlassCard } from './ZoneGlassCard';
import type { ZoneEntityChip } from './ZoneGlassCard';
import {
  Activity,
  AlertTriangle,
  Bell,
  CloudSun,
  Cpu,
  Droplets,
  Fan,
  Gauge,
  Lightbulb,
  Moon,
  Power,
  ServerCog,
  Settings2,
  Shield,
  Speaker,
  Tv,
  Volume2,
  Waves,
  Wifi,
  Zap,
} from 'lucide-react';

export type TabId =
  | 'overview'
  | 'rooms'
  | 'scenes'
  | 'energy'
  | 'security'
  | 'settings'
  | 'sensors';

const navigationTabs: { id: TabId; label: string; tab: TabId }[] = [
  { id: 'overview', label: 'Обзор', tab: 'overview' },
  { id: 'rooms', label: 'Комнаты', tab: 'rooms' },
  { id: 'scenes', label: 'Сцены', tab: 'scenes' },
  { id: 'energy', label: 'Энергия', tab: 'energy' },
  { id: 'security', label: 'Безопасность', tab: 'security' },
  { id: 'sensors', label: 'Сенсоры', tab: 'sensors' },
  { id: 'settings', label: 'Настройки', tab: 'settings' },
];

const tabs: { id: TabId; label: string }[] = [
  { id: 'overview', label: 'Главная' },
  { id: 'rooms', label: 'Комнаты' },
  { id: 'scenes', label: 'Сцены' },
  { id: 'energy', label: 'Энергия' },
  { id: 'security', label: 'Безопасность' },
  { id: 'sensors', label: 'Сенсоры' },
  { id: 'settings', label: 'Настройки' },
];

type SceneTone = 'neutral' | 'warm' | 'alert';

const zoneIcons: Record<string, string> = {
  living_room: '🏙️',
  bedroom: '🌙',
  kitchen: '🍳',
  hallway: '🚪',
  gostinaia: '💡',
  prikhozhaia: '🚶',
  spalnia: '🛌',
  kukhnia: '🍽️',
};

const sceneChip = (_label: string, tone: SceneTone = 'neutral') =>
  `inline-flex items-center gap-1 px-3 py-1 rounded-full border bg-white/90 shadow-sm text-[11px] uppercase tracking-[0.18em] ${
    tone === 'warm'
      ? 'border-amber-200 text-amber-700'
      : tone === 'alert'
        ? 'border-rose-200 text-rose-700'
        : 'border-sky-200 text-sky-700'
  }`;

const fallbackZoneDevices: Record<
  string,
  { id: string; label: string; icon: React.ReactNode; initial: boolean; state?: string }[]
> = {
  hallway: [
    { id: 'light.hallway_chandelier', label: 'Люстра', icon: <Lightbulb size={16} />, initial: true, state: 'on' },
    { id: 'light.hallway_strip', label: 'Подсветка', icon: <Lightbulb size={16} />, initial: false, state: 'off' },
    { id: 'media.hallway_tv', label: 'Телевизор', icon: <Tv size={16} />, initial: false, state: 'off' },
    { id: 'media.hallway_soundbar', label: 'Саундбар', icon: <Volume2 size={16} />, initial: false, state: 'off' },
    { id: 'media.hallway_alice', label: 'Алиса', icon: <Speaker size={16} />, initial: true, state: 'on' },
  ],
  living_room: [
    { id: 'light.living_room_ceiling', label: 'Потолок', icon: <Lightbulb size={16} />, initial: true, state: 'on' },
    { id: 'media.living_room_tv', label: 'TV', icon: <Tv size={16} />, initial: true, state: 'on' },
    { id: 'media.living_room_soundbar', label: 'Soundbar', icon: <Volume2 size={16} />, initial: true, state: 'on' },
    { id: 'switch.living_room_ambilight', label: 'Ambilight', icon: <Lightbulb size={16} />, initial: false, state: 'off' },
  ],
  kitchen: [
    { id: 'light.kitchen_ceiling', label: 'Свет', icon: <Lightbulb size={16} />, initial: true, state: 'on' },
    { id: 'switch.kitchen_hood', label: 'Вытяжка', icon: <Fan size={16} />, initial: false, state: 'off' },
    { id: 'switch.kitchen_led', label: 'LED', icon: <Lightbulb size={16} />, initial: false, state: 'off' },
  ],
  bedroom: [
    { id: 'light.bedroom_led', label: 'LED потолок', icon: <Lightbulb size={16} />, initial: true, state: 'on' },
    { id: 'light.bedroom_floor', label: 'Торшер', icon: <Lightbulb size={16} />, initial: false, state: 'off' },
    { id: 'media.bedroom_speaker', label: 'Колонка', icon: <Speaker size={16} />, initial: true, state: 'on' },
  ],
};

const SectionCard: React.FC<{
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, subtitle, icon, children }) => (
  <motion.section layout className="glass-panel rounded-[28px] border border-slate-200/80 p-5">
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
          {subtitle ?? 'Секция'}
        </p>
        <p className="text-xl font-semibold text-slate-900">{title}</p>
      </div>
      {icon && <span className="text-slate-500">{icon}</span>}
    </div>
    <div className="mt-4 flex flex-col gap-4">{children}</div>
  </motion.section>
);

const ToggleChip: React.FC<{ label: string; isOn: boolean; icon?: React.ReactNode }> = ({
  label,
  isOn,
  icon,
}) => (
  <button
    type="button"
    className={cn(
      'glass-panel flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-medium tracking-wide transition-shadow',
      isOn
        ? 'border-sky-300 bg-sky-50 text-slate-900 shadow-[0_8px_20px_rgba(56,189,248,0.18)]'
        : 'border-slate-200 text-slate-500',
    )}
  >
    <span className="text-base text-slate-600">{icon ?? '•'}</span>
    <span>{label}</span>
    <span className={cn('ml-auto text-[10px] uppercase tracking-[0.15em]', isOn ? 'text-sky-600' : 'text-slate-400')}>
      {isOn ? 'ВКЛ' : 'ВЫКЛ'}
    </span>
  </button>
);

const SummaryBadge: React.FC<{ label: string; value: string; unit?: string }> = ({ label, value, unit }) => (
  <div>
    <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">{label}</p>
    <p className="text-3xl font-semibold text-slate-900">{value}</p>
    {unit && <p className="text-xs text-slate-400">{unit}</p>}
  </div>
);

const tabTransition = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -24 },
};

export const Dashboard: React.FC = () => {
  const { zoneData, weatherData, deviceData, allStates } = useHomeAssistantData({ includeAllEntities: true });
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [swipeStart, setSwipeStart] = useState<number | null>(null);

  const tabIndex = tabs.findIndex(tab => tab.id === activeTab);

  const handlePointerDown = (event: React.PointerEvent) => setSwipeStart(event.clientX);

  const handlePointerUp = (event: React.PointerEvent) => {
    if (swipeStart === null) return;
    const delta = event.clientX - swipeStart;
    if (Math.abs(delta) < 60) {
      setSwipeStart(null);
      return;
    }
    const direction = delta < 0 ? 1 : -1;
    const nextIndex = Math.min(Math.max(tabIndex + direction, 0), tabs.length - 1);
    setActiveTab(tabs[nextIndex].id);
    setSwipeStart(null);
  };

  const zones = useMemo(() => zoneData.slice(0, 6), [zoneData]);

  const zoneEntities = useMemo(() =>
    zones.map(zone => {
      const rawEntities: ZoneEntityChip[] = (zone.entities ?? []).slice(0, 5).map(entity => ({
        id: entity.entity_id,
        label: entity.attributes?.friendly_name ?? entity.entity_id.split('.').pop() ?? entity.entity_id,
        icon: entity.entity_id.includes('light')
          ? <Lightbulb size={16} />
          : entity.entity_id.includes('tv')
            ? <Tv size={16} />
            : entity.entity_id.includes('soundbar') || entity.entity_id.includes('speaker')
              ? <Volume2 size={16} />
              : entity.entity_id.includes('fan') || entity.entity_id.includes('hood')
                ? <Fan size={16} />
                : <Power size={16} />,
        state: entity.state,
        initial: ['on', 'playing', 'active', 'heat'].includes(entity.state),
        isFallback: false,
      }));

      const fallback: ZoneEntityChip[] = (fallbackZoneDevices[zone.id] ?? []).map(item => ({
        ...item,
        entity_id: item.id,
        state: item.state ?? (item.initial ? 'on' : 'off'),
        isFallback: true,
      }));
      const entities = rawEntities.length > 0 ? rawEntities : fallback;

      return {
        id: zone.id,
        name: zone.name,
        entities,
        temperature: zone.temperature,
        humidity: zone.humidity,
      };
    }),
  [zones]);
  const livingDevices = deviceData.filter(item => item.entity_id.includes('living'));

  const systemMetrics = useMemo(() => {
    const findState = (entityId: string) => allStates.find(item => item.entity_id === entityId)?.state ?? '—';
    const withFallback = (entityId: string, fallback: string) => {
      const value = findState(entityId);
      return value === '—' || value === 'unknown' || value === 'unavailable' ? fallback : value;
    };

    return {
      shamanCpu: withFallback('sensor.shaman_shaman_cpuload', '28%'),
      shamanMemory: withFallback('sensor.shaman_shaman_memoryusage', '62%'),
      shamanNet: withFallback('sensor.kompiuter_shaman_network_amneziavpn', 'Up'),
      shamanDisks: withFallback('sensor.shaman_shaman_storage_total_disk_count', '2'),
      nasDiskTemp: withFallback('sensor.dsm_volume_2_average_disk_temp', '35°C'),
      nasHealth: withFallback('sensor.dsm_system_status', 'Требует внимания'),
      nasVolume: withFallback('sensor.dsm_volume_2_status', '87.5%'),
      routerCards: withFallback('sensor.shaman_shaman_network_network_card_count', '9'),
      routerEthernet: withFallback('sensor.shaman_shaman_network_ethernet', 'Down'),
      updatesAvailable: withFallback('sensor.shaman_shaman_windowsupdates_available_software_updates', '1'),
    };
  }, [allStates]);

  const renderOverview = () => (
    <div className="overview-layout h-full">
      <div className="overview-main flex flex-col gap-4">
        <SectionCard title="Мои устройства" subtitle="Главный экран" icon={<Activity size={18} />}>
          <div className="overview-device-grid">
            {zoneEntities.slice(0, 6).map(zone => (
              <div key={`overview-${zone.id}`} className="glass-panel rounded-[24px] border border-white/40 p-4">
                <div className="flex items-start justify-between">
                  <span className="text-xl text-slate-700">{zoneIcons[zone.id] ?? '•'}</span>
                  <span className="inline-flex h-6 w-11 rounded-full bg-slate-200/90 p-1">
                    <span className="h-4 w-4 rounded-full bg-white shadow-sm" />
                  </span>
                </div>
                <div className="mt-8">
                  <p className="text-xl font-semibold text-slate-900">{zone.name}</p>
                  <div className="mt-2 flex items-end justify-between text-sm text-slate-500">
                    <span>Активно 3 часа</span>
                    <span>{(zone.temperature ?? 22).toFixed(0)}°C</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <div className="overview-bottom-grid">
          <SectionCard title="Статистика" subtitle="Использование" icon={<Zap size={18} />}>
            <div className="grid grid-cols-3 gap-4 text-sm text-slate-700">
              <SummaryBadge label="Сегодня" value="35.02" unit="кВт·ч" />
              <SummaryBadge label="Часы" value="32" unit="ч" />
              <SummaryBadge label="Пик" value="30" unit="кВт" />
            </div>
            <div className="grid grid-cols-10 gap-2 items-end h-32">
              {[40, 55, 48, 86, 61, 70, 84, 73, 79, 96].map((value, index) => (
                <div key={index} className="rounded-t-xl bg-slate-200" style={{ height: `${value}%` }} />
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Потребители" subtitle="Устройства" icon={<Gauge size={18} />}>
            <div className="grid grid-cols-2 gap-3">
              {['TV set', 'Light fixture', 'Stereo system', 'Backlight', 'Play Station 4', 'Lamp 1'].map(item => (
                <div key={item} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-sm text-slate-700">
                  <span>{item}</span>
                  <span className="text-slate-400">•</span>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>

      <div className="overview-side flex flex-col gap-4">
        <SectionCard title="Температура" subtitle="Климат" icon={<CloudSun size={18} />}>
          <div className="flex flex-col items-center gap-4 py-2">
            <div className="flex h-56 w-56 items-center justify-center rounded-full border-[14px] border-slate-200 bg-gradient-to-b from-white to-slate-100 shadow-[0_18px_40px_rgba(15,23,42,0.14)]">
              <div className="flex h-40 w-40 flex-col items-center justify-center rounded-full border border-slate-200 bg-white text-center">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Heating</p>
                <p className="mt-2 text-5xl font-semibold text-slate-300">22</p>
              </div>
            </div>
            <div className="grid w-full grid-cols-3 gap-3">
              <button className="neo-button"><span>Нагрев</span></button>
              <button className="neo-button"><span>Охлаждение</span></button>
              <button className="neo-button"><span>Сушка</span></button>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Влажность" subtitle="Комфорт" icon={<Droplets size={18} />}>
          <div className="flex items-center justify-between text-slate-700">
            <span className="text-base font-medium">Уровень</span>
            <span className="text-3xl font-semibold">60%</span>
          </div>
          <div className="h-5 rounded-full bg-slate-200">
            <div className="h-5 w-[60%] rounded-full bg-slate-900" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <button className="neo-button"><span>Авто</span></button>
            <button className="neo-button"><span>30%</span></button>
            <button className="neo-button"><span>60%</span></button>
          </div>
        </SectionCard>

        <SectionCard title="Качество воздуха" subtitle="Среда" icon={<Waves size={18} />}>
          <div className="flex items-center justify-between text-slate-700">
            <span className="text-base font-medium">Статус</span>
            <span className="text-2xl font-semibold">Good</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-[22px] border border-slate-200 bg-white/80 p-4">
              <p className="text-sm text-slate-500">CO₂</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">874</p>
            </div>
            <div className="rounded-[22px] border border-slate-200 bg-white/80 p-4">
              <p className="text-sm text-slate-500">Pollutants</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">60</p>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );

  const renderLiving = () => (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-8 flex flex-col gap-4">
        <SectionCard title="Комнаты" subtitle="Пространства дома" icon={<Lightbulb size={18} />}>
          <div className="zones-grid">
            {zoneEntities.slice(0, 4).map(zone => (
              <ZoneGlassCard
                key={`rooms-${zone.id}`}
                id={zone.id}
                name={zone.name}
                icon={zoneIcons[zone.id] ?? '🛰️'}
                temperature={zone.temperature}
                humidity={zone.humidity}
                entities={zone.entities.slice(0, 4)}
              />
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="col-span-4 flex flex-col gap-4">
        <SectionCard title="Климат и свет" subtitle="Сводка по комнате" icon={<Fan size={18} />}>
          <div className="grid grid-cols-2 gap-3">
            <SummaryBadge label="Средняя температура" value="21.5" unit="°C" />
            <SummaryBadge label="Средняя влажность" value="42" unit="%" />
          </div>
          <div className="grid grid-cols-1 gap-3">
            {livingDevices.slice(0, 3).map(device => (
              <ToggleChip
                key={device.entity_id}
                label={device.name ?? device.entity_id}
                isOn={device.is_on ?? device.state === 'on'}
                icon={<Lightbulb size={16} />}
              />
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Сцены комнаты" subtitle="Быстрые пресеты" icon={<Tv size={18} />}>
          <div className="flex flex-wrap gap-3">
            <span className={sceneChip('Вечер')}>Вечер</span>
            <span className={sceneChip('Кино', 'warm')}>Кино</span>
            <span className={sceneChip('Чтение')}>Чтение</span>
            <span className={sceneChip('Фокус')}>Фокус</span>
          </div>
        </SectionCard>
      </div>
    </div>
  );

  const renderScenes = () => (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-8 flex flex-col gap-4">
        <SectionCard title="Сцены дома" subtitle="Быстрые сценарии" icon={<Activity size={18} />}>
          <div className="grid grid-cols-3 gap-3">
            <button className="neo-button"><span>Утро</span></button>
            <button className="neo-button"><span>Вечер</span></button>
            <button className="neo-button"><span>Кино</span></button>
            <button className="neo-button"><span>Сон</span></button>
            <button className="neo-button"><span>Уход</span></button>
            <button className="neo-button"><span>Чтение</span></button>
          </div>
        </SectionCard>

        <SectionCard title="Привязка к зонам" subtitle="Где применяются" icon={<Shield size={18} />}>
          <div className="zones-grid">
            {zoneEntities.slice(0, 3).map(zone => (
              <div key={zone.id} className="soft-stat-card p-4 text-slate-700">
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Зона</p>
                <p className="text-lg font-semibold text-slate-900">{zone.name}</p>
                <p className="text-xs text-slate-400 mt-2">{zone.entities.length} сущностей</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="col-span-4 flex flex-col gap-4">
        <SectionCard title="Статусы" subtitle="Исполнение" icon={<Power size={18} />}>
          <ToggleChip label="Ночной режим" isOn icon={<Moon size={16} />} />
          <ToggleChip label="Авто сцены" isOn icon={<Settings2 size={16} />} />
          <ToggleChip label="Ручной override" isOn={false} icon={<AlertTriangle size={16} />} />
        </SectionCard>
      </div>
    </div>
  );

  const renderEnergy = () => (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-8 flex flex-col gap-4">
        <SectionCard title="Энергия" subtitle="Суточный профиль" icon={<Zap size={18} />}>
          <div className="grid grid-cols-3 gap-4 text-sm text-slate-700">
            <SummaryBadge label="Сегодня" value="8.6" unit="кВт·ч" />
            <SummaryBadge label="Пик" value="2.1" unit="кВт" />
            <SummaryBadge label="Экономия" value="12%" unit="vs неделя" />
          </div>
        </SectionCard>

        <SectionCard title="Потребители" subtitle="Топ устройств" icon={<Gauge size={18} />}>
          <div className="grid grid-cols-2 gap-3">
            <div className="soft-stat-card p-4 text-slate-700">
              <p className="text-xs text-slate-400">Кондиционер</p>
              <p className="text-2xl text-slate-900 font-semibold">1.5 кВт</p>
            </div>
            <div className="soft-stat-card p-4 text-slate-700">
              <p className="text-xs text-slate-400">Освещение</p>
              <p className="text-2xl text-slate-900 font-semibold">0.34 кВт</p>
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="col-span-4 flex flex-col gap-4">
        <SectionCard title="Рекомендации" subtitle="Оптимизация" icon={<Cpu size={18} />}>
          <p className="text-sm text-slate-600">Перенести нагрев воды на ночной тариф.</p>
          <p className="text-sm text-slate-600">Снизить яркость LED на 20% после 23:00.</p>
        </SectionCard>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-8 flex flex-col gap-4">
        <SectionCard title="Безопасность" subtitle="Статус периметра" icon={<Shield size={18} />}>
          <div className="grid grid-cols-3 gap-3">
            <div className="soft-stat-card soft-accent-success p-4">
              <p className="text-xs text-emerald-600">Двери</p>
              <p className="text-xl text-slate-900 font-semibold">Закрыты</p>
            </div>
            <div className="soft-stat-card soft-accent-success p-4">
              <p className="text-xs text-emerald-600">Окна</p>
              <p className="text-xl text-slate-900 font-semibold">Норма</p>
            </div>
            <div className="soft-stat-card soft-accent-warn p-4">
              <p className="text-xs text-amber-600">Движение</p>
              <p className="text-xl text-slate-900 font-semibold">1 зона</p>
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="col-span-4 flex flex-col gap-4">
        <SectionCard title="Быстрые действия" subtitle="Охрана" icon={<AlertTriangle size={18} />}>
          <ToggleChip label="Режим охраны" isOn icon={<Shield size={16} />} />
          <ToggleChip label="Уведомления" isOn icon={<Bell size={16} />} />
          <ToggleChip label="Сирена" isOn={false} icon={<Volume2 size={16} />} />
        </SectionCard>
      </div>
    </div>
  );

  const renderSystems = () => (
    <div className="grid grid-cols-2 gap-4">
      <SectionCard title="Компьютер SHAMAN" subtitle="Рабочая станция" icon={<Cpu size={18} />}>
        <div className="grid grid-cols-2 gap-3 text-sm text-slate-700">
          <div className="soft-stat-card p-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">CPU</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{systemMetrics.shamanCpu}</p>
          </div>
          <div className="soft-stat-card p-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">RAM</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{systemMetrics.shamanMemory}</p>
          </div>
          <div className="soft-stat-card p-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">VPN</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">{systemMetrics.shamanNet}</p>
          </div>
          <div className="soft-stat-card p-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Диски</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{systemMetrics.shamanDisks}</p>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Synology NAS" subtitle="Хранилище" icon={<ServerCog size={18} />}>
        <div className="grid grid-cols-2 gap-3 text-sm text-slate-700">
          <div className="soft-stat-card p-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Статус</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">{systemMetrics.nasHealth}</p>
          </div>
          <div className="soft-stat-card p-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Том 2</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">{systemMetrics.nasVolume}</p>
          </div>
          <div className="soft-stat-card p-4 col-span-2">
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Средняя температура дисков</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{systemMetrics.nasDiskTemp}</p>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Сеть и роутер" subtitle="Инфраструктура" icon={<Wifi size={18} />}>
        <div className="grid grid-cols-2 gap-3 text-sm text-slate-700">
          <div className="soft-info-card p-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Ethernet</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">{systemMetrics.routerEthernet}</p>
          </div>
          <div className="soft-info-card p-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Сетевые карты</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{systemMetrics.routerCards}</p>
          </div>
          <div className="soft-info-card p-4 col-span-2">
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Обновления Windows</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">{systemMetrics.updatesAvailable}</p>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Обновления и сервисы" subtitle="Lifecycle" icon={<Settings2 size={18} />}>
        <div className="space-y-2 text-sm text-slate-700">
          <p>Home Assistant Core — 2026.3.0</p>
          <p>Zigbee2MQTT — актуально</p>
          <p>ESPHome — 2026.2.1</p>
        </div>
      </SectionCard>

      <SectionCard title="Источники данных" subtitle="Инфраструктура интерфейса" icon={<ServerCog size={18} />}>
        <div className="grid grid-cols-2 gap-3 text-sm text-slate-700">
          <div className="soft-stat-card p-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Источник</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">Home Assistant / Mock</p>
            <p className="mt-1 text-xs text-slate-400">Подмена данных fallback-карточками при отсутствии сущностей.</p>
          </div>
          <div className="soft-stat-card p-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Шаблон</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">Единые glass-компоненты</p>
            <p className="mt-1 text-xs text-slate-400">TopBar, SectionCard и ZoneGlassCard используются как базовые паттерны.</p>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Будущие экраны" subtitle="Расширение" icon={<Settings2 size={18} />}>
        <div className="flex flex-wrap gap-3">
          <span className={sceneChip('Камеры')}>Камеры</span>
          <span className={sceneChip('Аналитика')}>Аналитика</span>
          <span className={sceneChip('Гости', 'warm')}>Гости</span>
          <span className={sceneChip('Автоматизации')}>Автоматизации</span>
        </div>
      </SectionCard>
    </div>
  );

  const renderSensors = () => (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-7 flex flex-col gap-4">
        <SectionCard title="Сенсоры Home Assistant" subtitle="Полный обзор доменов" icon={<Activity size={18} />}>
          <div className="grid grid-cols-2 gap-3">
            {[
              ['Сенсоры', '189'],
              ['Обновления', '132'],
              ['Бинарные сенсоры', '33'],
              ['Автоматизации', '21'],
              ['Скрипты', '25'],
              ['Камеры', '2'],
            ].map(([label, value]) => (
              <div key={label} className="soft-stat-card p-4">
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">{label}</p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">{value}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Распределение по зонам" subtitle="Area analysis" icon={<Shield size={18} />}>
          <div className="grid grid-cols-2 gap-3">
            {[
              ['Гостиная', '43'],
              ['Прихожая', '43'],
              ['Спальня', '4'],
              ['Кухня', '75'],
              ['Улица', '3'],
              ['Системная зона', '0'],
            ].map(([label, value]) => (
              <div key={label} className="soft-stat-card p-4">
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Зона</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{label}</p>
                <p className="mt-2 text-sm text-slate-500">{value} сущностей</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="col-span-5 flex flex-col gap-4">
        <SectionCard title="Ключевые домены" subtitle="Навигация" icon={<Cpu size={18} />}>
          <div className="grid grid-cols-1 gap-3">
            <ToggleChip label="sensor" isOn icon={<Gauge size={16} />} />
            <ToggleChip label="binary_sensor" isOn icon={<Shield size={16} />} />
            <ToggleChip label="update" isOn={false} icon={<Zap size={16} />} />
            <ToggleChip label="camera" isOn={false} icon={<CloudSun size={16} />} />
            <ToggleChip label="automation" isOn icon={<Settings2 size={16} />} />
          </div>
        </SectionCard>

        <SectionCard title="Рекомендации" subtitle="Функциональность" icon={<Bell size={18} />}>
          <p className="text-sm text-slate-600">Добавить табличный просмотр сенсоров с фильтрами по зоне и домену.</p>
          <p className="text-sm text-slate-600">Вынести критические датчики в избранное для главного экрана.</p>
        </SectionCard>

        <SectionCard title="Критичные сущности" subtitle="Приоритет" icon={<AlertTriangle size={18} />}>
          <div className="space-y-3 text-sm text-slate-700">
            <div className="soft-accent-warn soft-stat-card p-4">
              <p className="font-semibold text-slate-900">NAS требует внимания</p>
              <p className="mt-1 text-xs text-slate-600">Том 2 заполнен на 87.5%</p>
            </div>
            <div className="soft-info-card p-4">
              <p className="font-semibold text-slate-900">Камеры: 2</p>
              <p className="mt-1 text-xs text-slate-600">Доступны для отдельного экрана наблюдения.</p>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'rooms':
        return renderLiving();
      case 'scenes':
        return renderScenes();
      case 'security':
        return renderSecurity();
      case 'settings':
        return renderSystems();
      case 'sensors':
        return renderSensors();
      case 'energy':
        return renderEnergy();
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-shell" onPointerDown={handlePointerDown} onPointerUp={handlePointerUp}>
      <TopBar
        activeTab={activeTab}
        onNavigate={setActiveTab}
        weather={{ temperature: weatherData.temperature, condition: weatherData.condition }}
        navItems={navigationTabs.map(({ tab, label }) => ({ tab, label }))}
      />

      <motion.main className="dashboard-main">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={tabTransition}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="h-full"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </motion.main>
    </div>
  );
};
