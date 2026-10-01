import { trackEvent } from './analytics/analytics.js';
import { EVENTS } from './analytics/events.js';
import { collectCategories, filterPosts, readingMinutes } from './blog-search-utils.mjs';

const postsUrl = './blog/posts.json';
const SEARCH_TRACK_DELAY = 700;

const state = {
    posts: [],
    query: '',
    category: 'all'
};

function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

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

function sortByNewest(posts) {
    return [...posts].sort((left, right) => new Date(right.date) - new Date(left.date));
}

function linkAttributes(post) {
    return `href="${escapeHtml(post.blog_link)}"
        target="_blank"
        rel="noopener"
        data-post-title="${escapeHtml(post.title)}"
        data-category="${escapeHtml(post.category || '')}"`;
}

function titleMarkup(post) {
    const title = escapeHtml(post.title);
    return post.blog_link ? `<a ${linkAttributes(post)}>${title}</a>` : title;
}

function readMoreMarkup(post) {
    if (!post.blog_link) return '';
    return `<a class="bl-read ed-link" ${linkAttributes(post)} aria-label="Read article: ${escapeHtml(post.title)} (opens in a new tab)">Read article</a>`;
}

function metaMarkup(post) {
    const date = post.date
        ? `<time datetime="${escapeHtml(post.date)}">${escapeHtml(formatDate(post.date))}</time><span class="bl-meta-sep" aria-hidden="true"> · </span>`
        : '';
    return `<p class="bl-meta">${date}<span>${readingMinutes(post)} min read</span></p>`;
}

/** Local cover for posts without an image: geometric, no fake text. */
function coverIllustration() {
    return `<svg class="bl-cover-art" viewBox="0 0 543 307" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
        <rect width="543" height="307" fill="#0058fd"/>
        <polygon points="126,23 339,92 322,285 47,255" fill="#121212"/>
        <polygon points="26,102 120,85 125,110 31,127" fill="#fff"/>
        <rect x="154" y="46" width="266" height="189" rx="3" fill="#fff"/>
        <circle cx="174" cy="68" r="5" fill="#fd542b"/><circle cx="193" cy="68" r="5" fill="#121212"/><circle cx="212" cy="68" r="5" fill="#121212"/>
        <rect x="172" y="101" width="118" height="89" fill="#0058fd"/>
        <circle cx="249" cy="127" r="12" fill="#fd542b"/>
        <polygon points="172,190 214,148 256,190" fill="#121212"/>
        <g fill="#b9bcc2"><rect x="312" y="101" width="89" height="5"/><rect x="312" y="115" width="80" height="5"/><rect x="312" y="129" width="70" height="5"/><rect x="312" y="145" width="58" height="5"/><rect x="312" y="168" width="89" height="5"/></g>
        <rect x="312" y="191" width="40" height="4" fill="#121212"/>
        <rect x="312" y="206" width="50" height="5" fill="#0058fd"/>
        <rect x="85" y="155" width="194" height="121" rx="6" fill="#121212" stroke="#fff" stroke-width="2"/>
        <g fill="#8a8d93"><circle cx="104" cy="182" r="2.5"/><circle cx="104" cy="197" r="2.5"/><circle cx="104" cy="212" r="2.5"/><circle cx="104" cy="227" r="2.5"/><circle cx="104" cy="242" r="2.5"/></g>
        <rect x="103" y="166" width="45" height="4" fill="#8a8d93"/>
        <rect x="120" y="180" width="100" height="5" fill="#0058fd"/>
        <rect x="120" y="195" width="58" height="5" fill="#0058fd"/>
        <rect x="120" y="210" width="40" height="5" fill="#fd542b"/><rect x="168" y="210" width="26" height="5" fill="#8a8d93"/>
        <rect x="120" y="225" width="26" height="5" fill="#8a8d93"/><rect x="154" y="225" width="92" height="5" fill="#8a8d93"/>
        <rect x="120" y="240" width="76" height="5" fill="#fd542b"/>
        <polygon points="391,180 482,225 409,272" fill="#fd542b"/>
        <rect x="454" y="127" width="68" height="63" fill="#fff"/>
        <path d="M478 148l-10 10 10 10M498 148l10 10-10 10M492 145l-8 26" fill="none" stroke="#121212" stroke-width="3.5" stroke-linecap="square"/>
        <path d="M435 60h52M461 34v52" stroke="#fff" stroke-width="1.5"/>
    </svg>`;
}

function coverMarkup(post, className) {
    const media = post.image
        ? `<img src="${escapeHtml(post.image)}" alt="${escapeHtml(post.title)}" loading="lazy" />`
        : coverIllustration();
    return `<figure class="${className}">${media}</figure>`;
}

function leadMarkup(post) {
    const category = post.category ? ` / ${escapeHtml(post.category)}` : '';
    return `
        <article class="bl-lead">
            ${coverMarkup(post, 'bl-lead__cover')}
            <div class="bl-lead__body">
                <p class="bl-kicker">Featured${category}</p>
                <h3 class="bl-lead__title">${titleMarkup(post)}</h3>
                <p class="bl-lead__excerpt">${escapeHtml(post.excerpt)}</p>
                <div class="bl-lead__foot">
                    ${metaMarkup(post)}
                    ${readMoreMarkup(post)}
                </div>
            </div>
        </article>
    `;
}

function entryMarkup(post) {
    return `
        <li class="bl-entry">
            <article class="bl-entry__inner">
                ${coverMarkup(post, 'bl-entry__cover')}
                <div class="bl-entry__body">
                    ${post.category ? `<p class="bl-entry__category">${escapeHtml(post.category)}</p>` : ''}
                    <h3 class="bl-entry__title">${titleMarkup(post)}</h3>
                    <p class="bl-entry__excerpt">${escapeHtml(post.excerpt)}</p>
                </div>
                <div class="bl-entry__aside">
                    ${metaMarkup(post)}
                    ${readMoreMarkup(post)}
                </div>
            </article>
        </li>
    `;
}

function renderFilters() {
    const group = document.querySelector('#blog-filters');
    if (!group) return;

    const categories = collectCategories(sortByNewest(state.posts));
    const buttons = [{ value: 'all', label: 'All' }, ...categories.map((category) => ({ value: category, label: category }))];

    group.innerHTML = buttons.map(({ value, label }) => {
        const pressed = value.toLowerCase() === state.category.toLowerCase();
        return `<button type="button" class="bl-filter ed-chip" data-category="${escapeHtml(value)}" aria-pressed="${pressed}">${escapeHtml(label)}</button>`;
    }).join('');
}

function syncFilterState() {
    document.querySelectorAll('#blog-filters .bl-filter').forEach((button) => {
        button.setAttribute('aria-pressed', String(button.dataset.category.toLowerCase() === state.category.toLowerCase()));
    });
}

function setStatus(message) {
    const status = document.querySelector('#blog-status');
    if (status) status.textContent = message;
}

function renderPosts() {
    const list = document.querySelector('#blog-posts');
    const featured = document.querySelector('#blog-featured');
    const indexSection = document.querySelector('.bl-latest');
    const emptyState = document.querySelector('#blog-empty-state');
    const emptyMessage = document.querySelector('#blog-empty-message');
    const resetButton = document.querySelector('[data-blog-reset]');

    if (!list || !featured) return;

    // Existing rules: newest first; the newest visible post leads and is not repeated below.
    const posts = sortByNewest(state.posts);
    const filtering = Boolean(state.query.trim()) || state.category !== 'all';
    const visible = filterPosts(posts, { query: state.query, category: state.category });

    if (!visible.length) {
        featured.innerHTML = '';
        list.innerHTML = '';
        if (indexSection) indexSection.hidden = false;
        if (emptyState) emptyState.hidden = false;
        if (emptyMessage) emptyMessage.textContent = posts.length ? 'No notes match your search.' : 'No notes published yet.';
        if (resetButton) resetButton.hidden = !filtering;
        setStatus(posts.length ? 'No notes match your search.' : 'No notes published yet.');
        return;
    }

    const [leadPost, ...earlierPosts] = visible;

    featured.innerHTML = leadMarkup(leadPost);
    list.innerHTML = earlierPosts.map(entryMarkup).join('');

    if (emptyState) emptyState.hidden = true;
    if (resetButton) resetButton.hidden = true;
    if (indexSection) indexSection.hidden = earlierPosts.length === 0;
    setStatus(filtering ? `${visible.length} ${visible.length === 1 ? 'note' : 'notes'} found.` : '');
}

function resetFilters() {
    state.query = '';
    state.category = 'all';
    const input = document.querySelector('#blog-search');
    if (input) input.value = '';
    syncFilterState();
    renderPosts();
}

export function initBlogPage() {
    const list = document.querySelector('#blog-posts');
    const featured = document.querySelector('#blog-featured');
    const indexSection = document.querySelector('.bl-latest');

    if (!list || !featured) {
        return;
    }

    featured.innerHTML = '<p class="bl-note" role="status">Loading the latest note…</p>';
    list.innerHTML = '';
    if (indexSection) indexSection.hidden = true;

    fetch(postsUrl)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to load blog posts: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            state.posts = Array.isArray(data.posts) ? data.posts : [];
            renderFilters();
            renderPosts();
        })
        .catch((error) => {
            console.error(error);
            featured.innerHTML = '<p class="bl-note" role="status">Notes are unavailable right now. Please try again later.</p>';
            list.innerHTML = '';
            if (indexSection) indexSection.hidden = true;
        });

    const searchForm = document.querySelector('#blog-search-form');
    const searchInput = document.querySelector('#blog-search');
    let searchTimer = null;

    searchForm?.addEventListener('submit', (event) => event.preventDefault());

    searchInput?.addEventListener('input', () => {
        state.query = searchInput.value;
        renderPosts();

        clearTimeout(searchTimer);
        const term = state.query.trim();
        if (term) {
            searchTimer = setTimeout(() => {
                trackEvent(EVENTS.BLOG_SEARCH, {
                    search_term: term,
                    results_count: filterPosts(state.posts, { query: term, category: state.category }).length
                });
            }, SEARCH_TRACK_DELAY);
        }
    });

    document.querySelector('#blog-filters')?.addEventListener('click', (event) => {
        const button = event.target.closest('.bl-filter');
        if (!button || button.dataset.category === state.category) return;

        state.category = button.dataset.category;
        syncFilterState();
        renderPosts();
        trackEvent(EVENTS.BLOG_CATEGORY_CHANGE, { category: state.category });
    });

    document.querySelector('[data-blog-reset]')?.addEventListener('click', () => {
        resetFilters();
        searchInput?.focus();
    });

    document.addEventListener('click', (event) => {
        const postLink = event.target.closest('#blog-posts a, #blog-featured a');
        if (!postLink) {
            return;
        }

        trackEvent(EVENTS.BLOG_OPEN, {
            post_title: postLink.dataset.postTitle || postLink.textContent.trim(),
            category: postLink.dataset.category || ''
        });
    });
}
