# Smart Home Dashboard

Панель управления умным домом с интеграцией Home Assistant.

## Возможности

- **Обзор** - главный экран с устройствами и климатом
- **Комнаты** - управление устройствами по зонам
- **Сцены** - быстрые пресеты для дома
- **Энергия** - мониторинг потребления
- **Безопасность** - статус охраны
- **Сенсоры** - обзор всех датчиков Home Assistant
- **Настройки** - системная информация

## Технологии

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Lucide Icons

## Установка

```bash
npm install
```

## Запуск

```bash
npm run dev
```

## Сборка

```bash
npm run build
```

## Структура

```
src/
├── components/
│   ├── Dashboard.tsx       # Главный дашборд
│   ├── TopBar.tsx          # Верхняя панель навигации
│   ├── ZoneGlassCard.tsx   # Карточка зоны
│   └── HomeAssistantData.tsx # Хук для данных
├── data/
│   └── ru_mockData.ts      # Русские данные
├── lib/
│   ├── utils.ts            # Утилиты
│   └── homeAssistant.ts    # API Home Assistant
└── types/
    └── index.ts            # TypeScript типы
```
