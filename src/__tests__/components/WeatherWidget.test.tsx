import React from 'react';
import { render, screen } from '@testing-library/react';
import { WeatherWidget } from '../../components/WeatherWidget';

// Mock компонентов lucide-react
jest.mock('lucide-react', () => ({
  Sun: () => <div data-testid="icon-sun">Sun</div>,
  Cloud: () => <div data-testid="icon-cloud">Cloud</div>,
  CloudRain: () => <div data-testid="icon-cloud-rain">CloudRain</div>,
  Snowflake: () => <div data-testid="icon-snowflake">Snowflake</div>,
  Wind: () => <div data-testid="icon-wind">Wind</div>,
}));

describe('WeatherWidget', () => {
  const mockWeatherData: any = {
    temperature: 22,
    condition: 'sunny',
    humidity: 60,
    windSpeed: 5,
    feelsLike: 21,
    location: 'Home',
  };

  describe('Рендеринг с данными', () => {
    it('должен рендерить виджет с данными о погоде', () => {
      render(<WeatherWidget weather={mockWeatherData} />);
      
      expect(screen.getByText('Погода')).toBeInTheDocument();
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('22В°C')).toBeInTheDocument();
      expect(screen.getByText('60%')).toBeInTheDocument();
      expect(screen.getByText('5 м/с')).toBeInTheDocument();
    });

    it('должен отображать правильную иконку для sunny', () => {
      render(<WeatherWidget weather={mockWeatherData} />);
      
      expect(screen.getByTestId('icon-sun')).toBeInTheDocument();
    });

    it('должен отображать правильную иконку для cloudy', () => {
      const cloudyData: any = { ...mockWeatherData, condition: 'cloudy' };
      render(<WeatherWidget weather={cloudyData} />);
      
      expect(screen.getByTestId('icon-cloud')).toBeInTheDocument();
    });

    it('должен отображать правильную иконку для rainy', () => {
      const rainyData: any = { ...mockWeatherData, condition: 'rainy' };
      render(<WeatherWidget weather={rainyData} />);
      
      expect(screen.getByTestId('icon-cloud-rain')).toBeInTheDocument();
    });

    it('должен отображать правильную иконку для windy', () => {
      const windyData: any = { ...mockWeatherData, condition: 'windy' };
      render(<WeatherWidget weather={windyData} />);
      
      expect(screen.getByTestId('icon-wind')).toBeInTheDocument();
    });
  });

  describe('Обработка null/undefined данных', () => {
    it('должен показывать сообщение об отсутствии данных при null', () => {
      render(<WeatherWidget weather={null} />);
      
      expect(screen.getByText('Нет данных о погоде')).toBeInTheDocument();
    });

    it('должен показывать сообщение об отсутствии данных при undefined', () => {
      render(<WeatherWidget weather={undefined} />);
      
      expect(screen.getByText('Нет данных о погоде')).toBeInTheDocument();
    });

    it('должен показывать сообщение об отсутствии данных при пустом объекте', () => {
      render(<WeatherWidget weather={{}} />);
      
      // Пустой объект может вызвать ошибки, но не должен ломать рендер
      expect(screen.getByText('Погода')).toBeInTheDocument();
    });
  });

  describe('Обработка неизвестных условий', () => {
    it('должен показывать сообщение об ошибке при неизвестном условии', () => {
      const unknownData: any = { ...mockWeatherData, condition: 'unknown' };
      render(<WeatherWidget weather={unknownData} />);
      
      expect(screen.getByText('Неизвестные погодные условия')).toBeInTheDocument();
    });
  });

  describe('Проверка консольных логов', () => {
    it('должен логировать данные о погоде', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
      
      render(<WeatherWidget weather={mockWeatherData} />);
      
      expect(consoleSpy).toHaveBeenCalledWith(
        '[WeatherWidget] Rendering with data:',
        mockWeatherData
      );
      
      consoleSpy.mockRestore();
    });
  });
});
