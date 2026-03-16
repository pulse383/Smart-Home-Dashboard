// Объявляем MCP функции для TypeScript
declare global {
  namespace NodeJS {
    interface Global {
      mcp_home_assistant_ha_get_zone: () => Promise<any[]>;
      mcp_home_assistant_ha_get_device: () => Promise<any[]>;
      mcp_home_assistant_ha_get_state: (entityId: string) => Promise<any>;
      mcp_home_assistant_ha_get_overview: () => Promise<any>;
      mcp_home_assistant_ha_get_statistics: (entityId: string) => Promise<any[]>;
      mcp_home_assistant_ha_config_get_calendar_events: (entityId: string) => Promise<any[]>;
      mcp_home_assistant_ha_get_entity_exposure: (entityId?: string) => Promise<any>;
      mcp_home_assistant_ha_get_logbook: (params?: any) => Promise<any[]>;
      mcp_home_assistant_ha_get_automation_traces: (automationId: string, runId?: string) => Promise<any>;
      mcp_home_assistant_ha_call_service: (domain: string, service: string, entity_id?: string, data?: any) => Promise<any>;
      mcp_home_assistant_ha_eval_template: (template: string) => Promise<any>;
      mcp_home_assistant_ha_deep_search: (query: string, searchTypes?: string[]) => Promise<any[]>;
    }
  }
}

import type {
  HomeAssistantState,
  ThermostatData,
  ZoneData,
  WeatherData,
  DeviceData
} from '../types';

// Функция для получения состояний сущностей
export async function getHomeAssistantStates(entityIds: string[]): Promise<HomeAssistantState[]> {
  try {
    if (!entityIds || entityIds.length === 0) {
      return [];
    }

    // @ts-ignore - MCP функции доступны глобально через MCP сервер
    const states = await mcp_home_assistant_ha_get_state(entityIds.join(','));

    if (!states) {
      console.warn('Не получены состояния для сущностей:', entityIds);
      return [];
    }

    const statesArray = Array.isArray(states) ? states : [states];

    return statesArray.map((state: any) => ({
      entity_id: state.entity_id || state.entity,
      state: state.state || state,
      attributes: state.attributes || {},
    }));
  } catch (error) {
    console.error('Ошибка при получении состояний:', error);
    return [];
  }
}

// Функция для получения всех зон из Home Assistant
export async function getHomeAssistantZones(): Promise<HomeAssistantState[]> {
  try {
    // Получаем все зоны
    // @ts-ignore - MCP функции доступны глобально через MCP сервер
    const zones = await mcp_home_assistant_ha_get_zone();

    // Преобразуем в нужный формат
    return zones.map((zone: any) => ({
      entity_id: zone.zone_id || zone.entity_id,
      state: zone.name || zone.state,
      attributes: {
        latitude: zone.latitude,
        longitude: zone.longitude,
        radius: zone.radius
      }
    }));
  } catch (error) {
    console.error('Ошибка при получении зон:', error);
    return [];
  }
}

// Функция для получения всех устройств из Home Assistant
export async function getHomeAssistantDevices(): Promise<HomeAssistantState[]> {
  try {
    // Получаем все устройства
    // @ts-ignore - MCP функции доступны глобально через MCP сервер
    const devices = await mcp_home_assistant_ha_get_device();

    // Преобразуем в нужный формат
    return devices.map((device: any) => ({
      entity_id: device.entity_id,
      state: device.state,
      attributes: device.attributes || {}
    }));
  } catch (error) {
    console.error('Ошибка при получении устройств:', error);
    return [];
  }
}

// Функция для получения термостата из Home Assistant
export async function getHomeAssistantThermostat(): Promise<ThermostatData | null> {
  try {
    // Получаем состояние термостата
    // @ts-ignore - MCP функции доступны глобально через MCP сервер
    const thermostat = await mcp_home_assistant_ha_get_state('climate.thermostat');

    if (!thermostat) {
      return null;
    }

    return {
      temperature: thermostat.attributes?.current_temperature || 0,
      targetTemp: thermostat.attributes?.temperature || 0,
      humidity: thermostat.attributes?.humidity || 0,
      mode: thermostat.attributes?.hvac_mode || 'auto',
      fanSpeed: 'medium',
      isOn: thermostat.state === 'heat' || thermostat.state === 'cool' || thermostat.state === 'auto'
    };
  } catch (error) {
    console.error('Ошибка при получении термостата:', error);
    return null;
  }
}

// Функция для получения погоды из Home Assistant
export async function getHomeAssistantWeather(): Promise<WeatherData | null> {
  try {
    // Получаем состояние погоды
    // @ts-ignore - MCP функции доступны глобально через MCP сервер
    const weather = await mcp_home_assistant_ha_get_state('weather.home');

    if (!weather) {
      return null;
    }

    return {
      temperature: weather.attributes?.temperature || 0,
      humidity: weather.attributes?.humidity || 0,
      condition: weather.attributes?.weather || 'sunny',
      windSpeed: weather.attributes?.wind_speed || 0,
      feelsLike: weather.attributes?.apparent_temperature || 0,
      location: weather.attributes?.friendly_name || 'Home'
    };
  } catch (error) {
    console.error('Ошибка при получении погоды:', error);
    return null;
  }
}

// Функция для получения всех сущностей по зоне
export async function getZoneEntities(zoneId: string): Promise<HomeAssistantState[]> {
  try {
    // Получаем все устройства
    // @ts-ignore - MCP функции доступны глобально через MCP сервер
    const devices = await mcp_home_assistant_ha_get_device();

    // Фильтруем устройства по зоне
    return devices
      .filter((device: any) => device.area_id === zoneId)
      .map((device: any) => ({
        entity_id: device.entity_id,
        state: device.state,
        attributes: device.attributes || {}
      }));
  } catch (error) {
    console.error(`Ошибка при получении сущностей для зоны ${zoneId}:`, error);
    return [];
  }
}

// Функция для получения состояния сущности
export async function getEntityState(entityId: string): Promise<HomeAssistantState | null> {
  try {
    // @ts-ignore - MCP функции доступны глобально через MCP сервер
    return await mcp_home_assistant_ha_get_state(entityId);
  } catch (error) {
    console.error(`Ошибка при получении состояния сущности ${entityId}:`, error);
    return null;
  }
}

// Функция для получения всех entity_ids
export async function getAllEntityIds(): Promise<string[]> {
  try {
    // @ts-ignore - MCP функции доступны глобально через MCP сервер
    const overview = await mcp_home_assistant_ha_get_overview();
    const entityIds: string[] = [];
    
    // Извлекаем entity_ids из overview
    if (overview.entities) {
      Object.keys(overview.entities).forEach(key => {
        entityIds.push(key);
      });
    }
    
    return entityIds;
  } catch (error) {
    console.error('Ошибка при получении всех entity_ids:', error);
    return [];
  }
}

// Функция для получения всех сущностей
export async function getAllEntities(): Promise<HomeAssistantState[]> {
  try {
    // @ts-ignore - MCP функции доступны глобально через MCP сервер
    const devices = await mcp_home_assistant_ha_get_device();
    return devices.map((device: any) => ({
      entity_id: device.entity_id,
      state: device.state,
      attributes: device.attributes || {}
    }));
  } catch (error) {
    console.error('Ошибка при получении всех сущностей:', error);
    return [];
  }
}

// Функция для получения качества воздуха
export async function getAirQuality(): Promise<{ aqi: number; pm25: number; pm10: number; co2: number; level: string } | null> {
  try {
    console.log('[getAirQuality] Запрос качества воздуха...');
    
    // Получаем сенсоры качества воздуха
    // @ts-ignore - MCP функции доступны глобально через MCP сервер
    const states = await mcp_home_assistant_ha_get_state('sensor.air_quality_aqi,sensor.air_quality_pm25,sensor.air_quality_pm10,sensor.air_quality_co2');
    
    if (!states) {
      console.warn('[getAirQuality] Не получены данные качества воздуха');
      return null;
    }
    
    const statesArray = Array.isArray(states) ? states : [states];
    
    const aqiState = statesArray.find((s: any) => s.entity_id?.includes('aqi'));
    const pm25State = statesArray.find((s: any) => s.entity_id?.includes('pm25'));
    const pm10State = statesArray.find((s: any) => s.entity_id?.includes('pm10'));
    const co2State = statesArray.find((s: any) => s.entity_id?.includes('co2'));
    
    const aqi = aqiState ? parseFloat(aqiState.state) || 0 : 0;
    const pm25 = pm25State ? parseFloat(pm25State.state) || 0 : 0;
    const pm10 = pm10State ? parseFloat(pm10State.state) || 0 : 0;
    const co2 = co2State ? parseFloat(co2State.state) || 0 : 0;
    
    // Определяем уровень качества воздуха
    let level: 'good' | 'moderate' | 'poor' | 'hazardous' = 'good';
    if (aqi > 100 || co2 > 1000) {
      level = 'moderate';
    }
    if (aqi > 150 || co2 > 1500) {
      level = 'poor';
    }
    if (aqi > 200 || co2 > 2000) {
      level = 'hazardous';
    }
    
    const result = { aqi, pm25, pm10, co2, level };
    console.log('[getAirQuality] Данные получены:', result);
    
    return result;
  } catch (error) {
    console.error('[getAirQuality] Ошибка при получении качества воздуха:', error);
    return null;
  }
}

// Функция для получения occupants
export async function getOccupants(): Promise<{ id: string; name: string; avatar: string; location: string; status: string | 'home' | 'away' | 'sleeping' }[] | null> {
  try {
    console.log('[getOccupants] Запрос occupants...');
    
    // Получаем устройства с типом person
    // @ts-ignore - MCP функции доступны глобально через MCP сервер
    const overview = await mcp_home_assistant_ha_get_overview();
    
    if (!overview) {
      console.warn('[getOccupants] Не получен overview');
      return null;
    }
    
    // Ищем устройства типа person
    const occupants: { id: string; name: string; avatar: string; location: string; status: string }[] = [];
    
    if (overview.entities) {
      Object.entries(overview.entities).forEach(([entityId, entity]: [string, any]) => {
        // Проверяем, что это устройство типа person
        if (entity?.device?.type === 'person' || entityId?.startsWith('person.')) {
          const name = entity?.attributes?.friendly_name || entityId;
          const status = entity?.state || 'unknown';
          
          occupants.push({
            id: entityId,
            name: name,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
            location: entity?.attributes?.area || 'Unknown',
            status: status
          });
        }
      });
    }
    
    console.log('[getOccupants] Данные получены:', occupants);
    return occupants;
  } catch (error) {
    console.error('[getOccupants] Ошибка при получении occupants:', error);
    return null;
  }
}

// Функция для получения статистики за период
export async function getStatistics(
  entityId: string,
  start_time?: string,
  end_time?: string,
  period: '5minute' | 'hour' | 'day' | 'week' | 'month' = 'day',
  statistic_types: ('mean' | 'min' | 'max' | 'sum' | 'state' | 'change')[] = ['mean', 'min', 'max']
): Promise<{ period: string; statistics: any[]; unit_of_measurement?: string }[] | null> {
  try {
    console.log(`[getStatistics] Запрос статистики для ${entityId}, период: ${period}`);
    
    // @ts-ignore - MCP функции доступны глобально через MCP сервер
    const stats = await mcp_home_assistant_ha_get_statistics(
      JSON.stringify({
        entity_ids: entityId,
        start_time: start_time || '30d',
        end_time: end_time || 'now',
        period,
        statistic_types
      })
    );
    
    if (!stats) {
      console.warn(`[getStatistics] Не получены данные для ${entityId}`);
      return null;
    }
    
    console.log(`[getStatistics] Данные получены для ${entityId}`);
    return stats;
  } catch (error) {
    console.error(`[getStatistics] Ошибка при получении статистики для ${entityId}:`, error);
    return null;
  }
}

// Функция для получения статистики энергопотребления
export async function getEnergyStatistics(): Promise<any[]> {
  try {
    // @ts-ignore - MCP функции доступны глобально через MCP сервер
    const stats = await mcp_home_assistant_ha_get_statistics('sensor.energy_consumption');

    return stats.map((stat: any) => ({
      day: stat.period,
      usage: stat.state,
      unit: stat.unit_of_measurement
    }));
  } catch (error) {
    console.error('Ошибка при получении статистики энергопотребления:', error);
    return [];
  }
}

// Функция для получения календаря событий
export async function getCalendarEvents(): Promise<any[]> {
  try {
    // @ts-ignore - MCP функции доступны глобально через MCP сервер
    const events = await mcp_home_assistant_ha_config_get_calendar_events('calendar.family');

    return events.map((event: any) => ({
      summary: event.summary,
      start: event.start,
      end: event.end,
      description: event.description,
      location: event.location
    }));
  } catch (error) {
    console.error('Ошибка при получении календаря:', error);
    return [];
  }
}

// Функция для получения списка уведомлений
export async function getNotifications(): Promise<any[]> {
  try {
    // @ts-ignore - MCP функции доступны глобально через MCP сервер
    const notifications = await mcp_home_assistant_ha_get_state('persistent_notification.all_notifications');

    if (!notifications) {
      return [];
    }

    return notifications.attributes?.notifications || [];
  } catch (error) {
    console.error('Ошибка при получении уведомлений:', error);
    return [];
  }
}

// Функция для получения списка сцен
export async function getScenes(): Promise<any[]> {
  try {
    // @ts-ignore - MCP функции доступны глобально через MCP сервер
    const scenes = await mcp_home_assistant_ha_get_state('scene.all_scenes');

    if (!scenes) {
      return [];
    }

    return scenes.attributes?.scenes || [];
  } catch (error) {
    console.error('Ошибка при получении сцен:', error);
    return [];
  }
}

// Функция для получения списка устройств
export async function getDevices(): Promise<DeviceData[]> {
  try {
    // @ts-ignore - MCP функции доступны глобально через MCP сервер
    const devices = await mcp_home_assistant_ha_get_device();

    return devices.map((device: any) => ({
      entity_id: device.entity_id,
      name: device.name || device.attributes?.friendly_name,
      state: device.state,
      attributes: device.attributes || {}
    }));
  } catch (error) {
    console.error('Ошибка при получении устройств:', error);
    return [];
  }
}

// Функция для получения списка людей
export async function getPersons(): Promise<any[]> {
  try {
    // @ts-ignore - MCP функции доступны глобально через MCP сервер
    const persons = await mcp_home_assistant_ha_get_state('person.all_persons');

    if (!persons) {
      return [];
    }

    return persons.attributes?.persons || [];
  } catch (error) {
    console.error('Ошибка при получении людей:', error);
    return [];
  }
}

// Функция для получения списка зон
export async function getZones(): Promise<any[]> {
  try {
    // @ts-ignore - MCP функции доступны глобально через MCP сервер
    const zones = await mcp_home_assistant_ha_get_zone();

    return zones.map((zone: any) => ({
      id: zone.zone_id,
      name: zone.name,
      latitude: zone.latitude,
      longitude: zone.longitude,
      radius: zone.radius
    }));
  } catch (error) {
    console.error('Ошибка при получении зон:', error);
    return [];
  }
}

// Функция для получения зон с сущностями
export async function getZonesWithEntities(): Promise<ZoneData[]> {
  try {
    // @ts-ignore - MCP функции доступны глобально через MCP сервер
    const zones = await mcp_home_assistant_ha_get_zone();
    // @ts-ignore - MCP функции доступны глобально через MCP сервер
    const devices = await mcp_home_assistant_ha_get_device();

    return zones.map((zone: any) => ({
      id: zone.zone_id,
      name: zone.name,
      entities: devices
        .filter((device: any) => device.area_id === zone.zone_id)
        .map((device: any) => ({
          entity_id: device.entity_id,
          name: device.name,
          state: device.state,
          attributes: device.attributes || {}
        }))
    }));
  } catch (error) {
    console.error('Ошибка при получении зон с сущностями:', error);
    return [];
  }
}
