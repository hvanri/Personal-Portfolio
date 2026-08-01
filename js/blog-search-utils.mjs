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
