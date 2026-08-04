import { EVENTS } from './events.js';

const DEFAULT_PAGE_VIEW_EVENT = EVENTS.PAGE_VIEW;
const DEFAULT_TRACKING_DISABLED = false;
const SCROLL_THRESHOLDS = [25, 50, 75, 90];
const BLOG_READ_COMPLETE_THRESHOLD = 90;

function getWindow() {
  return typeof window !== 'undefined' ? window : undefined;
}

function hasGtm() {
  const win = getWindow();
  return !!(win && win.dataLayer);
}

function safePush(payload) {
  const win = getWindow();
  if (!win) {
    return;
  }

  if (!win.dataLayer) {
    win.dataLayer = [];
  }

  win.dataLayer.push(payload);
}

function sanitizePayload(payload = {}) {
  const sanitized = {};

  Object.entries(payload).forEach(([key, value]) => {
    if (value == null || value === '') {
      return;
    }

    if (typeof value === 'string') {
      sanitized[key] = value.slice(0, 200);
      return;
    }

    sanitized[key] = value;
  });

  return sanitized;
}

export function initAnalytics() {
  const win = getWindow();

  if (!win || DEFAULT_TRACKING_DISABLED) {
    return false;
  }

  if (!hasGtm()) {
    win.dataLayer = [];
  }

  if (!win.__portfolioAnalyticsInitialized) {
    win.__portfolioAnalyticsInitialized = true;
    trackPageView();
    initScrollTracking();
    initErrorTracking();
  }

  return true;
}

export function trackEvent(eventName, payload = {}) {
  const win = getWindow();
  if (!win || DEFAULT_TRACKING_DISABLED) {
    return;
  }

  const eventPayload = sanitizePayload({
    event: eventName,
    page_path: win.location?.pathname || '/',
    page_title: win.document?.title || (typeof document !== 'undefined' ? document.title : '') || '',
    ...payload
  });

  safePush(eventPayload);
}

export function trackPageView(pageLocation = getWindow()?.location?.pathname || '/', pageTitle = getWindow()?.document?.title || (typeof document !== 'undefined' ? document.title : '') || '') {
  const win = getWindow();
  if (!win || DEFAULT_TRACKING_DISABLED) {
    return;
  }

  safePush(sanitizePayload({
    event: DEFAULT_PAGE_VIEW_EVENT,
    page_location: pageLocation,
    page_title: pageTitle,
    page_path: pageLocation
  }));
}

function initScrollTracking() {
  const win = getWindow();
  if (!win) {
    return;
  }

  const seen = new Set();
  let readCompleteTracked = false;

  const handleScroll = () => {
    if (typeof document === 'undefined') {
      return;
    }

    const scrollTop = win.scrollY || win.pageYOffset || 0;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? Math.round((scrollTop / maxScroll) * 100) : 0;

    SCROLL_THRESHOLDS.forEach((threshold) => {
      if (progress >= threshold && !seen.has(threshold)) {
        seen.add(threshold);
        trackEvent(EVENTS.SCROLL_DEPTH, { percentage: threshold });
      }
    });

    if (!readCompleteTracked && progress >= BLOG_READ_COMPLETE_THRESHOLD && win.location?.pathname.includes('/blog')) {
      readCompleteTracked = true;
      trackEvent(EVENTS.BLOG_READ_COMPLETE, {
        post_title: document.title || 'blog'
      });
    }
  };

  win.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

function initErrorTracking() {
  const win = getWindow();
  if (!win) {
    return;
  }

  win.addEventListener('error', (event) => {
    trackEvent(EVENTS.JAVASCRIPT_ERROR, {
      message: event.message || 'unknown_error',
      filename: event.filename || '',
      line: event.lineno || 0
    });
  });
}
