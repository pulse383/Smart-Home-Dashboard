## Изменённые файлы

- [`src/App.css`](src/App.css)
- [`src/index.css`](src/index.css)
- [`src/components/Dashboard.tsx`](src/components/Dashboard.tsx)
- [`src/components/TopBar.tsx`](src/components/TopBar.tsx)

## Основные доработки

- Создан компонент [`src/components/TopBar.tsx`](src/components/TopBar.tsx), выводящий логотип, приветствие, время/дату, статус погоды и быстрые действия. Добавлена горизонтальная навигация по ключевым разделам.
- В [`src/components/Dashboard.tsx`](src/components/Dashboard.tsx) интегрирован TopBar и табы. Контент теперь стартует под фиксированной панелью.
- В [`src/App.css`](src/App.css) и [`src/index.css`](src/index.css) введена система переменных, пересчитаны отступы, включен фиксированный размер холста 1280×800 без прокрутки. Уточнены параметры glassmorphism и layout.
