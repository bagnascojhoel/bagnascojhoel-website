# .portfolio-description.json Schema

This document describes the structure accepted by `.portfolio-description.json` files placed at the
repository root. The server will attempt to fetch and validate these files at build / runtime.

## Schema

- `repositoryId` (string, required) - The numeric repository id as string (used internally to match
  extras to repositories).
- `title` (string, required) - The display title to use instead of the repository name.
- `description` (string, optional) - Custom long description to use when the repo's own description
  is empty.
- `tags` (string[], optional) - Custom topics/tags to merge with repository topics.
- `websiteUrl` (string, optional) - External website URL (fallback after repo homepage).
- `complexity` (enum, optional) - One of `extreme`, `high`, `medium`, `low`.
- `startsOpen` (boolean, optional) - Whether the project card should start expanded in the UI.
- `showEvenArchived` (boolean, optional) - Whether to include an archived repository in the
  portfolio.

## Validation Rules

- `title` and `repositoryId` are required.
- `tags` must be an array of strings if present.
- `websiteUrl` must be a valid URL if present.

## Best Practices

- Keep `complexity` consistent across projects (use `Extreme`, `High`, `Medium`, `Low` as internal
  guidelines).
- Use `showEvenArchived` sparingly for legacy projects you want to keep visible.

## Troubleshooting

- Invalid JSON, missing required fields, or unknown value types will cause the file to be skipped
  and a warning to be logged. The portfolio will still render using GitHub data.
