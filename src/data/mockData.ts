import type { Device, User, ThermostatSettings, AirQuality, EnergyUsage, Occupant } from '../types';

export const currentUser: User = {
  id: '1',
  name: 'Raymondin Safary',
  avatar: 'https://i.pravatar.cc/150?img=11',
  role: 'admin',
};

export const devices: Device[] = [
  {
    id: '1',
    name: 'Smart TV',
    type: 'tv',
    status: 'active',
    powerConsumption: 120,
    lastActive: '2024-01-15T10:30:00',
    isOn: true,
    room: 'Living Room',
  },
  {
    id: '2',
    name: 'Smart Speaker',
    type: 'speaker',
    status: 'active',
    powerConsumption: 15,
    lastActive: '2024-01-15T10:25:00',
    isOn: true,
    room: 'Living Room',
  },
  {
    id: '3',
    name: 'Wi-Fi Router',
    type: 'router',
    status: 'active',
    powerConsumption: 10,
    lastActive: '2024-01-15T10:30:00',
    isOn: true,
    room: 'Office',
  },
  {
    id: '4',
    name: 'Smart Heater',
    type: 'heater',
    status: 'inactive',
    powerConsumption: 1500,
    lastActive: '2024-01-14T22:00:00',
    isOn: false,
    room: 'Bedroom',
  },
  {
    id: '5',
    name: 'Smart Socket',
    type: 'socket',
    status: 'active',
    powerConsumption: 5,
    lastActive: '2024-01-15T10:30:00',
    isOn: true,
    room: 'Kitchen',
  },
  {
    id: '6',
    name: 'Smart Lamp',
    type: 'lamp',
    status: 'active',
    powerConsumption: 12,
    lastActive: '2024-01-15T10:28:00',
    isOn: true,
    room: 'Living Room',
  },
  {
    id: '7',
    name: 'Kitchen TV',
    type: 'tv',
    status: 'inactive',
    powerConsumption: 80,
    lastActive: '2024-01-15T08:00:00',
    isOn: false,
    room: 'Kitchen',
  },
  {
    id: '8',
    name: 'Bedroom Speaker',
    type: 'speaker',
    status: 'inactive',
    powerConsumption: 10,
    lastActive: '2024-01-15T07:00:00',
    isOn: false,
    room: 'Bedroom',
  },
];

export const thermostatSettings: ThermostatSettings = {
  temperature: 22,
  humidity: 45,
  mode: 'cool',
  fanSpeed: 'medium',
  targetTemp: 24,
  isOn: true,
};

export const airQuality: AirQuality = {
  aqi: 42,
  pm25: 12,
  pm10: 18,
  co2: 650,
  voc: 0.3,
  level: 'good',
};

export const energyUsage: EnergyUsage[] = [
  { day: 'Mon', usage: 12.5, cost: 1.50 },
  { day: 'Tue', usage: 15.2, cost: 1.82 },
  { day: 'Wed', usage: 11.8, cost: 1.42 },
  { day: 'Thu', usage: 18.3, cost: 2.20 },
  { day: 'Fri', usage: 14.7, cost: 1.76 },
  { day: 'Sat', usage: 22.1, cost: 2.65 },
  { day: 'Sun', usage: 19.5, cost: 2.34 },
];

export const occupants: Occupant[] = [
  {
    id: '1',
    name: 'Raymondin Safary',
    avatar: 'https://i.pravatar.cc/150?img=11',
    location: 'Living Room',
    status: 'home',
    lastActive: '2024-01-15T10:30:00',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    avatar: 'https://i.pravatar.cc/150?img=5',
    location: 'Bedroom',
    status: 'sleeping',
    lastActive: '2024-01-15T06:00:00',
  },
  {
    id: '3',
    name: 'Mike Chen',
    avatar: 'https://i.pravatar.cc/150?img=8',
    location: 'Away',
    status: 'away',
    lastActive: '2024-01-15T08:00:00',
  },
  {
    id: '4',
    name: 'Emma Wilson',
    avatar: 'https://i.pravatar.cc/150?img=9',
    location: 'Office',
    status: 'home',
    lastActive: '2024-01-15T10:25:00',
  },
];

export const powerConsumptionData = [
  { name: 'Air Conditioner', power: 1500, icon: 'snowflake' },
  { name: 'Lighting', power: 120, icon: 'lightbulb' },
  { name: 'Television', power: 200, icon: 'tv' },
  { name: 'Smart Speakers', power: 25, icon: 'speaker' },
];
