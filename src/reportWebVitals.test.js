import { reportWebVitals } from './reportWebVitals';

describe('reportWebVitals', () => {
  const OriginalObserver = global.PerformanceObserver;
  let observers;
  beforeEach(() => {
    observers = [];
    global.PerformanceObserver = class {
      constructor(callback) { this.callback = callback; observers.push(this); }
      observe({ type }) { this.type = type; }
      emit(entries) { this.callback({ getEntries: () => entries }); }
    };
  });
  afterEach(() => { global.PerformanceObserver = OriginalObserver; });

  it('reports LCP, CLS, FID and INP observations', () => {
    const onMetric = jest.fn();
    reportWebVitals(onMetric);
    observers.find((observer) => observer.type === 'largest-contentful-paint').emit([{ startTime: 120 }]);
    observers.find((observer) => observer.type === 'layout-shift').emit([{ value: 0.15, hadRecentInput: false, startTime: 140 }]);
    observers.find((observer) => observer.type === 'first-input').emit([{ startTime: 10, processingStart: 35 }]);
    observers.find((observer) => observer.type === 'event').emit([{ duration: 85 }]);
    expect(onMetric.mock.calls.map(([metric]) => metric.name)).toEqual(['LCP', 'CLS', 'FID (legacy)', 'INP candidate']);
    expect(onMetric.mock.calls[2][0].value).toBe(25);
  });
});
