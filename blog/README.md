# Blog content guide

This folder stores the content for the personal blog page.

## How to add a new story
1. Open the file `posts.json`.
2. Add a new object to the `posts` array.
3. Use the following structure:

```json
{
  "id": "unique-story-slug",
  "title": "Story title",
  "date": "YYYY-MM-DD",
  "category": "Trips",
  "excerpt": "Short summary for the card preview",
  "tags": ["travel", "memory"],
  "content": "Full article content",
  "image": "/assets/images/blog/cover.jpg",
  "blog_link": "https://link-to-the-full-article",
  "reading_time": 6
}
```

`image`, `blog_link` and `reading_time` are optional. Without `reading_time`, the page derives
minutes from `content` (200 words per minute). Posts without `image` get a built-in illustration.

## Notes
- The page automatically renders all entries from this file.
- Posts are listed newest first; the newest post that matches the current search/filter is shown as the featured note.
- Category filters and search are generated from the post data.
- If you want a richer experience later, you can expand this into individual post pages or a CMS-backed workflow.
