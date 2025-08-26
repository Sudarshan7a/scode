# Contributing & Collaboration Workflow

This repository is currently managed with an assisted workflow. To keep control explicit and avoid unintended deployments, the following rules apply.

## Core Rule (Important)

The AI assistant MUST NOT push to any remote branch unless you (the human maintainer) explicitly say to push. Default behavior: make local commits only.

Phrases that allow a push (examples):

- "push"
- "push now"
- "create PR" (will require a push of the feature branch)

Everything else: only stage + commit locally.

## Branching Strategy

- `master` (protected): only updated via Pull Requests.
- Feature branches: use short, purpose‑based names (e.g. `refactor-verify-handler`, `feat-room-permissions`).
- Keep changes scoped; avoid large multi‑concern PRs.

## Commit Conventions

Use Conventional Commits:

- `feat(auth): add x`
- `fix(rate-limit): handle null ip`
- `refactor(signup): extract validation helpers`
- `chore(deps): update redis client`
- `docs: add contributing guide`

## Auth / API Consistency

All auth route responses follow a normalized shape:

```json
{ "ok": boolean, "message": string, "redirect?": string, "fieldErrors?": Record<string,string>, "user?": {"id": string, "name": string} }
```

Do not introduce divergent shapes without updating clients.

## Lint & Quality

- Run `pnpm exec eslint .` before requesting a push / PR.
- Address complexity / duplication warnings where practical.
- Prefer extracting helpers over disabling rules. Only add `// eslint-disable-next-line` if refactor is impractical.

## Environment Assumptions

Critical env vars (must exist before pushing deploy‑relevant code):

```
MONGODB_URI
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
RESEND_API_KEY
JWT_SECRET
MY_DOMAIN
```

## Pull Request Checklist

Before asking to push / open PR:

- [ ] Lint passes (no errors, minimal warnings)
- [ ] Auth flows tested: signup → verify → login
- [ ] No accidental console logs (except intentional error logs)
- [ ] Response schema unchanged or docs updated
- [ ] Added/updated docs if behavior changed

## AI Assistant Operational Mode

| Action Requested by You    | Assistant Response                                                 |
| -------------------------- | ------------------------------------------------------------------ |
| "commit"                   | Stage & commit locally (no push)                                   |
| "commit and push" / "push" | Stage (if needed), commit (if needed), then push                   |
| "don’t push" / default     | Will not push until explicit instruction                           |
| "create PR"                | Will (after confirmation) push branch, then outline PR description |

If you change the rule, update this file so behavior stays transparent.

---

Last updated: 2025-08-09
