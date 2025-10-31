# Contributing & Collaboration Workflow

Welcome to S‑code! This guide will help you contribute effectively to our collaborative coding platform.

## 🚀 Getting Started

### Development Setup

1. **Fork and clone the repository**
2. **Install dependencies**: Use `npm install --legacy-peer-deps` or `pnpm install`
3. **Set up environment**: Copy `.env.example` to `.env.local` and configure
4. **Start development**: Run `npm run dev` or `pnpm dev`

### Repository Structure

```
├── app/              # Next.js 15 App Router pages and API routes
├── components/       # Reusable React components
│   ├── joinRoom/    # Room-specific components (notes, AI chat)
│   ├── dashboard/   # Dashboard components
│   └── ui/          # Reusable UI components
├── hooks/           # Custom React hooks
├── lib/             # Utility functions and configurations
│   ├── notesDB.ts   # IndexedDB for notes storage
│   └── mongodb.ts   # Database connection
├── types/           # TypeScript type definitions
├── docs/            # Documentation files
└── websocket/       # WebSocket server for real-time collaboration
```

## Core Rules & Workflow

This repository follows a structured development workflow to maintain code quality and prevent deployment issues.

## Branching Strategy

- `master` (protected): Production-ready code, only updated via Pull Requests
- Feature branches: Use descriptive names with prefixes:
  - `feat/user-authentication` - New features
  - `fix/login-validation` - Bug fixes  
  - `docs/setup-guide` - Documentation updates
  - `refactor/auth-handlers` - Code refactoring
  - `chore/dependency-updates` - Maintenance tasks

### Branch Workflow

1. **Create a feature branch** from `master`
2. **Make focused changes** - keep PRs small and scoped
3. **Test thoroughly** - ensure all features work as expected
4. **Submit a Pull Request** with clear description
5. **Address review feedback** promptly
6. **Merge when approved** - squash commits for clean history

## Code Quality Standards

### Commit Conventions

We use [Conventional Commits](https://conventionalcommits.org/) for clear, consistent commit messages:

```bash
feat(auth): add OAuth integration with GitHub
fix(editor): resolve syntax highlighting issue  
docs(readme): update installation instructions
refactor(api): extract validation helpers
chore(deps): update MongoDB driver to v6.18.0
```

### Linting and Formatting

- **Run linting**: `npm run lint` or `pnpm lint`
- **Fix lint errors** before submitting PRs
- **Address TypeScript warnings** where practical
- **Use consistent code style** - prefer extracting helpers over disabling rules

### Testing Guidelines

- **Test authentication flows**: signup → verify → login
- **Verify API consistency**: ensure response schemas remain unchanged
- **Test collaborative features**: room creation, joining, real-time editing
- **Test notes system**: create, edit, delete pages (0-9 numbering)
- **Verify IndexedDB storage**: notes persist across sessions
- **Check error boundaries**: verify graceful error handling
- **Test code execution**: run code in supported languages

## API Design Guidelines

### Authentication Routes

All auth route responses follow a normalized shape for consistency:

```typescript
interface AuthResponse {
  ok: boolean;
  message: string;
  redirect?: string;
  fieldErrors?: Record<string, string>;
  user?: {
    id: string;
    name: string;
  };
}
```

**Do not introduce divergent response shapes** without updating clients and documentation.

### Error Handling

- Use proper HTTP status codes
- Provide meaningful error messages
- Implement rate limiting for security
- Log errors appropriately (avoid exposing sensitive data)

## Environment Configuration

### Required Environment Variables

Critical env vars (must exist before deploying):

```bash
# Database
MONGODB_URI=mongodb+srv://...
MONGODB_DB=scode

# Authentication  
JWT_SECRET=your-secure-secret

# Redis
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...

# Email
RESEND_API_KEY=...
MY_DOMAIN=https://your-domain.com
```

### Development vs Production

- **Development**: Use `.env.local` for local overrides
- **Production**: Set environment variables in deployment platform
- **Never commit** real secrets to version control

## Pull Request Guidelines

### Before Submitting a PR

- [ ] **Lint passes** with no errors, minimal warnings
- [ ] **All tests pass** (if applicable)
- [ ] **Authentication flows tested**: signup → verify → login
- [ ] **No debug code**: remove console logs (except intentional error logs)
- [ ] **API consistency maintained**: response schemas unchanged or docs updated
- [ ] **Documentation updated**: if behavior changes require doc updates
- [ ] **Dependencies justified**: new dependencies should be necessary and well-maintained

### PR Description Template

```markdown
## What Changed
Brief description of the changes made.

## Why
Explanation of the motivation or problem being solved.

## How to Test
Steps for reviewers to test the changes.

## Screenshots (if applicable)
Visual changes should include before/after screenshots.

## Checklist
- [ ] Code follows project conventions
- [ ] Tests added/updated (if applicable)
- [ ] Documentation updated (if needed)
- [ ] No breaking changes (or breaking changes documented)
```

### Key Features to Test

**Notes System**
- Create up to 10 pages per room (numbered 0-9)
- Edit page titles and content (5000 char limit)
- Auto-save every 5 minutes
- Delete pages (maintains at least 1 page)
- Smart numbering fills gaps automatically

**Collaborative Editor**
- Real-time text synchronization via Y.js
- Multi-language support (JS, TS, Python, Go, Java, C, C++)
- Code execution with output display
- No cursor tracking (optimized for performance)

Last updated: January 2025

## 🤝 Community Guidelines

### Getting Help

- **Documentation**: Check `/docs` folder for guides and examples
- **Issues**: Search existing issues before creating new ones
- **Discussions**: Use GitHub Discussions for questions and ideas
- **Code Review**: Be constructive and respectful in reviews

### Reporting Issues

When reporting bugs, please include:

- **Steps to reproduce** the issue
- **Expected vs actual behavior**
- **Browser and OS information**
- **Console errors** (if any)
- **Screenshots** (for UI issues)

### Suggesting Features

For feature requests, please provide:

- **Use case description** - what problem does this solve?
- **Proposed solution** - how should it work?
- **Alternative solutions** considered
- **Additional context** - mockups, examples, etc.

## 🔧 Development Resources

### Available Scripts

```bash
npm run dev              # Start development server
npm run build           # Build for production
npm run lint            # Run ESLint
npm run audit:repo      # Run repository health audit
npm run help:git        # Show Git learning resources
```

### Learning Resources

- **[Git Best Practices](docs/git-best-practices.md)** - Complete workflow guide
- **[Development Setup](docs/development-setup.md)** - Configuration guide  
- **[Repository Scorecard](docs/repository-scorecard.md)** - Self-assessment tool
- **[Learning Checklist](docs/learning-checklist.md)** - Progressive skill development

### Architecture Overview

S‑code is built with modern web technologies:

- **Frontend**: Next.js 15 + React 19 + TypeScript
- **Styling**: Tailwind CSS + Radix UI components
- **Database**: MongoDB with optimized connection pooling
- **Caching**: Upstash Redis for rate limiting and sessions
- **Real-time**: Y.js CRDTs with WebSocket synchronization
- **Local Storage**: IndexedDB for notes (up to 10 pages per room)
- **Code Editor**: Monaco Editor with multi-language support
- **Authentication**: JWT with HttpOnly cookies
- **Email**: Resend for transactional emails

---

**Thank you for contributing to S‑code!** Your contributions help make coding practice more collaborative and accessible for everyone.
