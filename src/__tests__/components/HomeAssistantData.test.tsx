import React from 'react';
import { render, screen } from '@testing-library/react';
import { HomeAssistantAllData } from '../../components/HomeAssistantAllData';

const mockGetHomeAssistantStates = jest.fn();
const mockGetAllEntityIds = jest.fn();
const mockGetAirQuality = jest.fn();
const mockGetOccupants = jest.fn();

jest.mock('../../lib/homeAssistant', () => ({
  getHomeAssistantStates: (...args: any[]) => mockGetHomeAssistantStates(...args),
  getAllEntityIds: (...args: any[]) => mockGetAllEntityIds(...args),
  getAirQuality: (...args: any[]) => mockGetAirQuality(...args),
  getOccupants: (...args: any[]) => mockGetOccupants(...args),
}));

describe('HomeAssistantAllData (hook integration)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders a summary once data is loaded', async () => {
    mockGetHomeAssistantStates.mockResolvedValue([
      {
        entity_id: 'sensor.temperature',
        state: '21',
        attributes: {},
      },
      {
        entity_id: 'light.kitchen',
        state: 'on',
        attributes: { friendly_name: 'Kitchen Light' },
      },
    ]);
    mockGetAllEntityIds.mockResolvedValue(['sensor.temperature', 'light.kitchen']);
    mockGetAirQuality.mockResolvedValue(null);
    mockGetOccupants.mockResolvedValue([]);

    render(<HomeAssistantAllData />);

    expect(await screen.findByText('Всего сущностей')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('normalizes weather condition to known values', async () => {
    mockGetHomeAssistantStates.mockResolvedValue([
      {
        entity_id: 'sensor.weather_temperature',
        state: '20',
        attributes: {},
      },
      {
        entity_id: 'sensor.weather_humidity',
        state: '55',
        attributes: {},
      },
      {
        entity_id: 'sensor.weather_condition',
        state: 'Rain',
        attributes: {},
      },
      {
        entity_id: 'sensor.weather_wind_speed',
        state: '3',
        attributes: {},
      },
    ]);
    mockGetAllEntityIds.mockResolvedValue([
      'sensor.weather_temperature',
      'sensor.weather_humidity',
      'sensor.weather_condition',
      'sensor.weather_wind_speed',
    ]);
    mockGetAirQuality.mockResolvedValue(null);
    mockGetOccupants.mockResolvedValue([]);

    render(<HomeAssistantAllData />);

    expect(await screen.findByText('Погода')).toBeInTheDocument();
    expect(screen.getByText('rainy')).toBeInTheDocument();
  });
});
