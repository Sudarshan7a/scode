## S‑code

<div align="center">

**🚀 A collaborative, cloud-based coding platform for interview preparation and social coding**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)](https://typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-green?logo=mongodb)](https://mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[🌐 Live Demo](https://scode-app.vercel.app) • [📖 Documentation](#getting-started) • [🐛 Report Bug](https://github.com/Sudarshan7a/scode/issues) • [💡 Request Feature](https://github.com/Sudarshan7a/scode/issues)

</div>

---

## 📋 Table of Contents

- [About](#about)
- [Features](#features-mvp)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Collaborative Editor](#collaborative-editor)
- [Authentication](#auth-flows)
- [Roadmap](#roadmap)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)
- [Contributing](#support--contributing)

---

## 🎯 About

S‑code is a collaborative, cloud-based coding platform built with Next.js that blends real-time interview preparation with social coding to make learning more engaging and less isolating. It offers a secure, streamlined authentication system, role-based room access, and a scalable architecture for collaborative code editing.

### Core Vision

**Code with friends. Learn faster. Ace interviews.**

S‑code makes coding practice feel like multiplayer gaming — secure, fast, and frustration-free. Whether you're preparing for technical interviews, practicing algorithms, or collaborating on projects, S‑code provides the tools you need to succeed together.

## Tech stack

**Frontend & Framework**

- [Next.js 15](https://nextjs.org/) + TypeScript (App Router)
- [React 19](https://react.dev/) with modern hooks
- [Tailwind CSS](https://tailwindcss.com/) + [Radix UI](https://radix-ui.com/) for styling
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) for code editing

**Backend & Database**

- [MongoDB](https://mongodb.com/) with Node.js driver (centralized connection)
- [Upstash Redis](https://upstash.com/) for caching, rate limiting, and token storage
- RESTful API design with Next.js API routes

**Real-time Collaboration**

- [Y.js](https://docs.yjs.dev/) for Conflict-free Replicated Data Types (CRDTs)
- WebSocket server for real-time document synchronization
- [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) for offline persistence

**Authentication & Security**

- [bcrypt](https://github.com/kelektiv/node.bcrypt.js) for password hashing
- [jose](https://github.com/panva/jose) for JWT token management
- HttpOnly cookies for secure token storage
- [Zod](https://zod.dev/) + [react-hook-form](https://react-hook-form.com/) for validation

**Email & Communication**

- [Resend](https://resend.com/) for transactional emails
- Email verification system with Redis-backed tokens

**Development Tools**

- [ESLint](https://eslint.org/) for code linting
- [TypeScript](https://typescriptlang.org/) for type safety
- [pnpm](https://pnpm.io/) for efficient package management

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

### 🔐 Authentication System

- **Secure Registration**: Email/password signup with domain restrictions
- **Email Verification**: Short-lived tokens stored in Redis for verification
- **Session Management**: HttpOnly refresh tokens with automatic rotation
- **Protected Routes**: Middleware-based route protection
- **Rate Limiting**: Brute-force attack prevention
- **Password Security**: Strong bcrypt hashing

### 👥 Collaborative Code Editor

- **Real-time Synchronization**: Y.js CRDTs for conflict-free collaboration
- **Multi-language Support**: JavaScript, TypeScript, Python, Go, Java, C, C++
- **Monaco Editor**: Full-featured code editor with syntax highlighting
- **Offline Persistence**: IndexedDB storage for working offline
- **WebSocket Integration**: Seamless real-time updates
- **Auto-save**: Continuous document synchronization

### 🏠 Room Management

- **Room Creation**: Schedule and create coding sessions
- **Room Types**: Interview prep, mock interviews, pair programming
- **Privacy Controls**: Public and private room options
- **Join System**: Easy room joining with validation
- **Host Controls**: Manage participants and session settings

### 📊 Dashboard Interface

- **Session Overview**: Track your coding activities
- **Room Management**: Create, schedule, and join rooms
- **User Profile**: Manage account settings and preferences
- **Activity Tracking**: Monitor your coding progress
- **Quick Access**: Easy navigation to recent rooms

### ⚙️ Developer Features

- **Type Safety**: Full TypeScript implementation
- **Form Validation**: Zod schemas with react-hook-form
- **Error Handling**: Comprehensive error management
- **API Design**: RESTful API with predictable responses
- **Responsive Design**: Mobile-friendly interface

## Roadmap

### ✅ Recently Completed

- Real-time collaborative code rooms (Monaco + Y.js)
- Multi-language support (JavaScript, TypeScript, Python, Go, Java, C, C++)
- Room creation and management system
- Registration form refactoring with modular components
- Secure authentication system with email verification
- Dashboard interface with session tracking
- Explore page for discovering public coding sessions
- Error boundary implementation for improved reliability
- Comprehensive development documentation and Git workflow guides

### 🚧 In Progress

- OAuth integrations (GitHub, Google) - UI components ready, API integration pending
- Room roles & permissions system
- Enhanced UI/UX improvements
- Performance optimizations

### 📋 Planned Features

- **Authentication Enhancements**
  - Complete OAuth integrations (GitHub, Google, Discord)
  - Multi-factor authentication (TOTP)
  - Device-based trust and session management
- **Collaboration Features**
  - Voice/video integration for interviews
  - Screen sharing capabilities
  - Real-time chat system
  - Code review and commenting
- **Room Management**
  - Advanced room templates
  - Automated interview scheduling
  - Recording and playback
  - Custom coding challenges
- **Developer Experience**
  - Docker containerization
  - CI/CD pipeline setup
  - Mobile responsive design
  - PWA capabilities
- **Analytics & Insights**
  - Coding session analytics
  - Performance metrics
  - Learning progress tracking
  - Interview feedback system

## Getting started

### Prerequisites

- Node.js 18+ (tested with Node.js 20)
- pnpm (recommended) or npm
- MongoDB database (local or cloud)
- Redis instance (Upstash recommended)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/Sudarshan7a/scode.git
cd scode
```

2. **Install dependencies**

```bash
# Using pnpm (recommended)
pnpm install

# Or using npm (with legacy peer deps for compatibility)
npm install --legacy-peer-deps
```

3. **Configure environment**

Create `.env.local` in the root directory:

```dotenv
# Optional public API URL
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Database
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority
MONGODB_DB=scode

# Authentication
JWT_SECRET=your-super-secure-jwt-secret-here

# Upstash Redis (used by rate limiter & verify tokens)
UPSTASH_REDIS_REST_URL=your-upstash-redis-rest-url-here
UPSTASH_REDIS_REST_TOKEN=your-upstash-redis-rest-token-here

# Email Service
RESEND_API_KEY=your-resend-api-key-here
MY_DOMAIN=http://localhost:3000
```

4. **Start the WebSocket server** (for real-time collaboration)

```bash
cd websocket
pnpm install
npx y-websocket
```

5. **Run the development server**

```bash
# In the root directory
pnpm dev
```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Quick Setup with Docker (Coming Soon)

```bash
docker-compose up -d
```

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

**Installation Issues**

- Dependency conflicts with `react-day-picker`
  - Use `npm install --legacy-peer-deps` instead of regular npm install
  - Or use `pnpm install` which handles peer dependencies better
- Node.js version compatibility
  - Ensure you're using Node.js 18+ (tested with Node.js 20)
  - Check version with `node --version`
- WebSocket server fails to start
  - Navigate to `websocket/` directory first: `cd websocket`
  - Install WebSocket dependencies: `npm install` or `pnpm install`
  - Start server: `npx y-websocket`

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

- Room connection fails
  - Ensure WebSocket server is running: `cd websocket && npx y-websocket`
  - Check if port 1234 is available
  - Verify network connectivity
- Unable to join room
  - Check room ID is correct
  - Ensure room exists and is accessible
  - Try refreshing the page
- Performance issues in large rooms
  - Close unnecessary browser tabs
  - Check browser DevTools for memory usage
  - Consider limiting concurrent users per room

## Git Repository Hygiene Audit

This repository includes a comprehensive Git audit system to help developers learn best practices:

```bash
# Run comprehensive audit
npm run audit:git

# Run specific audits
npm run audit:commits    # Analyze commit patterns
npm run audit:branches   # Check branch strategy
npm run audit:secrets    # Scan for leaked secrets
```

### Features

- **Commit Quality Analysis** - Message clarity, frequency, and atomicity
- **Branch Strategy Review** - Naming conventions and workflow
- **Secret Detection** - Prevent accidentally committed credentials
- **Educational Resources** - Learn Git best practices step by step
- **Progress Tracking** - JSON reports and scoring system

See `git-audit/README.md` for full documentation and `git-audit/educational/learning-path.md` for a beginner-friendly improvement guide.

## Commit history helper (optional)

See `realistic-commit-plan.md` for a batch script that stages and backdates a realistic series of commits across the past weeks.

## 📊 Git Best Practices & Learning Tools

This repository includes comprehensive tools to help beginners learn Git best practices and avoid common mistakes:

### 🔍 Quick Audit

```bash
# Run repository health check
npm run audit:repo

# Validate a commit message
npm run audit:commit "feat(auth): add user login validation"

# View all Git learning resources
npm run help:git
```

### 📚 Learning Resources

- **[Git Best Practices](docs/git-best-practices.md)** - Comprehensive guide with examples
- **[Learning Checklist](docs/learning-checklist.md)** - Progressive skill-building path
- **[Repository Scorecard](docs/repository-scorecard.md)** - Self-assessment tool
- **[Development Setup](docs/development-setup.md)** - Tool configuration guide
- **[Git Examples](docs/git-examples.md)** - Before/after examples of common mistakes

### 🛠️ Available Tools

- `scripts/git-audit.sh` - Comprehensive repository health check
- `scripts/validate-commit.js` - Commit message validation
- Scoring system for repository hygiene
- Educational examples and templates

**Perfect for beginners** who want to learn professional Git workflows and avoid common pitfalls!

---

Made with Next.js App Router, MongoDB, and a secure, explicit auth flow.

## 📞 Support & Contributing

### 🤝 Contributing

We welcome contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting PRs.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Commit using conventional commits: `git commit -m "feat: add amazing feature"`
5. Push to your branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### 🐛 Bug Reports

Found a bug? Please [open an issue](https://github.com/Sudarshan7a/scode/issues) with:

- Steps to reproduce
- Expected vs actual behavior
- Browser/OS information
- Console errors (if any)

### 💡 Feature Requests

Have an idea? We'd love to hear it! Open a [feature request](https://github.com/Sudarshan7a/scode/issues) with:

- Use case description
- Proposed solution
- Alternative solutions considered

### 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### 🙏 Acknowledgments

- [Monaco Editor](https://microsoft.github.io/monaco-editor/) for the excellent code editor
- [Y.js](https://docs.yjs.dev/) for real-time collaboration
- [Next.js](https://nextjs.org/) for the amazing React framework
- [Radix UI](https://radix-ui.com/) for accessible UI components

---

**⭐ Star this repository if you find it helpful!**
