export interface Device {
  id: string;
  name: string;
  type: 'tv' | 'speaker' | 'router' | 'wifi' | 'heater' | 'socket' | 'lamp';
  status: 'active' | 'inactive';
  powerConsumption: number; // in watts
  lastActive?: string;
  isOn: boolean;
  room?: string;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  role: 'admin' | 'user' | 'guest';
}

export interface ThermostatSettings {
  temperature: number;
  humidity: number;
  mode: 'cool' | 'heat' | 'auto' | 'fan';
  fanSpeed: 'low' | 'medium' | 'high';
  targetTemp: number;
  isOn: boolean;
}

export interface AirQuality {
  aqi: number;
  pm25: number;
  pm10: number;
  co2: number;
  voc: number;
  level: 'good' | 'moderate' | 'poor' | 'hazardous';
}

export interface EnergyUsage {
  day: string;
  usage: number;
  cost?: number;
}

export interface Occupant {
  id: string;
  name: string;
  avatar: string;
  location: string;
  status: 'home' | 'away' | 'sleeping';
  lastActive?: string;
}

export interface Room {
  id: string;
  name: string;
  devices: Device[];
  temperature?: number;
  humidity?: number;
}

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
  timestamp: string;
  read: boolean;
}

export interface Schedule {
  id: string;
  deviceId: string;
  time: string;
  action: 'turn_on' | 'turn_off';
  repeat: 'once' | 'daily' | 'weekly';
  enabled: boolean;
}
