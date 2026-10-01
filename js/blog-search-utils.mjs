export function buildSearchSuggestions(posts, limit = 6) {
    const counts = new Map();

    const addKeyword = (keyword, weight = 1) => {
        if (!keyword) return;

        const normalized = keyword.trim().toLowerCase();
        if (!normalized) return;

        counts.set(normalized, (counts.get(normalized) || 0) + weight);
    };

    posts.forEach((post) => {
        if (post.category) addKeyword(post.category, 3);

        (post.tags || []).forEach((tag) => addKeyword(tag, 2));

        const titleWords = (post.title || '')
            .split(/\s+/)
            .map((word) => word.replace(/[^\p{L}\p{N}]/gu, '').trim())
            .filter((word) => word.length > 2);

        titleWords.forEach((word) => addKeyword(word, 1));
    });

    const suggestions = Array.from(counts.entries())
        .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
        .map(([keyword]) => keyword)
        .map((keyword) => keyword.charAt(0).toUpperCase() + keyword.slice(1));

    const normalizedLimit = Math.min(Math.max(limit, 4), 8);
    return suggestions.slice(0, normalizedLimit);
}

export function buildHeroStats(posts) {
    const categories = new Set();
    const tags = new Set();

    posts.forEach((post) => {
        if (post.category) {
            categories.add(post.category);
        }
        (post.tags || []).forEach((tag) => tags.add(tag));
    });

    return [
        { label: 'Notes', value: posts.length },
        { label: 'Topics', value: categories.size },
        { label: 'Subjects', value: tags.size }
    ];
}

const WORDS_PER_MINUTE = 200;

/** Lowercase and strip diacritics so "le" matches "Lê" and "duong" matches "đường". */
export function normalizeText(value) {
    return String(value ?? '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .toLowerCase()
        .trim();
}

/** Minutes to read: explicit `reading_time` metadata wins, otherwise derived from the post content. */
export function readingMinutes(post, wordsPerMinute = WORDS_PER_MINUTE) {
    const explicit = Number(post?.reading_time);
    if (Number.isFinite(explicit) && explicit > 0) {
        return Math.round(explicit);
    }

    const text = post?.content || post?.excerpt || '';
    const words = text.split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
}

/** Categories in order of first appearance, so the filter row follows the listing order. */
export function collectCategories(posts) {
    const seen = new Map();

    posts.forEach((post) => {
        const category = String(post.category ?? '').trim();
        const key = normalizeText(category);
        if (key && !seen.has(key)) {
            seen.set(key, category);
        }
    });

    return Array.from(seen.values());
}

/**
 * Applies the category and the search query together. Every query word must appear in the
 * post's title, excerpt, category, tags or content. Relative order is preserved.
 */
export function filterPosts(posts, { query = '', category = 'all' } = {}) {
    const terms = normalizeText(query).split(/\s+/).filter(Boolean);
    const categoryKey = normalizeText(category);
    const anyCategory = !categoryKey || categoryKey === 'all';

    return posts.filter((post) => {
        if (!anyCategory && normalizeText(post.category) !== categoryKey) {
            return false;
        }

        if (!terms.length) {
            return true;
        }

        const haystack = normalizeText([
            post.title,
            post.excerpt,
            post.category,
            ...(post.tags || []),
            post.content
        ].join(' '));

        return terms.every((term) => haystack.includes(term));
    });
}
