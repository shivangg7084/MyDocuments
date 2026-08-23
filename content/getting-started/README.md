---
description: How this library is organized and how to add your own content.
---

# Getting Started

This folder demonstrates the file types the library supports. Everything you see
here is rendered straight from the files inside `public/content/getting-started/`.

## Markdown

Regular `.md` files render with full **GitHub-flavored Markdown** support:

- Nested lists
  - like this
- [Links](https://github.com)
- `inline code`

> Blockquotes look like this.

### Code blocks

```ts
export function greet(name: string): string {
  return `Hello, ${name}!`;
}
```

### Tables

| File type | Extension       | Viewer            |
| --------- | --------------- | ------------------ |
| Markdown  | `.md`           | Rendered reader    |
| Video     | `.mp4`, `.webm` | Custom video player|
| PDF       | `.pdf`          | Embedded viewer    |
| Image     | `.png`, `.jpg`  | Lightbox viewer    |
| Other     | anything else   | Download prompt    |

## Other files in this folder

Open [notes.md](./notes.md) for a second markdown example, or check the `files/`
folder for a plain-text file that has no dedicated preview.
