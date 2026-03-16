import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { DeviceCard } from './DeviceCard';
import { ThermostatWidget } from './ThermostatWidget';
import { EnergyUsageChart } from './EnergyUsageChart';
import { PowerConsumptionList } from './PowerConsumptionList';
import { AirQualityWidget } from './AirQualityWidget';
import { OccupantGrid } from './OccupantGrid';
import { ScenesWidget } from './ScenesWidget';
import { ZonesWidget } from './ZonesWidget';
import { WeatherWidget } from './WeatherWidget';
import { ZoneEntitiesWidget } from './ZoneEntitiesWidget';
import { HomeAssistantAllData } from './HomeAssistantAllData';
import { ZoneDevices } from './ZoneDevices';
import type { Device, ThermostatData, Scene, Room, WeatherData } from '../types';
import { getGreeting } from '../lib/utils';
import { useHomeAssistantData } from './HomeAssistantData';
import { motion as framerMotion } from 'framer-motion';

export const Dashboard: React.FC = () => {
  const [activeMenuItem, setActiveMenuItem] = useState('dashboard');
  const [activeScene, setActiveScene] = useState<string | null>(null);
  const [activeZone, setActiveZone] = useState<string | null>(null);
  
  // Получаем данные из Home Assistant
  const { thermostatData, zoneData, weatherData, deviceData, loading, error } = useHomeAssistantData();

  // Формируем список зон для Sidebar
  const zones = zoneData.map(zone => ({
    id: `zone_${zone.id}`,
    name: zone.name,
    icon: zone.icon
  }));

  // Фильтруем устройства по типу
  const filteredDevices = deviceData.filter((device: any) => {
    if (activeMenuItem === 'all') return true;
    if (activeMenuItem === 'lights') return device.type?.includes('light') || device.type?.includes('lamp');
    if (activeMenuItem === 'climate') return device.type?.includes('climate') || device.type?.includes('thermostat');
    if (activeMenuItem === 'security') return device.type?.includes('camera') || device.type?.includes('sensor');
    if (activeMenuItem === 'entertainment') return device.type?.includes('tv') || device.type?.includes('speaker');
    return true;
  });

  // Показываем экран загрузки, пока данные загружаются
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-primary-700">Загрузка данных...</p>
          <p className="text-sm text-primary-500 mt-2">Подключение к Home Assistant</p>
        </div>
      </div>
    );
  }

  // Показываем экран ошибки, если есть проблемы с загрузкой
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center p-6">
        <div className="glass-card p-8 rounded-2xl max-w-lg text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">Ошибка загрузки данных</h2>
          <p className="text-red-700 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Перезагрузить страницу
          </button>
        </div>
      </div>
    );
  }

  const handleDeviceToggle = (deviceId: string) => {
    // В реальном приложении здесь можно отправить команду в Home Assistant
    console.log('Device toggle:', deviceId);
  };

  const handleThermostatChange = (settings: ThermostatData) => {
    // В реальном приложении здесь можно отправить команду в Home Assistant
    console.log('Thermostat settings changed:', settings);
  };

  const handleSceneActivate = (sceneId: string) => {
    setActiveScene(sceneId);
    // В реальном приложении здесь можно активировать сцену через Home Assistant
    console.log('Scene activate:', sceneId);
  };

  const activeDevices = deviceData.filter(d => d.is_on);
  const totalPower = activeDevices.reduce((acc, d) => acc + (d.power_consumption || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        user={{ id: '1', name: 'Пользователь', avatar: '👤', role: 'user' }}
        activeItem={activeMenuItem}
        onItemClick={(item) => {
          setActiveMenuItem(item);
          if (item.startsWith('zone_')) {
            setActiveZone(item.replace('zone_', ''));
          } else {
            setActiveZone(null);
          }
        }}
        zones={zones}
      />

      {/* Main Content */}
      <main className="ml-64 p-4 md:p-6 lg:p-8 h-screen overflow-hidden">
        {/* Top Section: User Profile + Weather */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-6">
            {/* User Profile */}
            <div className="flex items-center gap-4 glass-card rounded-2xl p-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-2xl font-bold">
                У
              </div>
              <div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-sm text-secondary-500"
                >
                  {getGreeting()},
                </motion.p>
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-xl font-bold text-secondary-900"
                >
                  Пользователь
                </motion.h1>
              </div>
            </div>

            {/* Weather Widget */}
            <div className="flex-1">
              <WeatherWidget weather={weatherData as any} />
            </div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex gap-3"
            >
              <div className="text-center px-4 py-3 glass-card rounded-xl">
                <p className="text-xl font-bold text-secondary-900">{activeDevices.length}</p>
                <p className="text-xs text-secondary-500">Активные</p>
              </div>
              <div className="text-center px-4 py-3 glass-card rounded-xl">
                <p className="text-xl font-bold text-primary-600">{totalPower}W</p>
                <p className="text-xs text-secondary-500">Питание</p>
              </div>
              <div className="text-center px-4 py-3 glass-card rounded-xl">
                <p className="text-xl font-bold text-green-500">{thermostatData.temperature}°</p>
                <p className="text-xs text-secondary-500">Температура</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-12 gap-3 md:gap-4 lg:gap-6">
          {/* Scenes - Full Width */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="col-span-12 md:col-span-6 lg:col-span-4"
          >
            <ScenesWidget
              scenes={[]}
              onSceneActivate={handleSceneActivate}
            />
          </motion.section>

          {/* Zones - Full Width */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="col-span-12 md:col-span-6 lg:col-span-4"
          >
            <ZonesWidget
              rooms={zoneData.map(zone => ({
                id: zone.id,
                name: zone.name,
                icon: zone.icon,
                devices: zone.devices || [],
                temperature: zone.entities[0]?.attributes?.temperature,
                humidity: zone.entities[0]?.attributes?.humidity
              }))}
              onDeviceToggle={handleDeviceToggle}
            />
          </motion.section>

          {/* Thermostat - 4 cols */}
          <div className="col-span-12 md:col-span-6 lg:col-span-4">
            <ThermostatWidget
              data={thermostatData}
              onSettingsChange={handleThermostatChange}
            />
          </div>

          {/* Energy Chart - 8 cols */}
          <div className="col-span-12 md:col-span-6 lg:col-span-8">
            <EnergyUsageChart data={[]} />
          </div>

          {/* Power Consumption - 4 cols */}
          <div className="col-span-12 md:col-span-6 lg:col-span-4">
            <PowerConsumptionList data={[]} />
          </div>

          {/* Air Quality - 4 cols */}
          <div className="col-span-12 md:col-span-6 lg:col-span-4">
            <AirQualityWidget data={{
              aqi: 0,
              pm25: 0,
              pm10: 0,
              co2: 0,
              level: 'good'
            }} />
          </div>

          {/* Occupants - 4 cols */}
          <div className="col-span-12 md:col-span-6 lg:col-span-4">
            <OccupantGrid occupants={[]} />
          </div>

          {/* Home Assistant All Data - Full Width */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="col-span-12"
          >
            <HomeAssistantAllData />
          </motion.section>
        </div>

        {/* Zone Devices Page */}
        {activeZone && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <ZoneDevices
              zoneId={activeZone}
              zoneName={zoneData.find(z => z.id === activeZone)?.name || activeZone}
              devices={deviceData.filter((d: any) => {
                const zone = zoneData.find(z => z.id === activeZone);
                return zone?.devices?.includes(d.entity_id);
              }).map(d => ({
                id: d.entity_id,
                name: d.name || d.entity_id,
                type: d.type as any,
                isOn: d.is_on || false,
                powerConsumption: d.power_consumption || 0,
                icon: d.icon,
                status: d.status as any
              }))}
              onDeviceToggle={handleDeviceToggle}
            />
          </motion.div>
        )}
      </main>
    </div>
  );
};
