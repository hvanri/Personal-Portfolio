const notionEndpoint = 'https://api.notion.com/v1/databases/3a90b2bb0186804d98e0ce4123d534fe/query';
const notionToken = 'ntn_i29986000703jbipCLypqMTCf3S8Xt1oiqBHIctxBie4iJ';

function formatDate(isoString) {
    try {
        return new Date(isoString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    } catch {
        return isoString;
    }
}

function getTitleFromPage(page) {
    const rawTitle = page.properties?.Name?.title || [];
    return rawTitle.map((item) => item.plain_text).join('') || 'Untitled';
}

function getUrlFromPage(page) {
    return page.properties?.URL?.url || page.properties?.Title?.rich_text?.[0]?.text?.link?.url || '#';
}

export async function initRecentPosts() {
    const listElement = document.querySelector('#recent-posts');
    if (!listElement) {
        return;
    }

    listElement.innerHTML = '<li class="post-item">Loading recent posts…</li>';

    try {
        const response = await fetch(notionEndpoint, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${notionToken}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ page_size: 5 }),
        });

        if (!response.ok) {
            throw new Error(`Notion API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const pages = Array.isArray(data.results) ? data.results : [];

        if (pages.length === 0) {
            listElement.innerHTML = '<li class="post-item">No posts found.</li>';
            return;
        }

        listElement.innerHTML = pages
            .map((page) => {
                const title = getTitleFromPage(page);
                const url = getUrlFromPage(page);
                const date = formatDate(page.created_time || page.last_edited_time || '');
                return `
                    <li class="post-item">
                        <span class="post-date">${date}</span>
                        <a href="${url}" target="_blank" rel="noopener noreferrer">${title}</a>
                    </li>
                `;
            })
            .join('');
    } catch (error) {
        listElement.innerHTML = `<li class="post-item">Unable to load recent posts.</li>`;
        console.error('Failed to load Notion posts:', error);
    }
}
