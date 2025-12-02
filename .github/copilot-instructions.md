# GitHub Copilot Instructions for S‑code

## Project Overview

S‑code is a collaborative, cloud-based coding platform built with Next.js 15 that enables real-time interview preparation and social coding. The platform features secure authentication, real-time collaborative editing with Y.js CRDTs, multi-language code execution, AI-powered coding assistance, and comprehensive room management.

## Architecture & Technology Stack

### Frontend
- **Framework**: Next.js 15 with App Router and TypeScript 5.8
- **UI Libraries**: React 19, Tailwind CSS, Radix UI components
- **Code Editor**: Monaco Editor with syntax highlighting
- **Real-time Collaboration**: Y.js (CRDTs), WebSocket, IndexedDB for offline persistence

### Backend
- **Database**: MongoDB with centralized connection (`lib/mongodb.ts`)
- **Caching & Rate Limiting**: Upstash Redis
- **Authentication**: bcrypt for password hashing, jose for JWT tokens
- **Email Service**: Resend for transactional emails
- **AI Integration**: Google Gemini 2.0 Flash for coding assistance

### Key Features
- Secure email/password authentication with verification
- Real-time collaborative code editing (multi-language support)
- WebSocket-based synchronization
- Room management system (interview prep, mock interviews, pair programming)
- Notes system with IndexedDB (up to 10 pages per room)
- AI chat integration with context-aware code analysis

## Project Structure

```
app/                    # Next.js App Router pages
├── api/               # API routes (auth, rooms, etc.)
│   └── auth/         # Authentication endpoints
├── dashboard/         # User dashboard
├── room/             # Collaborative coding rooms
└── ...               # Auth pages (login, signup, verify)

lib/                    # Core utilities and helpers
├── monaco/           # Monaco editor configuration
├── mongodb.ts        # Database connection (camelCase collections)
├── notesDB.ts        # IndexedDB for notes storage
├── refreshSession.ts # JWT session management
└── ...               # Utility functions

types/                  # TypeScript definitions
├── mongodbTypes.ts   # Database schema types
└── mogodbValidation.ts # Zod validation schemas

components/             # React components
├── dashboard/        # Dashboard-specific components
├── joinRoom/         # Room features (notes, AI chat)
├── custom/schedule/  # Modular form components
└── ui/               # Reusable UI components (Radix-based)

websocket/              # Y.js WebSocket server (port 1234)
```

## Authentication Flow

1. **Signup**: Email/password with domain validation (see `allowedEmailDomains` in `types/mogodbValidation.ts`)
2. **Email Verification**: Short-lived tokens in Redis (10-minute TTL)
3. **Login**: Password verification, refresh token issuance via `lib/refreshSession.ts`
4. **Session Management**: HttpOnly cookies with automatic token rotation
5. **Protected Routes**: Middleware validates refresh tokens server-side

### Security Best Practices
- Never store access tokens in localStorage
- Use HttpOnly cookies for refresh tokens
- Validate inputs with Zod schemas on both client and server
- Implement rate limiting for auth endpoints
- Use bcrypt for password hashing (strong rounds)

## Database Conventions

### Collections (all camelCase)
- `usersCollection`: User accounts with `emailVerified` flag
- `refreshTokensCollection`: JWT refresh tokens with `userId`, `token`, `expiresAt`
- `roomsCollection`: Coding room metadata
- `notesCollection`: Saved notes/code

### Validation
- All collections have MongoDB validators (see `types/mogodbValidation.ts`)
- User names must be letters-only (A-Z)
- Email domains must be in `allowedEmailDomains`
- Use Zod schemas for runtime validation

## Real-time Collaboration

### Y.js Integration
- Documents sync via WebSocket server (`websocket/server.js` on port 1234)
- Conflict-free collaborative editing with CRDTs
- Offline persistence via IndexedDB
- Language switching with Monaco Editor

### Supported Languages
- JavaScript, TypeScript, Python, Go, Java, C, C++

### Key Files
- `CollaborativeEditor.tsx`: Main editor component
- `lib/monaco/monacoEnvironment.ts`: Monaco configuration
- Dynamic loading of heavy dependencies for performance

## AI Integration (Gemini)

### Implementation Details
- Location: `components/joinRoom/gemmini/`
- Model: Google Gemini 2.0 Flash
- Features: Context-aware code analysis, smart retry logic with exponential backoff
- Rate limiting: Message length limits
- Focus: Programming-related questions only

### Usage Guidelines
- Always provide code context when requesting AI assistance
- Handle API errors gracefully with retry logic
- Format responses for readability

## Development Workflow

### Setup
```bash
# Install dependencies
npm install --legacy-peer-deps  # or pnpm install

# Environment variables (create .env.local)
MONGODB_URI=mongodb+srv://...
JWT_SECRET=...
UPSTASH_REDIS_REST_URL=...
RESEND_API_KEY=...
GEMINI_API_KEY=...

# Start WebSocket server
cd websocket && npx y-websocket

# Run development server
npm run dev
```

### Testing & Linting
```bash
npm run lint          # ESLint code checking
npm run build         # Production build
npm run audit:repo    # Git repository health check
```

### Git Best Practices
- Use conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`
- Keep commits atomic and focused
- See `docs/git-best-practices.md` for detailed guidelines

## Common Patterns

### API Routes
- Use Next.js API routes with TypeScript
- Validate input with Zod schemas
- Return consistent JSON responses with error handling
- Implement rate limiting for sensitive endpoints

### Form Handling
- Use `react-hook-form` with `@hookform/resolvers`
- Validate with Zod schemas
- Provide clear error messages
- Follow patterns in `components/custom/schedule/`

### Component Structure
- Prefer functional components with hooks
- Use Radix UI for accessible components
- Follow Tailwind CSS conventions
- Keep components small and focused

### Error Handling
- Use error boundaries for React errors
- Implement try-catch for async operations
- Log errors appropriately (avoid sensitive data)
- Provide user-friendly error messages

## Notes System

- **Storage**: IndexedDB with `roomId + pageNumber` as key
- **Limits**: 10 pages per room (numbered 0-9), 5000 characters per page
- **Features**: Auto-save every 5 minutes, editable titles, smart gap filling
- **Implementation**: `lib/notesDB.ts`, `components/joinRoom/notes/`

## Room Management

- **Types**: Interview prep, mock interviews, pair programming
- **Privacy**: Public and private rooms
- **Roles**: Host controls (manage participants, settings)
- **Scheduling**: Create and schedule coding sessions

## Coding Guidelines

### TypeScript
- Maintain strict type safety
- Define interfaces for complex objects
- Use type guards where appropriate
- Avoid `any` type unless absolutely necessary

### React Best Practices
- Use hooks appropriately (useState, useEffect, useCallback, useMemo)
- Avoid prop drilling (use context when needed)
- Memoize expensive computations
- Clean up effects properly

### Performance
- Lazy load heavy components (Monaco, Y.js workers)
- Use dynamic imports for code splitting
- Optimize bundle size
- Implement proper caching strategies

### Accessibility
- Use semantic HTML
- Provide ARIA labels
- Ensure keyboard navigation
- Use Radix UI for accessible primitives

## Troubleshooting Common Issues

### Installation
- Use `npm install --legacy-peer-deps` for dependency conflicts
- Ensure Node.js 18+ (tested with Node.js 20)

### Authentication
- Check domain in `allowedEmailDomains` for signup errors
- Verify Redis connection for email verification
- Ensure JWT_SECRET is set for token errors

### Collaboration
- Confirm WebSocket server is running (port 1234)
- Check browser console for connection errors
- Verify room ID is correct

### Build Errors
- Run `npm install` to ensure all dependencies are installed
- Check TypeScript errors with `npm run build`
- Verify environment variables are set

## Contributing

When contributing to this project:
1. Follow existing code patterns and conventions
2. Maintain type safety and validation
3. Add tests for new features
4. Update documentation as needed
5. Use conventional commits
6. Keep changes focused and atomic

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Y.js Documentation](https://docs.yjs.dev/)
- [Monaco Editor API](https://microsoft.github.io/monaco-editor/)
- [Radix UI](https://radix-ui.com/)
- [Zod](https://zod.dev/)

---

This is a learning-focused project emphasizing security, type safety, and modern web development practices. When suggesting code changes, prioritize maintainability, security, and user experience.
