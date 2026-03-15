import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { DeviceCard } from './DeviceCard';
import { ThermostatWidget } from './ThermostatWidget';
import { EnergyUsageChart } from './EnergyUsageChart';
import { PowerConsumptionList } from './PowerConsumptionList';
import { AirQualityWidget } from './AirQualityWidget';
import { OccupantGrid } from './OccupantGrid';
import type { Device, ThermostatSettings } from '../types';
import { 
  currentUser, 
  devices as initialDevices, 
  thermostatSettings as initialThermostat,
  energyUsage,
  airQuality,
  occupants,
  powerConsumptionData
} from '../data/mockData';
import { getGreeting } from '../lib/utils';

export const Dashboard: React.FC = () => {
  const [activeMenuItem, setActiveMenuItem] = useState('dashboard');
  const [devices, setDevices] = useState<Device[]>(initialDevices);
  const [thermostatSettings, setThermostatSettings] = useState<ThermostatSettings>(initialThermostat);

  const handleDeviceToggle = (deviceId: string) => {
    setDevices(prevDevices => 
      prevDevices.map(device => 
        device.id === deviceId 
          ? { ...device, isOn: !device.isOn, status: device.isOn ? 'inactive' : 'active' }
          : device
      )
    );
  };

  const handleThermostatChange = (settings: ThermostatSettings) => {
    setThermostatSettings(settings);
  };

  const activeDevices = devices.filter(d => d.isOn);
  const totalPower = activeDevices.reduce((acc, d) => acc + d.powerConsumption, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Sidebar */}
      <Sidebar 
        user={currentUser} 
        activeItem={activeMenuItem}
        onItemClick={setActiveMenuItem}
      />

      {/* Main Content */}
      <main className="ml-72 p-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-secondary-500 mb-1"
              >
                {getGreeting()},
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold text-secondary-900"
              >
                {currentUser.name}
              </motion.h1>
            </div>
            
            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex gap-6"
            >
              <div className="text-center">
                <p className="text-2xl font-bold text-secondary-900">{activeDevices.length}</p>
                <p className="text-sm text-secondary-500">Active Devices</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary-600">{totalPower}W</p>
                <p className="text-sm text-secondary-500">Power Usage</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-500">{thermostatSettings.temperature}°</p>
                <p className="text-sm text-secondary-500">Temperature</p>
              </div>
            </motion.div>
          </div>
        </motion.header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Devices Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="col-span-12 lg:col-span-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-secondary-900">Smart Devices</h2>
              <p className="text-sm text-secondary-500">{devices.length} devices</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {devices.map((device, index) => (
                <DeviceCard
                  key={device.id}
                  device={device}
                  onToggle={handleDeviceToggle}
                  index={index}
                />
              ))}
            </div>
          </motion.section>

          {/* Right Sidebar */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            {/* Thermostat */}
            <ThermostatWidget
              settings={thermostatSettings}
              onSettingsChange={handleThermostatChange}
            />
          </div>

          {/* Charts Row */}
          <div className="col-span-12 lg:col-span-6">
            <EnergyUsageChart data={energyUsage} />
          </div>

          <div className="col-span-12 lg:col-span-3">
            <PowerConsumptionList data={powerConsumptionData} />
          </div>

          <div className="col-span-12 lg:col-span-3">
            <AirQualityWidget data={airQuality} />
          </div>

          {/* Occupants */}
          <div className="col-span-12 lg:col-span-6">
            <OccupantGrid occupants={occupants} />
          </div>
        </div>
      </main>
    </div>
  );
};
