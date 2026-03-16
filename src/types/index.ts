export interface Device {
  id: string;
  name: string;
  type: 'tv' | 'speaker' | 'router' | 'wifi' | 'heater' | 'socket' | 'lamp';
  status: 'active' | 'inactive';
  powerConsumption: number; // in watts
  lastActive?: string;
  isOn: boolean;
  room?: string;
  state?: string;
  attributes?: Record<string, any>;
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
  voc?: number;
  level: 'good' | 'moderate' | 'poor' | 'hazardous';
}

export interface EnergyUsage {
  day: string;
  usage: number;
  unit?: string;
  cost?: number;
}

export interface Occupant {
  id: string;
  name: string;
  avatar: string;
  location: string;
  status: 'home' | 'away' | 'sleeping' | string;
  lastActive?: string;
}

// Home Assistant types
export interface HomeAssistantState {
  entity_id: string;
  state: string;
  attributes: Record<string, any>;
}

export interface ThermostatData {
  temperature: number;
  targetTemp: number;
  humidity: number;
  mode: 'cool' | 'heat' | 'auto' | 'fan';
  fanSpeed: 'low' | 'medium' | 'high';
  isOn: boolean;
}

export interface ZoneData {
  id: string;
  name: string;
  entities: HomeAssistantState[];
  devices?: Device[];
  icon?: string;
  temperature?: number;
  humidity?: number;
  isOccupied?: boolean;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  condition: string;
  windSpeed: number;
  feelsLike: number;
  location: string;
}

export interface DeviceData {
  entity_id: string;
  name?: string;
  state: string;
  attributes: Record<string, any>;
  type?: string;
  status?: string;
  is_on?: boolean;
  power_consumption?: number;
  icon?: string;
}

export interface Room {
  id: string;
  name: string;
  icon?: string;
  devices: Device[];
  temperature?: number;
  humidity?: number;
}

export interface ZoneEntity {
  entity_id: string;
  name: string;
  state: string;
  attributes?: Record<string, any>;
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

export interface Scene {
  id: string;
  name: string;
  icon: string;
  devices: {
    deviceId: string;
    state: 'on' | 'off';
  }[];
  description: string;
}

export interface DeviceStats {
  deviceName: string;
  power: number;
  usageHours: number;
  cost: number;
  trend: 'up' | 'down' | 'stable';
}

export interface QuickAction {
  id: string;
  name: string;
  icon: string;
  action: () => void;
  color: string;
}

export interface HomeAssistantZone {
  id: string;
  name: string;
  entities: HomeAssistantState[];
}

export interface HomeAssistantDevice {
  entity_id: string;
  state: string;
  attributes: Record<string, any>;
}

export interface HomeAssistantThermostat {
  temperature: number;
  target_temp: number;
  humidity: number;
  mode: string;
  is_on: boolean;
}

export interface HomeAssistantWeather {
  temperature: number;
  humidity: number;
  condition: string;
  wind_speed: number;
}
