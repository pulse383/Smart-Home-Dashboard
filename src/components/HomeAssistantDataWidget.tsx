import React, { useEffect, useState } from 'react';
import type { EnergyUsage, Notification, Scene } from '../types';
import { getEnergyStatistics, getNotifications, getScenes } from '../lib/homeAssistant';
import { useHomeAssistantData } from './HomeAssistantData';

export default function HomeAssistantDataWidget() {
  const {
    thermostatData,
    zoneData,
    weatherData,
    deviceData,
    airQuality,
    occupants,
    loading,
    error,
  } = useHomeAssistantData();

  const [energy, setEnergy] = useState<EnergyUsage[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [extrasLoading, setExtrasLoading] = useState(true);

  useEffect(() => {
    const fetchExtras = async () => {
      try {
        const [energyData, notificationsData, scenesData] = await Promise.all([
          getEnergyStatistics(),
          getNotifications(),
          getScenes()
        ]);

        setEnergy(energyData);
        setNotifications(notificationsData);
        setScenes(scenesData);
      } catch (extraError) {
        console.error('Ошибка при получении дополнительных данных Home Assistant:', extraError);
      } finally {
        setExtrasLoading(false);
      }
    };

    fetchExtras();
  }, []);

  if (loading || extrasLoading) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Данные Home Assistant</h2>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Данные Home Assistant</h2>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Ошибка: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Данные Home Assistant</h2>

      {/* Термостат */}
      {thermostatData && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Термостат</h3>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-gray-600">Температура:</span>
                <span className="ml-2 font-bold text-blue-600">{thermostatData.temperature}°C</span>
              </div>
              <div>
                <span className="text-gray-600">Целевая температура:</span>
                <span className="ml-2 font-bold text-green-600">{thermostatData.targetTemp}°C</span>
              </div>
              <div>
                <span className="text-gray-600">Влажность:</span>
                <span className="ml-2 font-bold text-purple-600">{thermostatData.humidity}%</span>
              </div>
              <div>
                <span className="text-gray-600">Режим:</span>
                <span className="ml-2 font-bold text-orange-600">{thermostatData.mode}</span>
              </div>
              <div>
                <span className="text-gray-600">Вентилятор:</span>
                <span className="ml-2 font-bold text-cyan-600">{thermostatData.fanSpeed}</span>
              </div>
              <div>
                <span className="text-gray-600">Статус:</span>
                <span className={`ml-2 font-bold ${thermostatData.isOn ? 'text-green-600' : 'text-red-600'}`}>
                  {thermostatData.isOn ? 'Включен' : 'Выключен'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Зоны */}
      {zoneData.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Зоны</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {zoneData.map((zone) => (
              <div key={zone.id} className="bg-white rounded-lg shadow-md p-4">
                <h4 className="font-semibold mb-2 text-gray-800">{zone.name}</h4>
                <div className="text-sm text-gray-600">
                  <p>Сущностей: {zone.entities.length}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Погода */}
      {weatherData && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Погода</h3>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-gray-600">Температура:</span>
                <span className="ml-2 font-bold text-blue-600">{weatherData.temperature}°C</span>
              </div>
              <div>
                <span className="text-gray-600">Влажность:</span>
                <span className="ml-2 font-bold text-purple-600">{weatherData.humidity}%</span>
              </div>
              <div>
                <span className="text-gray-600">Скорость ветра:</span>
                <span className="ml-2 font-bold text-teal-600">{weatherData.windSpeed} м/с</span>
              </div>
              <div>
                <span className="text-gray-600">Условия:</span>
                <span className="ml-2 font-bold text-gray-800">{weatherData.condition}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Устройства */}
      {deviceData.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Устройства</h3>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {deviceData.slice(0, 12).map((device) => (
                <div key={device.entity_id} className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm font-medium text-gray-800">
                    {device.attributes?.friendly_name || device.name || device.entity_id}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">{device.entity_id}</div>
                  <div className="text-xs mt-2">
                    <span className={`inline-block px-2 py-1 rounded ${
                      device.state === 'on' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {device.state}
                    </span>
                  </div>
                </div>
              ))}
              {deviceData.length > 12 && (
                <div className="bg-gray-50 rounded-lg p-3 col-span-full">
                  <div className="text-sm text-gray-600">
                    И еще {deviceData.length - 12} устройств
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Энергопотребление */}
      {energy.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Энергопотребление</h3>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {energy.map((item) => (
                <div key={item.day} className="flex justify-between items-center">
                  <span className="text-gray-600">{item.day}</span>
                  <span className="font-bold text-blue-600">
                    {item.usage} {item.unit || 'кВт·ч'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Качество воздуха */}
      {airQuality && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Качество воздуха</h3>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-gray-600">AQI:</span>
                <span className={`ml-2 font-bold ${
                  airQuality.level === 'good' ? 'text-green-600' :
                  airQuality.level === 'moderate' ? 'text-yellow-600' :
                  airQuality.level === 'poor' ? 'text-orange-600' : 'text-red-600'
                }`}>
                  {airQuality.aqi}
                </span>
              </div>
              <div>
                <span className="text-gray-600">PM2.5:</span>
                <span className="ml-2 font-bold text-gray-800">{airQuality.pm25}</span>
              </div>
              <div>
                <span className="text-gray-600">PM10:</span>
                <span className="ml-2 font-bold text-gray-800">{airQuality.pm10}</span>
              </div>
              <div>
                <span className="text-gray-600">CO2:</span>
                <span className="ml-2 font-bold text-gray-800">{airQuality.co2}</span>
              </div>
              <div>
                <span className="text-gray-600">VOC:</span>
                <span className="ml-2 font-bold text-gray-800">{airQuality.voc || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-600">Уровень:</span>
                <span className={`ml-2 font-bold ${
                  airQuality.level === 'good' ? 'text-green-600' :
                  airQuality.level === 'moderate' ? 'text-yellow-600' :
                  airQuality.level === 'poor' ? 'text-orange-600' : 'text-red-600'
                }`}>
                  {airQuality.level}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Occupants */}
      {occupants && occupants.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Residents</h3>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {occupants.map((occupant) => (
                <div key={occupant.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                      {occupant.name.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <div className="font-medium text-gray-800">{occupant.name}</div>
                      <div className="text-sm text-gray-600">{occupant.location}</div>
                    </div>
                  </div>
                  <div className="text-sm">
                    <span className={`inline-block px-2 py-1 rounded ${
                      occupant.status === 'home' ? 'bg-green-100 text-green-800' :
                      occupant.status === 'away' ? 'bg-gray-100 text-gray-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {occupant.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Уведомления */}
      {notifications.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Уведомления</h3>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="space-y-2">
              {notifications.map((notification) => (
                <div key={notification.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${
                      notification.type === 'info' ? 'bg-blue-500' :
                      notification.type === 'warning' ? 'bg-yellow-500' :
                      notification.type === 'error' ? 'bg-red-500' : 'bg-green-500'
                    }`}>
                      {notification.type.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-800">{notification.message}</div>
                      <div className="text-xs text-gray-500">{notification.timestamp}</div>
                    </div>
                  </div>
                  <div className="text-sm">
                    <span className={`inline-block px-2 py-1 rounded ${
                      notification.read ? 'bg-gray-100 text-gray-600' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {notification.read ? 'Прочитано' : 'Непрочитано'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Сцены */}
      {scenes.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Сцены</h3>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {scenes.map((scene) => (
                <div key={scene.id} className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-sm font-medium text-gray-800 mb-2">{scene.name}</div>
                  <div className="text-xs text-gray-600 mb-2">{scene.description}</div>
                  <div className="text-xs">
                    <span className="inline-block px-2 py-1 rounded bg-purple-100 text-purple-800">
                      {scene.devices.length} устройств
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
