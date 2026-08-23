import { trackEvent } from './analytics/analytics.js';
import { EVENTS } from './analytics/events.js';

const postsUrl = './blog/posts.json';

const state = {
    posts: []
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

function titleMarkup(post) {
    const title = escapeHtml(post.title);
    if (!post.blog_link) {
        return title;
    }

    return `<a href="${escapeHtml(post.blog_link)}"
        target="_blank"
        rel="noopener"
        data-post-title="${title}"
        data-category="${escapeHtml(post.category || '')}">${title}<span class="entry-arrow" aria-hidden="true">↗</span></a>`;
}

function dateMarkup(post) {
    if (!post.date) return '';
    return `<time datetime="${escapeHtml(post.date)}">${escapeHtml(formatDate(post.date))}</time>`;
}

function leadMarkup(post) {
    return `
        <article class="lead-note">
            <p class="lead-note__date">${dateMarkup(post)}</p>
            <h2 class="lead-note__title">${titleMarkup(post)}</h2>
            ${post.image ? `<figure class="lead-note__figure"><img src="${escapeHtml(post.image)}" alt="${escapeHtml(post.title)}" loading="lazy" /></figure>` : ''}
            <p class="lead-note__excerpt">${escapeHtml(post.excerpt)}</p>
        </article>
    `;
}

function entryMarkup(post, index) {
    return `
        <li class="entry">
            <span class="entry-number" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span>
            <h3 class="entry-title">${titleMarkup(post)}</h3>
            <p class="entry-date">${dateMarkup(post)}</p>
            <p class="entry-excerpt">${escapeHtml(post.excerpt)}</p>
        </li>
    `;
}

function renderPosts() {
    const list = document.querySelector('#blog-posts');
    const featured = document.querySelector('#blog-featured');
    const indexSection = document.querySelector('.journal-index');
    const emptyState = document.querySelector('#blog-empty-state');

    if (!list || !featured) return;

    const posts = sortByNewest(state.posts);

    if (!posts.length) {
        featured.innerHTML = '';
        list.innerHTML = '';
        if (indexSection) indexSection.hidden = false;
        if (emptyState) emptyState.hidden = false;
        return;
    }

    const [leadPost, ...earlierPosts] = posts;

    featured.innerHTML = leadMarkup(leadPost);
    list.innerHTML = earlierPosts.map(entryMarkup).join('');

    if (emptyState) emptyState.hidden = true;
    if (indexSection) indexSection.hidden = earlierPosts.length === 0;
}

export function initBlogPage() {
    const list = document.querySelector('#blog-posts');
    const featured = document.querySelector('#blog-featured');
    const indexSection = document.querySelector('.journal-index');

    if (!list || !featured) {
        return;
    }

    featured.innerHTML = '<p class="journal-note" role="status">Loading the latest note…</p>';
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
            renderPosts();
        })
        .catch((error) => {
            console.error(error);
            featured.innerHTML = '<p class="journal-note" role="status">Notes are unavailable right now. Please try again later.</p>';
            list.innerHTML = '';
            if (indexSection) indexSection.hidden = true;
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
