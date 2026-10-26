// Лёгкий учебный сбор основных метрик без внешней библиотеки.
// Передайте callback для отправки значений в аналитику; без поддержки API функция безопасно завершится.
export function reportWebVitals(onMetric) {
  if (typeof onMetric !== 'function' || typeof PerformanceObserver === 'undefined') return;
  const observe = (type, callback) => {
    try {
      const observer = new PerformanceObserver((list) => callback(list.getEntries()));
      observer.observe({ type, buffered: true });
    } catch (_) { /* Браузер не поддерживает этот тип PerformanceEntry. */ }
  };
  observe('largest-contentful-paint', (entries) => {
    const last = entries[entries.length - 1];
    if (last) onMetric({ id: `lcp-${last.startTime}`, name: 'LCP', value: last.startTime });
  });
  let cls = 0;
  observe('layout-shift', (entries) => {
    entries.forEach((entry) => { if (!entry.hadRecentInput) cls += entry.value; });
    onMetric({ id: `cls-${entries[entries.length - 1]?.startTime || 0}`, name: 'CLS', value: cls });
  });
  observe('first-input', (entries) => {
    const first = entries[0];
    if (first) onMetric({ id: `fid-${first.startTime}`, name: 'FID (legacy)', value: first.processingStart - first.startTime });
  });
  observe('event', (entries) => {
    const latest = entries.reduce((max, entry) => Math.max(max, entry.duration), 0);
    if (latest) onMetric({ id: `inp-${performance.now()}`, name: 'INP candidate', value: latest });
  });
}
