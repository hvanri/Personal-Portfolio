const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const requiredFiles = [
  'blog.html',
  'blog/posts.json',
  'js/blog.js',
  'js/blog-search-utils.mjs',
  'css/pages/blog.css'
];

test('blog page assets exist', () => {
  for (const file of requiredFiles) {
    const fullPath = path.join(root, file);
    assert.ok(fs.existsSync(fullPath), `Missing required file: ${file}`);
  }
});

test('search suggestions are generated from post metadata', async () => {
  const { buildSearchSuggestions } = await import('../js/blog-search-utils.mjs');
  const posts = [
    {
      category: 'Trips',
      tags: ['travel', 'friends'],
      title: 'Camping trip with friends'
    },
    {
      category: 'Performance',
      tags: ['music', 'travel'],
      title: 'Live guitar set'
    }
  ];

  const suggestions = buildSearchSuggestions(posts, 6);

  assert.ok(suggestions.includes('Trips'));
  assert.ok(suggestions.includes('Travel'));
  assert.ok(suggestions.includes('Friends'));
  assert.ok(suggestions.length <= 6);
});

test('hero stats are derived from post data', async () => {
  const { buildHeroStats } = await import('../js/blog-search-utils.mjs');
  const posts = [
    { category: 'Trips', tags: ['travel', 'adventure'], title: 'A camping weekend' },
    { category: 'Performance', tags: ['music', 'performance'], title: 'A live set' },
    { category: 'Projects', tags: ['coding'], title: 'A side project' }
  ];

  const stats = buildHeroStats(posts);

  assert.equal(stats[0].value, 3);
  assert.equal(stats[1].value, 1);
  assert.equal(stats[2].value, 1);
});
