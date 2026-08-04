import test from 'node:test';
import assert from 'node:assert/strict';
import { initAnalytics, trackEvent, trackPageView } from '../js/analytics/analytics.js';

test('initAnalytics initializes the analytics layer and tracks the initial page view', () => {
  global.window = {
    dataLayer: [],
    location: { pathname: '/about', href: 'https://example.com/about', hostname: 'example.com' },
    document: { title: 'About | Portfolio' }
  };

  const initialized = initAnalytics();

  assert.equal(initialized, true);
  assert.ok(global.window.dataLayer.length >= 1);
  assert.equal(global.window.dataLayer[0].event, 'page_view');
});

test('trackEvent pushes named analytics events with payload data', () => {
  global.window = {
    dataLayer: [],
    location: { pathname: '/', href: 'https://example.com/', hostname: 'example.com' },
    document: { title: 'Home | Portfolio' }
  };

  trackEvent('github_click', { location: 'hero' });

  assert.equal(global.window.dataLayer.length, 1);
  assert.equal(global.window.dataLayer[0].event, 'github_click');
  assert.equal(global.window.dataLayer[0].location, 'hero');
});

test('trackPageView uses the current page metadata', () => {
  global.window = {
    dataLayer: [],
    location: { pathname: '/projects', href: 'https://example.com/projects', hostname: 'example.com' },
    document: { title: 'Projects | Portfolio' }
  };

  trackPageView();

  assert.equal(global.window.dataLayer.length, 1);
  assert.equal(global.window.dataLayer[0].event, 'page_view');
  assert.equal(global.window.dataLayer[0].page_location, '/projects');
});
