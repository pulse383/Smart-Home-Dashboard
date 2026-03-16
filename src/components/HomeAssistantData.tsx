import React, { useState, useEffect } from 'react';
import type { ThermostatData, ZoneData, WeatherData, DeviceData, HomeAssistantState, AirQuality, Occupant } from '../types/index';
import { getHomeAssistantStates, getAirQuality, getOccupants, getAllEntityIds } from '../lib/homeAssistant';

type UseHomeAssistantDataOptions = {
  includeAllEntities?: boolean;
};

export function useHomeAssistantData(options: UseHomeAssistantDataOptions = {}) {
  const { includeAllEntities = false } = options;
  const [thermostatData, setThermostatData] = useState<ThermostatData>({
    temperature: 22,
    targetTemp: 22,
    humidity: 50,
    isOn: false,
    mode: 'auto',
    fanSpeed: 'medium',
  });

  const [zoneData, setZoneData] = useState<ZoneData[]>([
    { id: 'living_room', name: 'Living Room', entities: [] },
    { id: 'bedroom', name: 'Bedroom', entities: [] },
    { id: 'kitchen', name: 'Kitchen', entities: [] },
    { id: 'hallway', name: 'Hallway', entities: [] },
  ]);

  const [weatherData, setWeatherData] = useState<WeatherData>({
    temperature: 20,
    humidity: 50,
    condition: 'sunny',
    windSpeed: 5,
    feelsLike: 20,
    location: 'Home',
  });

  const [deviceData, setDeviceData] = useState<DeviceData[]>([
    { entity_id: 'light.living_room', name: 'Living Room Light', state: 'off', attributes: {} },
    { entity_id: 'light.bedroom', name: 'Bedroom Light', state: 'off', attributes: {} },
    { entity_id: 'light.kitchen', name: 'Kitchen Light', state: 'off', attributes: {} },
    { entity_id: 'light.porch', name: 'Porch Light', state: 'off', attributes: {} },
  ]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [airQuality, setAirQuality] = useState<AirQuality | null>(null);
  const [occupants, setOccupants] = useState<Occupant[] | null>(null);
  const [allStates, setAllStates] = useState<HomeAssistantState[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        await Promise.all([
          fetchThermostatData(),
          fetchZoneData(),
          fetchWeatherData(),
          fetchDeviceData(),
          fetchAirQuality(),
          fetchOccupants(),
        ]);
        if (includeAllEntities) {
          try {
            const entityIds = await getAllEntityIds();
            if (entityIds.length > 0) {
              const states = await getHomeAssistantStates(entityIds);
              setAllStates(states);
            } else {
              setAllStates([]);
            }
          } catch (innerError) {
            console.error('Ошибка при загрузке всех сущностей Home Assistant:', innerError);
            setAllStates([]);
          }
        }
      } catch (err) {
        console.error('Ошибка загрузки данных Home Assistant:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchAirQuality = async () => {
    try {
      console.log('[fetchAirQuality] Получение качества воздуха...');
      const quality = await getAirQuality();
      setAirQuality(quality);
      console.log('[fetchAirQuality] Качество воздуха получено:', quality);
    } catch (error) {
      console.error('[fetchAirQuality] Ошибка при получении качества воздуха:', error);
    }
  };

  const fetchOccupants = async () => {
    try {
      console.log('[fetchOccupants] Получение occupants...');
      const people = await getOccupants();
      setOccupants(people);
      console.log('[fetchOccupants] Occupants получены:', people);
    } catch (error) {
      console.error('[fetchOccupants] Ошибка при получении occupants:', error);
    }
  };

  const fetchThermostatData = async () => {
    try {
      console.log('[fetchThermostatData] Получение данных термостата...');
      
      const states = await getHomeAssistantStates([
        'climate.living_room',
        'sensor.temperature',
        'sensor.humidity',
      ]);
      
      if (!states || states.length === 0) {
        console.warn('[fetchThermostatData] Нет данных для термостата');
        return;
      }
      
      const climateState = states.find((s: HomeAssistantState) => s.entity_id === 'climate.living_room');
      const tempState = states.find((s: HomeAssistantState) => s.entity_id === 'sensor.temperature');
      const humidityState = states.find((s: HomeAssistantState) => s.entity_id === 'sensor.humidity');
      
      if (climateState) {
        setThermostatData(prev => ({
          ...prev,
          temperature: parseFloat(climateState.attributes?.current_temperature) || prev.temperature,
          targetTemp: parseFloat(climateState.attributes?.temperature) || prev.targetTemp,
          humidity: parseFloat(humidityState?.state) || prev.humidity,
          isOn: climateState.state === 'heat' || climateState.state === 'cool' || climateState.state === 'auto',
          mode: climateState.attributes?.hvac_mode || 'auto',
          fanSpeed: 'medium',
        }));
      }
      
      if (tempState) {
        setThermostatData(prev => ({
          ...prev,
          temperature: parseFloat(tempState.state) || prev.temperature,
        }));
      }
      
      console.log('[fetchThermostatData] Данные термостата получены:', thermostatData);
    } catch (error) {
      console.error('[fetchThermostatData] Ошибка при получении данных термостата:', error);
    }
  };

  const fetchZoneData = async () => {
    try {
      const states = await getHomeAssistantStates([
        'sensor.living_room_temp',
        'sensor.bedroom_temp',
        'sensor.kitchen_temp',
        'sensor.hallway_temp',
      ]);

      const zones = [
        { id: 'living_room', name: 'Living Room', entity: 'sensor.living_room_temp' },
        { id: 'bedroom', name: 'Bedroom', entity: 'sensor.bedroom_temp' },
        { id: 'kitchen', name: 'Kitchen', entity: 'sensor.kitchen_temp' },
        { id: 'hallway', name: 'Hallway', entity: 'sensor.hallway_temp' },
      ];

      const zoneList = zones.map(zone => {
        const state = states.find((s: HomeAssistantState) => s.entity_id === zone.entity);
        return {
          id: zone.id,
          name: zone.name,
          entities: [],
          temperature: state ? parseFloat(state.state) : 20,
          humidity: 45,
          isOccupied: false,
        };
      });

      setZoneData(zoneList);
    } catch (error) {
      console.error('Ошибка при получении данных зон:', error);
    }
  };

  const normalizeWeatherCondition = (value?: string) => {
    const normalized = (value || '').toLowerCase();
    if (['sunny', 'clear'].includes(normalized)) return 'sunny';
    if (['cloudy', 'partlycloudy', 'overcast'].includes(normalized)) return 'cloudy';
    if (['rainy', 'rain', 'pouring', 'lightning', 'lightning-rainy'].includes(normalized)) return 'rainy';
    if (['snowy', 'snow', 'snowy-rainy'].includes(normalized)) return 'snowy';
    if (['windy', 'wind'].includes(normalized)) return 'windy';
    return 'sunny';
  };

  const fetchWeatherData = async () => {
    try {
      const states = await getHomeAssistantStates([
        'sensor.weather_temperature',
        'sensor.weather_humidity',
        'sensor.weather_condition',
        'sensor.weather_wind_speed',
      ]);

      const tempState = states.find((s: HomeAssistantState) => s.entity_id === 'sensor.weather_temperature');
      const humidityState = states.find((s: HomeAssistantState) => s.entity_id === 'sensor.weather_humidity');
      const conditionState = states.find((s: HomeAssistantState) => s.entity_id === 'sensor.weather_condition');
      const windState = states.find((s: HomeAssistantState) => s.entity_id === 'sensor.weather_wind_speed');

      setWeatherData({
        temperature: tempState ? parseFloat(tempState.state) : 20,
        humidity: humidityState ? parseFloat(humidityState.state) : 50,
        condition: normalizeWeatherCondition(conditionState?.state),
        windSpeed: windState ? parseFloat(windState.state) : 5,
        feelsLike: tempState ? parseFloat(tempState.state) : 20,
        location: 'Home',
      });
    } catch (error) {
      console.error('Ошибка при получении данных погоды:', error);
    }
  };

  const fetchDeviceData = async () => {
    try {
      const states = await getHomeAssistantStates([
        'light.living_room',
        'light.bedroom',
        'light.kitchen',
        'switch.porch_light',
      ]);

      const devices = [
        { id: 'living_room', name: 'Living Room Light', entity: 'light.living_room' },
        { id: 'bedroom', name: 'Bedroom Light', entity: 'light.bedroom' },
        { id: 'kitchen', name: 'Kitchen Light', entity: 'light.kitchen' },
        { id: 'porch', name: 'Porch Light', entity: 'switch.porch_light' },
      ];

      const deviceList = devices.map(device => {
        const state = states.find((s: HomeAssistantState) => s.entity_id === device.entity);
        return {
          entity_id: device.entity,
          name: device.name,
          state: state?.state || 'off',
          attributes: state?.attributes || {},
          is_on: state?.state === 'on',
          power_consumption: 0,
        };
      });

      setDeviceData(deviceList);
    } catch (error) {
      console.error('Ошибка при получении данных устройств:', error);
    }
  };

  return {
    thermostatData,
    zoneData,
    weatherData,
    deviceData,
    loading,
    error,
    airQuality,
    occupants,
    allStates,
  };
}
