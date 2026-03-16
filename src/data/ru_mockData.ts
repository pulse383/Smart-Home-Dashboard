import type { Device, User, ThermostatSettings, AirQuality, EnergyUsage, Occupant, Scene, Room, ZoneEntity, WeatherData } from '../types';

export const currentUser: User = {
  id: '1',
  name: 'Юрий',
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
  { day: 'Пн', usage: 12.5, cost: 1.50 },
  { day: 'Вт', usage: 15.2, cost: 1.82 },
  { day: 'Ср', usage: 11.8, cost: 1.42 },
  { day: 'Чт', usage: 18.3, cost: 2.20 },
  { day: 'Пт', usage: 14.7, cost: 1.76 },
  { day: 'Сб', usage: 22.1, cost: 2.65 },
  { day: 'Вс', usage: 19.5, cost: 2.34 },
];

export const occupants: Occupant[] = [
  {
    id: '1',
    name: 'Юрий',
    avatar: 'https://i.pravatar.cc/150?img=11',
    location: 'Гостиная',
    status: 'home',
    lastActive: '2024-01-15T10:30:00',
  },
  {
    id: '2',
    name: 'Сара Джонсон',
    avatar: 'https://i.pravatar.cc/150?img=5',
    location: 'Спальня',
    status: 'sleeping',
    lastActive: '2024-01-15T06:00:00',
  },
  {
    id: '3',
    name: 'Майк Чен',
    avatar: 'https://i.pravatar.cc/150?img=8',
    location: 'Отсутствует',
    status: 'away',
    lastActive: '2024-01-15T08:00:00',
  },
  {
    id: '4',
    name: 'Эмма Уилсон',
    avatar: 'https://i.pravatar.cc/150?img=9',
    location: 'Офис',
    status: 'home',
    lastActive: '2024-01-15T10:25:00',
  },
];

export const powerConsumptionData = [
  { name: 'Кондиционер', power: 1500, icon: 'snowflake' },
  { name: 'Освещение', power: 120, icon: 'lightbulb' },
  { name: 'Телевизор', power: 200, icon: 'tv' },
  { name: 'Умные колонки', power: 25, icon: 'speaker' },
];

export const scenes: Scene[] = [
  {
    id: 'morning',
    name: 'Утро',
    icon: '🌅',
    devices: [
      { deviceId: '1', state: 'on' },
      { deviceId: '5', state: 'on' },
      { deviceId: '6', state: 'on' },
    ],
    description: 'Режим пробуждения - свет, кофе'
  },
  {
    id: 'evening',
    name: 'Вечер',
    icon: '🌙',
    devices: [
      { deviceId: '1', state: 'on' },
      { deviceId: '2', state: 'on' },
      { deviceId: '6', state: 'on' },
    ],
    description: 'Режим отдыха - теплый свет, музыка'
  },
  {
    id: 'movie',
    name: 'Кино',
    icon: '🎬',
    devices: [
      { deviceId: '1', state: 'on' },
      { deviceId: '7', state: 'on' },
      { deviceId: '5', state: 'off' },
    ],
    description: 'Режим кино - TV включен, свет приглушен'
  },
  {
    id: 'away',
    name: 'Уход',
    icon: '🏠',
    devices: [
      { deviceId: '1', state: 'off' },
      { deviceId: '2', state: 'off' },
      { deviceId: '3', state: 'on' },
      { deviceId: '5', state: 'off' },
      { deviceId: '6', state: 'off' },
      { deviceId: '7', state: 'off' },
      { deviceId: '8', state: 'off' },
    ],
    description: 'Все устройства выключены кроме безопасности'
  },
  {
    id: 'sleep',
    name: 'Сон',
    icon: '😴',
    devices: [
      { deviceId: '2', state: 'off' },
      { deviceId: '3', state: 'on' },
      { deviceId: '5', state: 'off' },
      { deviceId: '6', state: 'off' },
    ],
    description: 'Ночной режим - минимальное освещение'
  },
  {
    id: 'workout',
    name: 'Спорт',
    icon: '💪',
    devices: [
      { deviceId: '1', state: 'off' },
      { deviceId: '2', state: 'on' },
      { deviceId: '5', state: 'on' },
    ],
    description: 'Активный режим - музыка и свет'
  },
  {
    id: 'reading',
    name: 'Чтение',
    icon: '📚',
    devices: [
      { deviceId: '6', state: 'on' },
      { deviceId: '2', state: 'on' },
    ],
    description: 'Режим фокуса - чтение и музыка'
  },
];

export const rooms: Room[] = [
  {
    id: 'living-room',
    name: 'Гостиная',
    icon: '🛋️',
    devices: [
      { id: '1', name: 'Умный телевизор', type: 'tv', status: 'active', powerConsumption: 120, lastActive: '2024-01-15T10:30:00', isOn: true, room: 'Гостиная' },
      { id: '2', name: 'Умная колонка', type: 'speaker', status: 'active', powerConsumption: 15, lastActive: '2024-01-15T10:25:00', isOn: true, room: 'Гостиная' },
      { id: '6', name: 'Умная лампа', type: 'lamp', status: 'active', powerConsumption: 12, lastActive: '2024-01-15T10:28:00', isOn: true, room: 'Гостиная' },
    ],
    temperature: 22.5,
    humidity: 45,
  },
  {
    id: 'kitchen',
    name: 'Кухня',
    icon: '🍳',
    devices: [
      { id: '5', name: 'Умная розетка', type: 'socket', status: 'active', powerConsumption: 5, lastActive: '2024-01-15T10:30:00', isOn: true, room: 'Кухня' },
      { id: '7', name: 'ТВ на кухне', type: 'tv', status: 'inactive', powerConsumption: 80, lastActive: '2024-01-15T08:00:00', isOn: false, room: 'Кухня' },
    ],
    temperature: 24.0,
    humidity: 50,
  },
  {
    id: 'bedroom',
    name: 'Спальня',
    icon: '🛏️',
    devices: [
      { id: '4', name: 'Умный обогреватель', type: 'heater', status: 'inactive', powerConsumption: 1500, lastActive: '2024-01-14T22:00:00', isOn: false, room: 'Спальня' },
      { id: '8', name: 'Колонка в спальне', type: 'speaker', status: 'inactive', powerConsumption: 10, lastActive: '2024-01-15T07:00:00', isOn: false, room: 'Спальня' },
    ],
    temperature: 20.0,
    humidity: 40,
  },
  {
    id: 'office',
    name: 'Офис',
    icon: '🖥️',
    devices: [
      { id: '3', name: 'Маршрутизатор WiFi', type: 'router', status: 'active', powerConsumption: 10, lastActive: '2024-01-15T10:30:00', isOn: true, room: 'Офис' },
    ],
    temperature: 21.5,
    humidity: 42,
  },
];

export const zoneEntities: ZoneEntity[] = [
  {
    entity_id: 'light.living_room',
    name: 'Гостиная',
    state: 'on',
    attributes: { brightness: 200, color_temp: 400 },
  },
  {
    entity_id: 'light.kitchen',
    name: 'Кухня',
    state: 'off',
    attributes: { brightness: 0 },
  },
  {
    entity_id: 'light.bedroom',
    name: 'Спальня',
    state: 'off',
    attributes: { brightness: 0 },
  },
  {
    entity_id: 'light.office',
    name: 'Офис',
    state: 'on',
    attributes: { brightness: 150 },
  },
  {
    entity_id: 'climate.living_room',
    name: 'Климат Гостиной',
    state: 'on',
    attributes: { temperature: 22.5, humidity: 45 },
  },
  {
    entity_id: 'climate.kitchen',
    name: 'Климат Кухни',
    state: 'off',
    attributes: { temperature: 0, humidity: 0 },
  },
  {
    entity_id: 'sensor.temperature_living_room',
    name: 'Температура Гостиной',
    state: '22.5',
    attributes: { unit_of_measurement: '°C' },
  },
  {
    entity_id: 'sensor.humidity_living_room',
    name: 'Влажность Гостиной',
    state: '45',
    attributes: { unit_of_measurement: '%' },
  },
  {
    entity_id: 'sensor.temperature_kitchen',
    name: 'Температура Кухни',
    state: '24.0',
    attributes: { unit_of_measurement: '°C' },
  },
  {
    entity_id: 'sensor.humidity_kitchen',
    name: 'Влажность Кухни',
    state: '50',
    attributes: { unit_of_measurement: '%' },
  },
  {
    entity_id: 'sensor.temperature_bedroom',
    name: 'Температура Спальни',
    state: '20.0',
    attributes: { unit_of_measurement: '°C' },
  },
  {
    entity_id: 'sensor.humidity_bedroom',
    name: 'Влажность Спальни',
    state: '40',
    attributes: { unit_of_measurement: '%' },
  },
  {
    entity_id: 'sensor.temperature_office',
    name: 'Температура Офиса',
    state: '21.5',
    attributes: { unit_of_measurement: '°C' },
  },
  {
    entity_id: 'sensor.humidity_office',
    name: 'Влажность Офиса',
    state: '42',
    attributes: { unit_of_measurement: '%' },
  },
  {
    entity_id: 'binary_sensor.motion_living_room',
    name: 'Движение в Гостиной',
    state: 'off',
    attributes: { device_class: 'motion' },
  },
  {
    entity_id: 'binary_sensor.motion_kitchen',
    name: 'Движение на Кухне',
    state: 'off',
    attributes: { device_class: 'motion' },
  },
  {
    entity_id: 'binary_sensor.motion_bedroom',
    name: 'Движение в Спальне',
    state: 'off',
    attributes: { device_class: 'motion' },
  },
  {
    entity_id: 'binary_sensor.motion_office',
    name: 'Движение в Офисе',
    state: 'off',
    attributes: { device_class: 'motion' },
  },
  {
    entity_id: 'switch.porch_light',
    name: 'Уличный свет',
    state: 'off',
    attributes: { device_class: 'outlet' },
  },
  {
    entity_id: 'switch.garage_door',
    name: 'Гаражные ворота',
    state: 'closed',
    attributes: { device_class: 'garage_door' },
  },
];

export const weather: WeatherData = {
  temperature: 22,
  condition: 'sunny',
  humidity: 45,
  windSpeed: 3,
  feelsLike: 23,
  location: 'Москва, Россия'
};
