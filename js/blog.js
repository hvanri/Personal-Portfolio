import { buildHeroStats, buildSearchSuggestions } from './blog-search-utils.mjs';
import { trackEvent } from './analytics/analytics.js';
import { EVENTS } from './analytics/events.js';

const postsUrl = './blog/posts.json';
const initialView = typeof window !== 'undefined' && window.localStorage
    ? window.localStorage.getItem('blogView') || 'list'
    : 'list';

const state = {
    posts: [],
    activeCategory: 'All',
    query: '',
    view: initialView
};

function formatDate(value) {
    if (!value) return '';

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function getFilteredPosts() {
    return state.posts.filter((post) => {
        const matchesCategory = state.activeCategory === 'All' || post.category === state.activeCategory;
        const haystack = `${post.title} ${post.excerpt} ${post.tags.join(' ')}`.toLowerCase();
        const matchesQuery = !state.query || haystack.includes(state.query.toLowerCase());
        return matchesCategory && matchesQuery;
    });
}

function renderCategories(posts) {
    const container = document.querySelector('#blog-categories');
    if (!container) return;

    const categories = ['All', ...new Set(posts.map((post) => post.category).filter(Boolean))];
    container.innerHTML = categories
        .map((category) => {
            const activeClass = category === state.activeCategory ? 'is-active' : '';
            return `<button class="filter-pill ${activeClass}" type="button" data-category="${category}">${category}</button>`;
        })
        .join('');

    const countEl = document.querySelector('#blog-categories-count');
    if (countEl) {
        countEl.textContent = String(categories.length - 1);
    }
}

function renderHeroStats(posts = state.posts) {
    const container = document.querySelector('#hero-stats');
    if (!container) return;

    const stats = buildHeroStats(posts);
    container.innerHTML = stats
        .map((stat) => `
            <div class="hero-stat">
                <strong>${stat.value}</strong>
                <span>${stat.label}</span>
            </div>
        `)
        .join('');
}

function renderPosts() {
    const grid = document.querySelector('#blog-posts');
    const emptyState = document.querySelector('#blog-empty-state');
    const countEl = document.querySelector('#blog-count');

    if (!grid) return;

    const filteredPosts = getFilteredPosts();

    if (countEl) {
        countEl.textContent = String(filteredPosts.length);
    }

    if (!filteredPosts.length) {
        grid.innerHTML = '';
        emptyState.hidden = false;
        return;
    }

    emptyState.hidden = true;
    grid.innerHTML = filteredPosts.map((post) => `
        <article class="post-card">
            ${post.image ? `<img class="post-image" src="${post.image}" alt="${post.title}" />` : ''}
            <div class="post-card__body">
                <div class="post-card__top">
                    <span class="post-badge">${post.category}</span>
                    <span class="post-date">${formatDate(post.date)}</span>
                </div>
                <h3>${post.title}</h3>
                <p>${post.excerpt}</p>
                <div class="post-tags">
                    ${post.tags.map((tag) => `<span class="tag-pill">${tag}</span>`).join('')}
                </div>
                <div class="post-card__footer">
                    ${
                        post.blog_link
                            ? `<a class="post-read-link"
                                href="${post.blog_link}"
                                target="_blank"
                                rel="noopener">
                                    Read Story
                                    <span aria-hidden="true">→</span>
                            </a>`
                            : ""
                    }
                </div>
            </div>
        </article>
    `).join('');
}

function updateSearchSuggestionsVisibility(searchInput, suggestionsContainer) {
    if (!searchInput || !suggestionsContainer) return;

    const shouldShow = !searchInput.value.trim();
    suggestionsContainer.hidden = !shouldShow;
}

function renderSearchSuggestions(posts = state.posts) {
    const searchInput = document.querySelector('#blog-search');
    const suggestionsContainer = document.querySelector('#blog-search-suggestions');
    const chipsContainer = suggestionsContainer?.querySelector('.search-suggestions__chips');

    if (!searchInput || !suggestionsContainer || !chipsContainer) return;

    const suggestions = buildSearchSuggestions(posts, 6);

    if (!suggestions.length) {
        suggestionsContainer.hidden = true;
        return;
    }

    chipsContainer.innerHTML = suggestions
        .map((suggestion) => `<button class="search-suggestion-chip" type="button" data-query="${suggestion}">${suggestion}</button>`)
        .join('');

    chipsContainer.querySelectorAll('button[data-query]').forEach((button) => {
        button.addEventListener('click', () => {
            searchInput.value = button.dataset.query;
            state.query = button.dataset.query.trim();
            renderPosts();
            updateSearchSuggestionsVisibility(searchInput, suggestionsContainer);
        });
    });

    updateSearchSuggestionsVisibility(searchInput, suggestionsContainer);
}

export function initBlogPage() {
    const grid = document.querySelector('#blog-posts');
    const searchInput = document.querySelector('#blog-search');
    const categoryFilter = document.querySelector('#blog-categories');
    const btnGrid = document.querySelector('#view-grid');
    const btnList = document.querySelector('#view-list');
    const suggestionsContainer = document.querySelector('#blog-search-suggestions');

    if (!grid || !categoryFilter) {
        return;
    }

    applyView(state.view);

    fetch(postsUrl)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to load blog posts: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            state.posts = Array.isArray(data.posts) ? data.posts : [];
            renderCategories(state.posts);
            renderHeroStats(state.posts);
            renderPosts();
            renderSearchSuggestions(state.posts);
        })
        .catch((error) => {
            console.error(error);
            grid.innerHTML = '<div class="empty-state">Unable to load stories right now. Please try again later.</div>';
        });

    if (searchInput) {
        searchInput.addEventListener('input', (event) => {
            state.query = event.target.value.trim();
            renderPosts();
            updateSearchSuggestionsVisibility(searchInput, suggestionsContainer);
            if (state.query) {
                trackEvent(EVENTS.BLOG_SEARCH, { search_term: state.query });
            }
        });
    }

    categoryFilter.addEventListener('click', (event) => {
        const button = event.target.closest('button[data-category]');
        if (!button) return;

        state.activeCategory = button.dataset.category;
        renderCategories(state.posts);
        renderPosts();
        trackEvent(EVENTS.BLOG_CATEGORY_CHANGE, { category: state.activeCategory });
    });

    if (btnGrid) {
        btnGrid.addEventListener('click', () => applyView('grid'));
    }

    if (btnList) {
        btnList.addEventListener('click', () => applyView('list'));
    }

    document.addEventListener('click', (event) => {
        const postLink = event.target.closest('#blog-posts a');
        if (!postLink) {
            return;
        }

        const title = postLink.closest('article')?.querySelector('h3')?.textContent?.trim() || '';
        trackEvent(EVENTS.BLOG_OPEN, {
            post_title: title,
            category: state.activeCategory
        });
    });
}

function applyView(view) {
    const grid = document.querySelector('#blog-posts');
    const btnGrid = document.querySelector('#view-grid');
    const btnList = document.querySelector('#view-list');
    if (!grid) return;

    state.view = view;
    grid.classList.toggle('layout-list', view === 'list');
    if (btnGrid) btnGrid.classList.toggle('is-active', view === 'grid');
    if (btnList) btnList.classList.toggle('is-active', view === 'list');
    localStorage.setItem('blogView', view);
}
