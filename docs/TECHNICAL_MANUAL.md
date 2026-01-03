# Scode Technical Documentation

## 1. Overview

Scode is a collaborative, cloud-based coding platform designed for real-time interview preparation and social coding. It enables multiple users to edit code simultaneously in a shared environment, execute code in various languages, and manage coding sessions via "Rooms".

The project is built on a modern stack featuring **Next.js 15**, **React 19**, and **TypeScript**, leveraging **Y.js** for conflict-free replicated data types (CRDTs) to ensure seamless real-time collaboration.

### Key Capabilities

- **Real-time Collaboration:** Simultaneous editing with conflict resolution.
- **Multi-language Support:** JavaScript, Python, Go, Java, C, C++.
- **Code Execution:** Secure, sandboxed execution of user code.
- **Authentication:** Secure user management with email verification.
- **Resilience:** Offline support via IndexedDB and robust error handling.

## 2. Architecture

Scode employs a hybrid architecture combining server-side rendering (SSR) for performance and SEO with client-side real-time synchronization for the editor.

### High-Level Architecture

```ascii
+----------------+       +------------------+       +------------------+
|   Client A     |       |   Next.js Server |       |   Database Layer |
| (React/Monaco) |<----->|   (App Router)   |<----->| (MongoDB/Redis)  |
+-------+--------+       +--------+---------+       +------------------+
        |                         |
        | WebSocket (Y.js)        | REST API (Auth/Exec)
        v                         v
+-------+--------+       +------------------+
|   WebSocket    |       |  Execution API   |
|    Server      |       | (External/Judge0)|
+----------------+       +------------------+
```

### Core Components

1.  **Frontend Application (Next.js 15):**

    - Uses the **App Router** for routing and layouts.
    - **React Server Components (RSC)** for initial data fetching and shell rendering.
    - **Client Components** for interactive features (Editor, Dashboard).

2.  **Real-time Engine (Y.js):**

    - **CRDTs:** Uses `Y.Doc` and `Y.Text` to manage shared state.
    - **Synchronization:** `y-websocket` provider connects clients to a central WebSocket server.
    - **Persistence:** `y-indexeddb` caches updates locally for offline resilience.
    - **Binding:** `y-monaco` binds the Y.js state to the Monaco Editor instance.

3.  **Data Layer:**

    - **MongoDB:** Primary store for Users, Rooms, and persistent application state.
    - **Redis (Upstash):** High-performance store for rate limiting and ephemeral session data.

4.  **Code Execution:**
    - Offloads code execution to a secure, isolated external API (e.g., Judge0 via RapidAPI).
    - Server-side proxy (`/api/code-execute`) handles authentication and rate limiting.

## 3. Code Layout

The project follows a standard Next.js App Router structure, organized by feature and responsibility.

### Directory Structure Map

```
scode/
├── app/                    # Next.js App Router roots
│   ├── api/                # API Routes (Auth, Execution, Rooms)
│   ├── room/[id]/          # Room Page & Editor Container
│   ├── dashboard/          # User Dashboard
│   └── auth/               # Auth Pages (Login, Signup)
├── auth/                   # Auth Logic (Core, Next.js adapters)
├── components/             # React Components
│   ├── auth/               # Auth forms and UI
│   ├── room/               # Room-specific components
│   ├── ui/                 # Shared UI (likely Shadcn/Radix)
│   └── custom/             # Project-specific custom UI
├── contexts/               # React Contexts (EditorContext, etc.)
├── lib/                    # Utilities & Infrastructure
│   ├── mongodb.ts          # DB Connection
│   ├── redis.ts            # Redis Connection
│   ├── monaco/             # Monaco Editor setup
│   └── rateLimiter.ts      # Rate limiting logic
├── hooks/                  # Custom React Hooks
├── types/                  # TypeScript Definitions
└── docs/                   # Documentation
```

### Key Modules

| Module               | Path                           | Purpose                                                                |
| -------------------- | ------------------------------ | ---------------------------------------------------------------------- |
| **Editor Container** | `app/room/EditorContainer.tsx` | Manages the Monaco Editor lifecycle and Y.js binding.                  |
| **Editor Helpers**   | `app/room/editorHelpers.ts`    | Logic for initializing Monaco, loading languages, and setting up Y.js. |
| **API Routes**       | `app/api/`                     | Backend endpoints for non-realtime operations.                         |
| **DB Utils**         | `lib/mongodb.ts`               | MongoDB connection pooling and collection access.                      |
| **Auth Middleware**  | `middleware.ts`                | Protects routes and manages session tokens.                            |

## 4. Core Concepts

### Real-time Collaboration (Y.js)

The core of Scode's collaborative experience is built on **Y.js**, a high-performance CRDT library.

- **Shared Document (`Y.Doc`):** Each room corresponds to a unique `Y.Doc`.
- **Text Type (`Y.Text`):** The code content is stored in a `Y.Text` type named `"monaco"`.
- **Awareness:** User cursors and selections are shared via the Y.js Awareness protocol.
- **Providers:**
  - `WebsocketProvider`: Syncs state with the server and other clients.
  - `IndexeddbPersistence`: Persists state locally to `indexeddb` for offline support and faster load times.

### Editor Lifecycle

1.  **Initialization:** `EditorContainer` mounts and dynamically loads the Monaco Editor.
2.  **Connection:** `initializeEditor` creates a `Y.Doc` and connects to the WebSocket server.
3.  **Binding:** `MonacoBinding` (from `y-monaco`) attaches the `Y.Text` to the Monaco model.
4.  **Language Loading:** When a language is selected, the corresponding Monaco contribution (syntax highlighting, etc.) is dynamically imported to reduce initial bundle size.

### Code Execution Flow

1.  User clicks "Run".
2.  Client sends code and language to `/api/code-execute`.
3.  Server checks rate limits (Redis).
4.  Server forwards request to external Execution API (with secret keys).
5.  Result is returned to client and displayed in the output console.

### Error Handling

Scode implements a robust error handling strategy using React Error Boundaries to prevent app crashes and provide a graceful user experience.

- **Global Boundary:** Wraps the entire app in `app/layout.tsx` to catch unhandled errors.
- **Granular Boundaries:**
  - `ErrorBoundary.tsx`: Main class-based component with "Try Again" and "Go Home" recovery options.
  - `AsyncErrorBoundary.tsx`: Specialized wrapper for async operations (API calls), supporting retry logic.
- **Hook:** `useErrorHandler` provides consistent error logging and reporting.
- **Testing:** A dedicated test page `/test-error-boundaries` allows developers to verify error states.

## 5. Features

### Authentication & User Management

- **Stack:** Hybrid authentication supporting both OAuth (NextAuth.js v5) and custom JWT implementation.
- **OAuth Providers:** Google and GitHub sign-in via NextAuth.js
- **Custom Auth:** Email/password with JWT tokens using `jose`
- **Unified Middleware:** Single `withAuth` HOC and `getAuthUserId` helper for API routes
- **Flow:**
  - OAuth: Sign in via provider -> Session created -> MongoDB userId injected via JWT callback
  - Custom: Sign Up / Login -> Refresh token generated (crypto.randomBytes) -> Stored in HttpOnly Cookie
  - Middleware validates session (OAuth) or token (custom) on protected routes
- **Security Features:**
  - Cryptographically secure refresh tokens
  - Security headers (X-Frame-Options, X-Content-Type-Options, X-XSS-Protection)
  - User enumeration prevention (generic error messages)
  - Session invalidation on password reset
  - Profile data exposure limits for non-owners
- **Email Verification:** Uses `resend` to send verification codes.

### Dashboard

- Displays user's rooms and activity.
- Fetches data from MongoDB (`users` and `rooms` collections).

### Rate Limiting

- Implemented using `@upstash/ratelimit` and Redis.
- **Tiers:**
  - Per-minute limit (e.g., 20 requests).
  - Per-hour limit (e.g., 100 requests).
- Applied to sensitive endpoints like Code Execution and Auth.

## 6. Engineering Decisions

### Why Y.js over Operational Transformation (OT)?

- **Decentralized:** CRDTs do not require a central authority to resolve conflicts, simplifying the backend.
- **Offline-first:** Y.js supports offline editing and syncing upon reconnection out of the box.
- **Performance:** Y.js is highly optimized for text editing and handles large documents efficiently.

### Why Monaco Editor?

- **Industry Standard:** Powers VS Code, providing a familiar experience for developers.
- **Extensibility:** Rich API for language support, themes, and custom bindings.

### Why Next.js 15 (App Router)?

- **Server Components:** Reduces client-side JavaScript for static parts of the app (Dashboard, Landing).
- **API Routes:** Integrated backend simplifies deployment and type sharing.
- **Streaming:** Supports streaming UI updates for better perceived performance.

## 7. Lessons Learned

### Real-time Data Handling

- **Binary vs JSON:** Y.js communicates via binary messages. The WebSocket handler must distinguish between Y.js binary updates and custom JSON control messages (e.g., "room-ended").
- **Connection Resilience:** Handling disconnects gracefully is critical. We use `y-indexeddb` to ensure users don't lose work if the connection drops.

### Monaco Editor Integration

- **SSR Incompatibility:** Monaco Editor relies heavily on browser APIs (`window`, `document`). It must be loaded dynamically with `ssr: false` in Next.js to avoid hydration mismatches.
- **Worker Configuration:** Monaco requires web workers for syntax checking. We use a custom `monacoEnvironment` setup to load these workers correctly.

## 8. Setup Guide

### Prerequisites

- Node.js 18+
- MongoDB Instance
- Redis Instance (Upstash recommended)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Sudarshan7a/scode.git
    cd scode
    ```
2.  **Install dependencies:**
    ```bash
    npm install --legacy-peer-deps
    # or
    pnpm install
    ```
3.  **Environment Configuration:**
    Create a `.env.local` file with the following keys:
    ```env
    MONGODB_URI=...
    MONGODB_DB=...
    UPSTASH_REDIS_REST_URL=...
    UPSTASH_REDIS_REST_TOKEN=...
    NEXT_PUBLIC_MY_WEBSOCKET_DOMAIN=...
    CODE_EXECUTION_API_KEY=...
    RESEND_API_KEY=...
    ```
4.  **Run Development Server:**
    ```bash
    npm run dev
    ```

### Useful Scripts

| Command                 | Description                                  |
| ----------------------- | -------------------------------------------- |
| `npm run lint`          | Run ESLint to check for code quality issues. |
| `npm run audit:repo`    | Run a repository health audit script.        |
| `npm run audit:commits` | Analyze commit message quality.              |
| `npm run help:git`      | Show Git learning resources.                 |

## 9. Diagrams

### Rendering Flow

```ascii
User Request
    |
    v
Next.js Server (RSC)
    |--> Fetch Data (MongoDB)
    |--> Render Shell (Layout, Navbar)
    |
    v
Client Browser
    |--> Hydrate React
    |--> Mount EditorContainer
    |--> Dynamic Import (Monaco)
    |--> Connect WebSocket (Y.js)
```

### Event Capture (Typing)

```ascii
User Types 'A'
    |
    v
Monaco Editor (Model Change)
    |
    v
MonacoBinding (y-monaco)
    |
    v
Y.Text (Update)
    |
    v
Y.Doc (Transaction)
    |
    +---> IndexedDB (Persistence)
    |
    v
WebsocketProvider
    |
    v
WebSocket Server ---> Broadcast to other clients
```

## 10. Testing Strategy

### Unit Testing

- **Tool:** Vitest
- **Scope:** Utility functions (`lib/`), Hooks (`hooks/`), and isolated Components.
- **Command:** `npm run test`

### Integration Testing

- **Scope:** API Routes (`app/api/`) and Database interactions.
- **Focus:** Verifying auth flows, rate limiting, and DB queries.

### End-to-End (E2E) Testing

- **Tool:** (Recommended: Playwright/Cypress)
- **Scope:** Critical user flows (Sign up -> Create Room -> Edit Code).

## 11. Appendix

### Keyboard Shortcuts (Monaco Default)

| Key            | Action                 |
| -------------- | ---------------------- |
| `Ctrl + Space` | Trigger Suggestion     |
| `Ctrl + F`     | Find                   |
| `Alt + Click`  | Multi-cursor selection |
| `Ctrl + Z`     | Undo                   |
| `Ctrl + Y`     | Redo                   |

### Future Improvements

- **Video/Voice Chat:** WebRTC integration for full interview experience.
- **Git Integration:** Commit room history to GitHub.
- **Custom Themes:** Allow users to customize editor appearance.
