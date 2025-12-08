# Daily AI Blog Guide

This website now features a "Daily AI Research" blog. 

## How it Works
The blog content is stored in a simple data file (`js/blog-posts.js`) rather than a database. This keeps the site fast, secure, and easy to host anywhere (GitHub Pages, Vercel, etc.) without a backend.

## Adding a New Post
To add a new "Daily AI" research post:

1.  Open `js/blog-posts.js`.
2.  Add a new object to the top of the `blogPosts` array:

```javascript
    {
        id: "unique-id-date",
        title: "Title of the Research",
        date: "Month Day, Year",
        category: "Sector (e.g., Health, Education)",
        author: "VitaInspire AI",
        excerpt: "A short 1-2 sentence summary...",
        content: `
            <h3>Heading</h3>
            <p>Paragraph content...</p>
            ...
        `
    },
```

## Automating with AI
To maintain the "Daily" cadence:
1.  You can ask an AI agent (like this one) to "Research and write today's blog post about [Topic]".
2.  The agent can search the web for the latest case studies and generate the code snippet for `js/blog-posts.js`.

## Deployment
After adding a new post to the file, simply commit and push your changes to GitHub. The live site will update automatically.
