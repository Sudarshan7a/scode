## S‑code

S‑code is a collaborative, cloud-based coding platform built with Next.js that blends real-time interview preparation with social coding to make learning more engaging and less isolating. It offers a secure, streamlined authentication system, role-based room access, and a scalable architecture for collaborative code editing.

### Core vision

Code with friends. Learn faster. Ace interviews. S‑code makes coding practice feel like multiplayer gaming — secure, fast, and frustration-free.

## Tech stack

- Next.js 15 + TypeScript (App Router)
- MongoDB Node driver (centralized connection in `lib/mongodb.ts`)
- Upstash Redis (verification tokens, rate limiting)
- Resend (email delivery)
- Zod + react-hook-form (form validation)
- bcrypt (password hashing), jose/jwt (access tokens)
- Monaco Editor + Y.js (real-time collaborative code editing)
- WebSocket server (Y.js collaborative document synchronization)
- IndexedDB persistence (offline content storage)

## Security & authentication

Privacy-first auth and token hygiene:

- Email/password signup with domain restriction
- Email verification with short‑lived tokens (stored in Redis)
- Secure, HttpOnly refresh tokens in cookies (no access tokens in localStorage)
- Middleware-protected routes with server-side refresh validation
- Rate limiting hooks in place to prevent brute-force attacks
- Strong password hashing (bcrypt)
- Extensible foundation for MFA and session management

## Features (MVP)

- User accounts with email verification before first login
- Allowed-domain signup rules
  - Domain list: `types/mogodbValidation.ts` (`allowedEmailDomains`)
  - Mongo collection validator enforces the same rule
- Secure login/logout and refresh‑token based session management
- Automatic access‑token refresh in background (from refresh token)
- Protected routes (middleware checks before dashboard/rooms)
- **Real-time collaborative code editor**
  - Monaco Editor with syntax highlighting for JavaScript, TypeScript, Python, Go, Java, C, and C++
  - Real-time synchronization using Y.js CRDTs
  - WebSocket-based collaboration with automatic conflict resolution
  - Offline persistence with IndexedDB
- **Room management system**
  - Create, schedule, and join coding rooms
  - Host and join forms with validation
  - Room types: interview, mock interview, pair programming
  - Privacy levels: public and private rooms
- **Dashboard interface**
  - Room creation and scheduling tools
  - Session management and tracking
  - User activity overview
- Configurable rules (e.g., update allowed domains, adjust verification link expiry)
- Clear API responses `{ ok, message, ... }` for predictable handling

## Roadmap

**Recently Completed**

- ✅ Real-time collaborative code rooms (Monaco + Y.js)
- ✅ Multi-language support (JavaScript, TypeScript, Python, Go, Java, C, C++)
- ✅ Room creation and management system
- ✅ Registration form refactoring with modular components

**In Progress**

- Room roles & permissions
- Explore page for public coding sessions

**Planned**

- OAuth integrations (GitHub, Google)
- Session management UI
- MFA (TOTP) & device-based trust
- Invite-only and public room modes
- Integrated notes & code history
- Video/audio integration for interviews

## Getting started

1. Install dependencies

```powershell
npm install --legacy-peer-deps
```

2. Configure environment

Create `.env.local` with at least:

```dotenv
# Mongo
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority
MONGODB_DB=scode                 # optional override of database name

# JWT
JWT_SECRET=replace-with-a-long-random-string

# Redis (Upstash)
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...

# Email
RESEND_API_KEY=...
MY_DOMAIN=http://localhost:3000   # used to build verify links
```

3. Start the WebSocket server (for real-time collaboration)

```powershell
cd websocket
npm install
node server.js
```

4. Run the dev server

```powershell
npm run dev
```

Open http://localhost:3000.

## Auth flows

Signup

- Client validates with Zod; server validates again
- Email domains must be in `allowedEmailDomains` (e.g. gmail.com, outlook.com, ...)
- On success, user is created with `emailVerified=false` and a verification email is sent

Verify email

- Route: `GET /api/auth/verify?token=...`
- Token stored in Redis with 10-minute TTL; upon success, user `emailVerified=true`
- A refresh session is now issued automatically and the user is redirected straight to the dashboard
- UI page: `app/verify-email/[token]/page.tsx` handles status + redirect

Login

- Verifies `passwordHash` against input
- If `emailVerified=false`, blocks login and resends a verification email
- On success, issues (rotated) refresh token via centralized `issueRefreshSession` util and sets cookies

Tokens

- Refresh token: stored in Mongo with fields `{ userId, token, createdAt, expiresAt }` (issued & optionally rotated by `lib/refreshSession.ts`)
- Access token: short-lived JWT issued on demand from refresh token

## Collaborative Editor

The real-time collaborative editor is built with Monaco Editor and Y.js for seamless multiplayer coding:

**Supported Languages**
- JavaScript
- TypeScript  
- Python
- Go
- Java
- C
- C++

**Key Features**
- Real-time synchronization using Y.js CRDTs (Conflict-free Replicated Data Types)
- WebSocket-based collaboration with automatic conflict resolution
- Offline persistence with IndexedDB
- Language switching with syntax highlighting
- Resizable panels for optimal workspace layout

**Architecture**
- `CollaborativeEditor.tsx`: Main editor component with language selection
- `lib/monaco/monacoEnvironment.ts`: Monaco editor configuration
- WebSocket server: Handles Y.js document synchronization
- IndexedDB persistence: Stores documents locally for offline access

The editor dynamically loads heavy dependencies (Monaco, Y.js workers) only when needed to maintain fast initial page loads.

## Collections & validation

Central types: `types/mongodbTypes.ts`

Mongo validators (typed as TS constants): `types/mogodbValidation.ts`

- Users: letters-only `name`, allowed email domains, `emailVerified` boolean
- Refresh tokens: camelCase fields (`userId`, `createdAt`, `expiresAt`)
- Rooms, saved notes/code, user activity: basic shapes provided

Connection: `lib/mongodb.ts`

- Exposes camelCase collection handles (e.g. `usersCollection`)
- Honors `MONGODB_DB` if set; logs connected DB in dev

## Project structure

```
app/                    # Next.js App Router pages
├── api/               # API routes (auth, etc.)
├── dashboard/         # Dashboard pages
├── room/             # Collaborative room pages
└── ...               # Auth pages (login, signup, verify)

lib/                    # Database, auth, and utility helpers
├── monaco/           # Monaco editor environment setup
├── mongodb.ts        # Database connection
├── refreshSession.ts # Session management
└── ...               # Other utilities

types/                  # TypeScript types & validators
├── mongodbTypes.ts   # Database schema types
├── mogodbValidation.ts # Validation rules
└── ...

components/             # UI and feature components
├── dashboard/        # Dashboard-specific components
├── custom/
│   └── schedule/     # Registration forms (modular)
│       ├── dialogs/  # Form dialogs
│       ├── fields/   # Reusable form fields
│       ├── forms/    # Complete form components
│       └── schemas/  # Validation schemas
├── ui/               # Reusable UI components
└── ...

websocket/              # Y.js WebSocket server for collaboration

public/                 # Static assets
```

## Configuration tips

- Allowed domains: update `allowedEmailDomains` in `types/mogodbValidation.ts`
- Email template: `lib/EmailTemplate.ts` (copy, CTA, expiry note)
- Verification token TTL: `lib/verifyToken.ts` (Redis set with EX 600)
- WebSocket server port: Default is 1234, can be configured in `websocket/server.js`

## Troubleshooting

**Authentication Issues**
- Domain not allowed on signup
  - Error appears under the email field: update `allowedEmailDomains` to include your domain
- “Document failed validation” on user insert
  - `name` must be letters-only (A–Z); ensure username sanitization or adjust validator
- No verification email
  - Check `RESEND_API_KEY` and `MY_DOMAIN` URL; Resend may require a verified sender domain
- Refresh token errors / redirects to login
  - Verify middleware and `/api/auth/verify-refresh-token` endpoint; check token `expiresAt`

**Collaboration Issues**
- Editor not syncing between users
  - Ensure WebSocket server is running on port 1234
  - Check browser console for connection errors
  - Verify IndexedDB is enabled in the browser
- Language switching not working
  - Monaco language contributions are loaded dynamically; check network tab for failed imports
- Editor performance issues
  - Heavy Monaco/Y.js imports are deferred until editor mount; check for console errors during initialization

## Commit history helper (optional)

See `realistic-commit-plan.md` for a batch script that stages and backdates a realistic series of commits across the past weeks.

---

Made with Next.js App Router, MongoDB, and a secure, explicit auth flow.
