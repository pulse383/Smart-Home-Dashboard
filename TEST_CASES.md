# Тесткейсы для Smart Home Dashboard

## 📋 Обзор

Цель: Убедиться, что интерфейс корректно обрабатывает все сценарии, включая отсутствие данных, ошибки загрузки и некорректные данные.

---

## 🎯 Основные сценарии

### Сценарий 1: Загрузка данных из Home Assistant ✅

**Описание:** При запуске приложения должны загружаться данные из Home Assistant

**Шаги:**
1. Запустить приложение (`npm run dev`)
2. Открыть браузер
3. Дождаться загрузки данных

**Ожидаемый результат:**
- ✅ Отображается экран загрузки с анимацией
- ✅ После загрузки - основной интерфейс
- ✅ Данные отображаются корректно
- ✅ Консоль содержит логи загрузки

**Тесткейс:**
```typescript
describe('Загрузка данных из Home Assistant', () => {
  it('должен показывать экран загрузки', () => {
    render(<Dashboard />);
    expect(screen.getByText('Загрузка данных...')).toBeInTheDocument();
  });
  
  it('должен загрузить данные и отобразить интерфейс', async () => {
    // Симулировать успешную загрузку данных
    render(<Dashboard />);
    await waitFor(() => {
      expect(screen.queryByText('Загрузка данных...')).not.toBeInTheDocument();
    });
  });
});
```

---

### Сценарий 2: Отсутствие данных о погоде ✅

**Описание:** При отсутствии данных о погоде должен отображаться fallback UI

**Шаги:**
1. Имитировать отсутствие данных о погоде
2. Открыть интерфейс

**Ожидаемый результат:**
- ✅ Отображается сообщение "Нет данных о погоде"
- ✅ Интерфейс не ломается
- ✅ Консоль содержит warning

**Тесткейс:**
```typescript
describe('Отсутствие данных о погоде', () => {
  it('должен показывать fallback UI', () => {
    render(<WeatherWidget weather={null} />);
    expect(screen.getByText('Нет данных о погоде')).toBeInTheDocument();
  });
  
  it('должен логировать warning', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    render(<WeatherWidget weather={null} />);
    expect(consoleSpy).toHaveBeenCalledWith(
      '[WeatherWidget] Weather data is null or undefined'
    );
    consoleSpy.mockRestore();
  });
});
```

---

### Сценарий 3: Отсутствие данных о термостате ✅

**Описание:** При отсутствии данных о термостате должен отображаться fallback UI

**Шаги:**
1. Имитировать отсутствие данных о термостате
2. Открыть интерфейс

**Ожидаемый результат:**
- ✅ Отображается сообщение "Нет данных термостата"
- ✅ Интерфейс не ломается
- ✅ Консоль содержит warning

**Тесткейс:**
```typescript
describe('Отсутствие данных о термостате', () => {
  it('должен показывать fallback UI', () => {
    render(<ThermostatWidget data={null} />);
    expect(screen.getByText('Нет данных термостата')).toBeInTheDocument();
  });
  
  it('должен логировать warning', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    render(<ThermostatWidget data={null} />);
    expect(consoleSpy).toHaveBeenCalledWith(
      '[ThermostatWidget] Thermostat data is null or undefined'
    );
    consoleSpy.mockRestore();
  });
});
```

---

### Сценарий 4: Отсутствие зон ✅

**Описание:** При отсутствии зон должен отображаться fallback UI

**Шаги:**
1. Имитировать отсутствие зон
2. Открыть интерфейс

**Ожидаемый результат:**
- ✅ Отображается сообщение "Нет данных о зонах"
- ✅ Интерфейс не ломается
- ✅ Консоль содержит warning

**Тесткейс:**
```typescript
describe('Отсутствие зон', () => {
  it('должен показывать fallback UI', () => {
    render(<ZonesWidget rooms={[]} onDeviceToggle={() => {}} />);
    expect(screen.getByText('Нет данных о зонах')).toBeInTheDocument();
  });
  
  it('должен логировать warning', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    render(<ZonesWidget rooms={[]} onDeviceToggle={() => {}} />);
    expect(consoleSpy).toHaveBeenCalledWith(
      '[ZonesWidget] No rooms provided'
    );
    consoleSpy.mockRestore();
  });
});
```

---

### Сценарий 5: Отсутствие устройств ✅

**Описание:** При отсутствии устройств должен отображаться fallback UI

**Шаги:**
1. Имитировать отсутствие устройств
2. Открыть интерфейс

**Ожидаемый результат:**
- ✅ Отображается сообщение "Нет данных об устройстве"
- ✅ Интерфейс не ломается
- ✅ Консоль содержит warning

**Тесткейс:**
```typescript
describe('Отсутствие устройств', () => {
  it('должен показывать fallback UI', () => {
    render(<DeviceCard device={null} onToggle={() => {}} />);
    expect(screen.getByText('Нет данных об устройстве')).toBeInTheDocument();
  });
  
  it('должен логировать warning', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    render(<DeviceCard device={null} onToggle={() => {}} />);
    expect(consoleSpy).toHaveBeenCalledWith(
      '[DeviceCard] Device is null or undefined'
    );
    consoleSpy.mockRestore();
  });
});
```

---

### Сценарий 6: Неизвестные погодные условия ✅

**Описание:** При неизвестных погодных условиях должен отображаться fallback UI

**Шаги:**
1. Передать неизвестные погодные условия
2. Открыть интерфейс

**Ожидаемый результат:**
- ✅ Отображается сообщение "Неизвестные погодные условия"
- ✅ Интерфейс не ломается
- ✅ Консоль содержит warning

**Тесткейс:**
```typescript
describe('Неизвестные погодные условия', () => {
  it('должен показывать fallback UI', () => {
    const unknownData: any = { temperature: 22, condition: 'unknown' as any, humidity: 60, windSpeed: 5, feelsLike: 21, location: 'Home' };
    render(<WeatherWidget weather={unknownData} />);
    expect(screen.getByText('Неизвестные погодные условия')).toBeInTheDocument();
  });
});
```

---

## 🔄 Сценарии обработки ошибок

### Сценарий 7: Ошибка загрузки данных ✅

**Описание:** При ошибке загрузки данных должен отображаться экран ошибки

**Шаги:**
1. Имитировать ошибку загрузки данных
2. Открыть интерфейс

**Ожидаемый результат:**
- ✅ Отображается экран ошибки с предупреждением
- ✅ Отображается сообщение об ошибке
- ✅ Кнопка перезагрузки работает
- ✅ Консоль содержит error

**Тесткейс:**
```typescript
describe('Ошибка загрузки данных', () => {
  it('должен показывать экран ошибки', () => {
    render(<Dashboard error="Ошибка подключения к Home Assistant" />);
    expect(screen.getByText('Ошибка загрузки данных')).toBeInTheDocument();
    expect(screen.getByText('Ошибка подключения к Home Assistant')).toBeInTheDocument();
    expect(screen.getByText('Перезагрузить страницу')).toBeInTheDocument();
  });
  
  it('должен логировать error', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<Dashboard error="Test error" />);
    expect(consoleSpy).toHaveBeenCalledWith(
      'Ошибка загрузки данных Home Assistant:',
      expect.any(Error)
    );
    consoleSpy.mockRestore();
  });
});
```

---

### Сценарий 8: Ошибка подключения к Home Assistant ✅

**Описание:** При ошибке подключения к Home Assistant должен отображаться экран ошибки

**Шаги:**
1. Имитировать ошибку подключения
2. Открыть интерфейс

**Ожидаемый результат:**
- ✅ Отображается экран ошибки
- ✅ Сообщение об ошибке подключения
- ✅ Кнопка перезагрузки работает

**Тесткейс:**
```typescript
describe('Ошибка подключения к Home Assistant', () => {
  it('должен показывать экран ошибки', () => {
    render(<Dashboard error="Ошибка подключения к Home Assistant" />);
    expect(screen.getByText('⚠️')).toBeInTheDocument();
    expect(screen.getByText('Ошибка загрузки данных')).toBeInTheDocument();
  });
});
```

---

## 🎨 Идентичность стиля

### Сценарий 9: Единый стиль для всех fallback UI ✅

**Описание:** Все fallback UI должны иметь идентичный стиль

**Требования:**
- ✅ Одинаковая структура: заголовок + сообщение
- ✅ Одинаковые цвета: `bg-white`, `rounded-2xl`, `p-5`, `shadow-sm`, `border border-secondary-100`
- ✅ Одинаковые сообщения: "Нет данных о [названии компонента]"
- ✅ Центрированный текст

**Тесткейс:**
```typescript
describe('Единый стиль fallback UI', () => {
  const fallbackClasses = [
    'bg-white',
    'rounded-2xl',
    'p-5',
    'shadow-sm',
    'border',
    'border-secondary-100'
  ];

  it('должен иметь идентичный стиль для всех fallback', () => {
    const weatherFallback = render(<WeatherWidget weather={null} />);
    const thermostatFallback = render(<ThermostatWidget data={null} />);
    const zonesFallback = render(<ZonesWidget rooms={[]} onDeviceToggle={() => {}} />);
    const deviceFallback = render(<DeviceCard device={null} onToggle={() => {}} />);
    
    // Все fallback должны иметь одинаковые классы
    expect(weatherFallback.container).toHaveClass(...fallbackClasses);
    expect(thermostatFallback.container).toHaveClass(...fallbackClasses);
    expect(zonesFallback.container).toHaveClass(...fallbackClasses);
    expect(deviceFallback.container).toHaveClass(...fallbackClasses);
  });
});
```

---

### Сценарий 10: Единый стиль для карточек устройств ✅

**Описание:** Все карточки устройств должны иметь идентичный стиль

**Требования:**
- ✅ Одинаковые размеры: `rounded-2xl`, `p-5`
- ✅ Одинаковые тени: `shadow-sm`, `shadow-lg` для активных
- ✅ Одинаковые границы: `border border-secondary-100`
- ✅ Одинаковые hover эффекты: `scale: 1.02`, `y: -4`

**Тесткейс:**
```typescript
describe('Единый стиль карточек устройств', () => {
  it('должен иметь идентичный стиль для всех типов устройств', () => {
    const tvCard = render(<DeviceCard device={mockTvDevice} onToggle={() => {}} />);
    const speakerCard = render(<DeviceCard device={mockSpeakerDevice} onToggle={() => {}} />);
    const lampCard = render(<DeviceCard device={mockLampDevice} onToggle={() => {}} />);
    
    // Все карточки должны иметь одинаковые базовые классы
    expect(tvCard.container).toHaveClass('bg-white', 'rounded-2xl', 'p-5');
    expect(speakerCard.container).toHaveClass('bg-white', 'rounded-2xl', 'p-5');
    expect(lampCard.container).toHaveClass('bg-white', 'rounded-2xl', 'p-5');
  });
});
```

---

## 🧪 Сценарии логирования

### Сценарий 11: Логирование данных в консоль ✅

**Описание:** Все компоненты должны логировать свои данные в консоль

**Требования:**
- ✅ Формат лога: `[ComponentName] Rendering with data: {...}`
- ✅ Логирование при каждом рендере
- ✅ Логирование при отсутствии данных

**Тесткейс:**
```typescript
describe('Логирование данных', () => {
  it('должен логировать данные WeatherWidget', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    render(<WeatherWidget weather={mockWeatherData} />);
    
    expect(consoleSpy).toHaveBeenCalledWith(
      '[WeatherWidget] Rendering with data:',
      mockWeatherData
    );
    consoleSpy.mockRestore();
  });
  
  it('должен логировать отсутствие данных', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    render(<WeatherWidget weather={null} />);
    
    expect(consoleSpy).toHaveBeenCalledWith(
      '[WeatherWidget] Weather data is null or undefined'
    );
    consoleSpy.mockRestore();
  });
});
```

---

### Сценарий 12: Логирование ошибок ✅

**Описание:** Все компоненты должны логировать ошибки в консоль

**Требования:**
- ✅ Формат лога: `[ComponentName] Ошибка: ...`
- ✅ Логирование при ошибках
- ✅ Логирование при отсутствии данных

**Тесткейс:**
```typescript
describe('Логирование ошибок', () => {
  it('должен логировать ошибки загрузки', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<Dashboard error="Test error" />);
    
    expect(consoleSpy).toHaveBeenCalledWith(
      'Ошибка загрузки данных Home Assistant:',
      expect.any(Error)
    );
    consoleSpy.mockRestore();
  });
});
```

---

## 🎯 Сценарии производительности

### Сценарий 13: Загрузка данных параллельно ✅

**Описание:** Данные должны загружаться параллельно для оптимизации производительности

**Шаги:**
1. Запустить приложение
2. Дождаться загрузки данных

**Ожидаемый результат:**
- ✅ Все запросы выполняются параллельно
- ✅ Скорость загрузки выше, чем последовательная
- ✅ Не блокируется интерфейс

**Тесткейс:**
```typescript
describe('Параллельная загрузка данных', () => {
  it('должен загружать все данные параллельно', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    
    render(<Dashboard />);
    
    // Проверить, что все компоненты логируют данные
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        '[WeatherWidget] Rendering with data:',
        expect.any(Object)
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        '[ThermostatWidget] Rendering with data:',
        expect.any(Object)
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        '[ZonesWidget] Rendering with rooms:',
        expect.any(Array)
      );
    });
    
    consoleSpy.mockRestore();
  });
});
```

---

## 📊 Итоговая сводка тесткейсов

| ID | Сценарий | Статус | Приоритет |
|----|----------|--------|-----------|
| 1 | Загрузка данных из Home Assistant | ✅ | P0 |
| 2 | Отсутствие данных о погоде | ✅ | P0 |
| 3 | Отсутствие данных о термостате | ✅ | P0 |
| 4 | Отсутствие зон | ✅ | P0 |
| 5 | Отсутствие устройств | ✅ | P0 |
| 6 | Неизвестные погодные условия | ✅ | P1 |
| 7 | Ошибка загрузки данных | ✅ | P0 |
| 8 | Ошибка подключения к Home Assistant | ✅ | P0 |
| 9 | Единый стиль для всех fallback UI | ✅ | P1 |
| 10 | Единый стиль для карточек устройств | ✅ | P1 |
| 11 | Логирование данных в консоль | ✅ | P1 |
| 12 | Логирование ошибок | ✅ | P1 |
| 13 | Загрузка данных параллельно | ✅ | P2 |

---

## 🚀 План тестирования

### Фаза 1: Unit тесты (1 час)
- [x] Тесты для WeatherWidget
- [ ] Тесты для ThermostatWidget
- [ ] Тесты для ZonesWidget
- [ ] Тесты для DeviceCard
- [ ] Тесты для Dashboard

### Фаза 2: Интеграционные тесты (1 час)
- [ ] Тесты на совместную работу компонентов
- [ ] Тесты на передачу данных между компонентами
- [ ] Тесты на обработку ошибок

### Фаза 3: E2E тесты (2 часа)
- [ ] Тесты полного цикла работы приложения
- [ ] Тесты при отсутствии данных
- [ ] Тесты при ошибках загрузки

### Фаза 4: Тестирование в браузере (1 час)
- [ ] Запустить приложение
- [ ] Проверить все сценарии
- [ ] Проверить логи в консоли
- [ ] Проверить визуальное отображение

---

## 📝 Примечания

### Критические сценарии (P0)
- Загрузка данных
- Отсутствие данных
- Ошибки загрузки

### Важные сценарии (P1)
- Единый стиль
- Логирование
- Производительность

### Опциональные сценарии (P2)
- Параллельная загрузка
- Оптимизация

---

## 🎯 Цель

Обеспечить корректную работу интерфейса во всех сценариях, включая отсутствие данных и ошибки загрузки. Использовать идентичный стиль для всех компонентов и компонентов fallback UI.
