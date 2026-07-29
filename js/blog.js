const postsUrl = './blog/posts.json';

const state = {
    posts: [],
    activeCategory: 'All',
    query: '',
    view: localStorage.getItem('blogView') || 'grid'
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
                    <span class="post-note">Story added to your personal journal</span>
                </div>
            </div>
        </article>
    `).join('');
}

export function initBlogPage() {
    const grid = document.querySelector('#blog-posts');
    const searchInput = document.querySelector('#blog-search');
    const categoryFilter = document.querySelector('#blog-categories');
    const btnGrid = document.querySelector('#view-grid');
    const btnList = document.querySelector('#view-list');

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
            renderPosts();
        })
        .catch((error) => {
            console.error(error);
            grid.innerHTML = '<div class="empty-state">Unable to load stories right now. Please try again later.</div>';
        });

    if (searchInput) {
        searchInput.addEventListener('input', (event) => {
            state.query = event.target.value.trim();
            renderPosts();
        });
    }

    categoryFilter.addEventListener('click', (event) => {
        const button = event.target.closest('button[data-category]');
        if (!button) return;

        state.activeCategory = button.dataset.category;
        renderCategories(state.posts);
        renderPosts();
    });

    if (btnGrid) {
        btnGrid.addEventListener('click', () => applyView('grid'));
    }

    if (btnList) {
        btnList.addEventListener('click', () => applyView('list'));
    }
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
