# Ритм — React-трекер привычек

React 18, Redux Toolkit, React Router и Vite. Обзор недели загружается через React.lazy.

## Локальный запуск

Используйте Node.js 22 (как в CI).

```sh
npm ci
npm run dev
```

## CI/CD

Workflow: `.github/workflows/ci.yml`.

- Pull request в `main`: установка по lockfile, Jest с покрытием, production-сборка Vite и анализ бандла.
- Push в `main`: те же проверки, затем автоматическая публикация на GitHub Pages. При ошибке тестов или сборки публикация не запускается.
- Ручной запуск: Actions → CI/CD → Run workflow. Деплой выполняется только из `main`.
- Отчёты `coverage` и `bundle-report` доступны в Artifacts запуска и хранятся 14 дней. Отчёт бандла не публикуется на сайте.

Перед первым деплоем откройте Settings → Pages → Build and deployment → Source → GitHub Actions.
Сайт: https://iliamitkin.github.io/React/

Для статического хостинга используется HashRouter: обзор доступен по `/React/#/insights`, включая прямое открытие и обновление страницы. Vite получает путь `/React/` через `VITE_BASE_PATH` в workflow.

## Проверки и анализ бандла

```sh
npm run test:coverage -- --ci --runInBand
VITE_BASE_PATH=/React/ npm run build:analyze
npm run preview
```

Откройте `dist/bundle-report.html` для анализа модулей, gzip- и Brotli-размеров. HTML-отчёт покрытия: `coverage/lcov-report/index.html`.

## Необязательные интеграции

Пример переменных: `.env.example`. Для CI задайте в Settings → Secrets and variables → Actions → Repository secrets:

- `VITE_SENTRY_DSN` — Sentry.
- `VITE_LOGROCKET_APP_ID` — LogRocket.
- `VITE_GA_MEASUREMENT_ID` — Google Analytics.

Без значений интеграции отключены. Переменные `VITE_*` попадают в клиентскую сборку: указывайте только публичные идентификаторы, не приватные токены сервисов. После изменения значений запустите workflow заново.
