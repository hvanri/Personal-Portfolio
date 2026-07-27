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
  "content": "Full article content"
}
```

## Notes
- The page automatically renders all entries from this file.
- Categories and search are generated from the post data.
- If you want a richer experience later, you can expand this into individual post pages or a CMS-backed workflow.
