import { initializeMonitoring, trackPageView, trackWebVital } from './monitoring';

describe('optional analytics integration', () => {
  afterEach(() => {
    document.querySelectorAll('script[src*="googletagmanager.com/gtag/js"]').forEach((script) => script.remove());
    delete window.gtag;
    delete window.dataLayer;
  });

  it('does nothing until analytics is configured', async () => {
    await initializeMonitoring({});
    trackPageView('/');
    expect(document.querySelector('script[src*="googletagmanager.com"]')).not.toBeInTheDocument();
  });

  it('loads GA and records page views and web vitals', async () => {
    await initializeMonitoring({ VITE_GA_MEASUREMENT_ID: 'G-TEST123' });
    trackPageView('/insights');
    trackWebVital({ id: 'lcp-1', name: 'LCP', value: 250 });
    expect(document.querySelector('script[src*="id=G-TEST123"]')).toBeInTheDocument();
    expect(window.dataLayer.some((entry) => entry[0] === 'event' && entry[1] === 'page_view')).toBe(true);
    expect(window.dataLayer.some((entry) => entry[0] === 'event' && entry[1] === 'web_vital')).toBe(true);
  });
});
