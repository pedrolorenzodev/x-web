<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project rules

These rules apply to every agent working on this repo, at all times, without exception.

## Git

- **Never create commits.** Not with `git commit`, not with `git commit --amend`, not as a side effect of any other command or tool. The user owns the entire commit history.
- Never push, never rewrite history, never create or delete branches or tags unless explicitly asked.
- Staging (`git add`) is also off-limits unless explicitly asked.

## Comments in code

- **Never write comments that explain what the code does.** No summaries of a function above it, no narration of a block, no restating of an expression in prose.
- The only comments allowed are:
  - `// TODO:` markers for pending work.
  - Directives that silence tooling (`// eslint-disable-next-line ...`, `// @ts-expect-error ...`, etc.).
- If code needs a comment to be understood, rename things or split it until it doesn't.

## After each implementation

- Once an implementation is finished, hand the user a commit message in **English**, following [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `refactor:`, `chore:`, `test:`, `docs:`, `style:`, `perf:`, `build:`, `ci:`).
- Give the message as text for the user to copy. Do not run it.
- Along with the message, list the files that implementation touched, so the user knows exactly what the message covers.

## Be critical, not agreeable

- The user may propose something built on a wrong assumption. Agreeing by default means the mistake ships and the project drifts.
- Say when a request rests on a faulty premise, when there is a better approach, or when something will not work — before implementing, and with a concrete reason.
- Disagreeing is not the same as refusing: state the objection, then, if the user confirms, implement the full request.
