import test from 'node:test';
import assert from 'node:assert/strict';
import { collectCategories, filterPosts, normalizeText, readingMinutes } from '../js/blog-search-utils.mjs';

const posts = [
  { id: 'c', title: 'Camping weekend', category: 'Trips', tags: ['friends'], excerpt: 'Outdoor games', content: 'word '.repeat(450) },
  { id: 'b', title: "Spotlight at Lê's Path Coffee", category: 'Performance', tags: ['english'], excerpt: 'Meeting friends', content: 'Short note' },
  { id: 'a', title: 'Hiking in Huế', category: 'trips', tags: ['travel'], excerpt: 'Mountains', content: 'Trail day' }
];

test('category filter is case-insensitive and keeps the listing order', () => {
  assert.deepEqual(filterPosts(posts, { category: 'Trips' }).map((p) => p.id), ['c', 'a']);
  assert.deepEqual(filterPosts(posts, { category: 'all' }).map((p) => p.id), ['c', 'b', 'a']);
});

test('search matches title, excerpt, tags and content, ignoring Vietnamese diacritics', () => {
  assert.deepEqual(filterPosts(posts, { query: 'le path' }).map((p) => p.id), ['b']);
  assert.deepEqual(filterPosts(posts, { query: 'HUE' }).map((p) => p.id), ['a']);
  assert.deepEqual(filterPosts(posts, { query: 'friends' }).map((p) => p.id), ['c', 'b']);
});

test('search and category apply together, and can produce no results', () => {
  assert.deepEqual(filterPosts(posts, { query: 'friends', category: 'Trips' }).map((p) => p.id), ['c']);
  assert.deepEqual(filterPosts(posts, { query: 'friends', category: 'Performance' }).map((p) => p.id), ['b']);
  assert.equal(filterPosts(posts, { query: 'magento' }).length, 0);
});

test('categories come from the data in order of first appearance', () => {
  assert.deepEqual(collectCategories(posts), ['Trips', 'Performance']);
});

test('reading time prefers metadata and otherwise derives from content', () => {
  assert.equal(readingMinutes(posts[0]), 3);
  assert.equal(readingMinutes(posts[1]), 1);
  assert.equal(readingMinutes({ reading_time: 8, content: 'x' }), 8);
  assert.equal(normalizeText('Đường Huế'), 'duong hue');
});
