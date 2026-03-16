import React from 'react';
import { useHomeAssistantData } from './HomeAssistantData';

export function HomeAssistantAllData() {
  const {
    thermostatData,
    zoneData,
    weatherData,
    deviceData,
    allStates,
    loading,
    error,
  } = useHomeAssistantData({ includeAllEntities: true });

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center text-secondary-500">
          <p>Загрузка данных из Home Assistant...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Ошибка: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-4">
          <p className="text-sm text-secondary-500">Всего сущностей</p>
          <p className="text-2xl font-bold text-secondary-900">{allStates.length}</p>
        </div>
        <div className="glass-card rounded-xl p-4">
          <p className="text-sm text-secondary-500">Устройств</p>
          <p className="text-2xl font-bold text-primary-600">{deviceData.filter(d => d.is_on).length}</p>
        </div>
        <div className="glass-card rounded-xl p-4">
          <p className="text-sm text-secondary-500">Зон</p>
          <p className="text-2xl font-bold text-green-500">{zoneData.length}</p>
        </div>
        <div className="glass-card rounded-xl p-4">
          <p className="text-sm text-secondary-500">Температура</p>
          <p className="text-2xl font-bold text-orange-500">
            {thermostatData?.temperature.toFixed(1)}°C
          </p>
        </div>
      </div>

      {/* Термостат */}
      {thermostatData && (
        <div className="glass-card rounded-xl p-6">
          <h2 className="text-xl font-bold text-secondary-900 mb-4">Термостат</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-secondary-500">Текущая температура</p>
              <p className="text-2xl font-bold text-secondary-900">
                {thermostatData.temperature.toFixed(1)}°C
              </p>
            </div>
            <div>
              <p className="text-sm text-secondary-500">Целевая температура</p>
              <p className="text-2xl font-bold text-primary-600">
                {thermostatData.targetTemp.toFixed(1)}°C
              </p>
            </div>
            <div>
              <p className="text-sm text-secondary-500">Режим</p>
              <p className="text-2xl font-bold text-secondary-900">
                {thermostatData.mode}
              </p>
            </div>
            <div>
              <p className="text-sm text-secondary-500">Вентилятор</p>
              <p className="text-2xl font-bold text-secondary-900">
                {thermostatData.fanSpeed}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Зоны */}
      <div className="glass-card rounded-xl p-6">
        <h2 className="text-xl font-bold text-secondary-900 mb-4">Зоны</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {zoneData.map(zone => (
            <div key={zone.id} className="border border-secondary-200 rounded-lg p-4">
              <h3 className="font-bold text-secondary-900 mb-2">{zone.name}</h3>
              <div className="space-y-2">
                {zone.entities.map(entity => (
                  <div key={entity.entity_id} className="text-sm">
                    <p className="text-secondary-600">{entity.entity_id}</p>
                    <p className="text-secondary-900 font-medium">{entity.state}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Погода */}
      {weatherData && (
        <div className="glass-card rounded-xl p-6">
          <h2 className="text-xl font-bold text-secondary-900 mb-4">Погода</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-secondary-500">Температура</p>
              <p className="text-2xl font-bold text-secondary-900">
                {weatherData.temperature.toFixed(1)}°C
              </p>
            </div>
            <div>
              <p className="text-sm text-secondary-500">Влажность</p>
              <p className="text-2xl font-bold text-blue-500">
                {weatherData.humidity}%
              </p>
            </div>
            <div>
              <p className="text-sm text-secondary-500">Условия</p>
              <p className="text-2xl font-bold text-secondary-900">
                {weatherData.condition}
              </p>
            </div>
            <div>
              <p className="text-sm text-secondary-500">Ветер</p>
              <p className="text-2xl font-bold text-secondary-900">
                {weatherData.windSpeed} м/с
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Устройства */}
      <div className="glass-card rounded-xl p-6">
        <h2 className="text-xl font-bold text-secondary-900 mb-4">Устройства</h2>
        <div className="space-y-2">
          {deviceData.map(device => (
            <div key={device.entity_id} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
              <div>
                <p className="font-medium text-secondary-900">
                  {device.name || device.entity_id}
                </p>
                <p className="text-sm text-secondary-500">{device.entity_id}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-xs ${
                  device.is_on
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {device.is_on ? 'Включено' : 'Выключено'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Все сущности */}
      <div className="glass-card rounded-xl p-6">
        <h2 className="text-xl font-bold text-secondary-900 mb-4">Все сущности Home Assistant</h2>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {allStates.map(state => (
            <div key={state.entity_id} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
              <div>
                <p className="font-medium text-secondary-900">{state.entity_id}</p>
                <p className="text-sm text-secondary-500">{state.state}</p>
              </div>
              {Object.keys(state.attributes).length > 0 && (
                <div className="text-xs text-secondary-500">
                  {Object.keys(state.attributes).length} атрибутов
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
