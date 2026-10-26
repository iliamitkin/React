let googleMeasurementId;
let debugWebVitals = false;
let sentrySdk;

export async function initializeMonitoring(env = {}) {
  debugWebVitals = env.DEV === true || env.VITE_REPORT_WEB_VITALS === 'true';
  const tasks = [];
  if (env.VITE_SENTRY_DSN) {
    tasks.push(import('@sentry/react').then((Sentry) => {
      sentrySdk = Sentry;
      Sentry.init({ dsn: env.VITE_SENTRY_DSN, tracesSampleRate: 0.1, sendDefaultPii: false });
    }));
  }
  if (env.VITE_LOGROCKET_APP_ID) {
    tasks.push(import('logrocket').then((module) => (module.default || module).init(env.VITE_LOGROCKET_APP_ID)));
  }
  if (env.VITE_GA_MEASUREMENT_ID && typeof document !== 'undefined') {
    googleMeasurementId = env.VITE_GA_MEASUREMENT_ID;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', googleMeasurementId, { send_page_view: false });
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(googleMeasurementId)}`;
    document.head.appendChild(script);
  }
  await Promise.all(tasks);
}

export function getSentryErrorBoundary() {
  return sentrySdk?.ErrorBoundary || null;
}

export function trackPageView(path) {
  if (googleMeasurementId && typeof window.gtag === 'function') {
    window.gtag('event', 'page_view', { page_path: path });
  }
}

export function trackWebVital(metric) {
  if (googleMeasurementId && typeof window.gtag === 'function') {
    window.gtag('event', 'web_vital', { metric_name: metric.name, metric_value: Math.round(metric.value), metric_id: metric.id });
  }
  if (debugWebVitals) console.info('[web-vitals]', metric.name, Math.round(metric.value));
}
