# GitHub Copilot Instructions for S‑code

## Project Overview

S‑code is a collaborative, cloud-based coding platform built with Next.js 15 that enables real-time interview preparation and social coding. The platform features secure authentication, real-time collaborative editing with Y.js CRDTs, multi-language code execution, AI-powered coding assistance, and comprehensive room management.

### Project Scale & Metrics
- **Components**: 147 React components (.tsx files)
- **Pages**: 27 Next.js pages
- **API Routes**: ~2,643 lines across multiple endpoints
- **Custom Hooks**: 8 specialized hooks for state management
- **Contexts**: 2 React contexts (Editor, Explore)
- **Type Definitions**: Comprehensive TypeScript with strict mode enabled

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
├── api/               # API routes (~2,643 lines)
│   ├── auth/         # Authentication endpoints (signup, login, verify, logout)
│   │   ├── signup/   # Modular signup with service layer and types
│   │   ├── login/    # Login with refresh token issuance
│   │   ├── verify/   # Email verification
│   │   ├── logout/   # Session termination
│   │   ├── forgot-password/ # Password reset flow
│   │   ├── reset-password/  # Password reset execution
│   │   ├── me/       # Get current user
│   │   └── verify-refresh-token/ # Token validation
│   ├── user/         # User management endpoints
│   │   ├── profile/  # Get/update user profile
│   │   ├── update-profile/ # Profile updates
│   │   ├── change-email/   # Email change initiation
│   │   └── verify-email-change/ # Email change verification
│   ├── rooms/        # Room management (create, join, list)
│   ├── dashboard/    # Dashboard data aggregation
│   ├── code-execute/ # Code execution engine
│   ├── ai/           # AI chat integration (Gemini)
│   └── video/        # Video call token generation
├── dashboard/         # User dashboard
│   ├── page.tsx      # Main dashboard overview
│   ├── my-sessions/  # User's coding sessions
│   └── upcoming-rooms/ # Scheduled rooms
├── room/             # Collaborative coding rooms
│   ├── EditorContainer.tsx # Main editor wrapper
│   ├── [roomId]/    # Dynamic room pages
│   └── editorHelpers.ts # Editor utilities
├── profile/          # User profile management
├── explore/          # Public room discovery
├── login/            # Login page
├── signup/           # Registration page
├── verify-email/     # Email verification pages
├── forgot-password/  # Password reset request
├── reset-password/   # Password reset form
├── how-it-works/     # Platform documentation
└── test-error-boundaries/ # Error handling tests

lib/                    # Core utilities and helpers (17 files)
├── mongodb.ts        # Centralized MongoDB connection (camelCase collections)
├── redis.ts          # Upstash Redis client configuration
├── notesDB.ts        # IndexedDB for offline notes storage
├── refreshSession.ts # JWT refresh token management
├── userCache.ts      # Client-side user data caching (1-hour TTL)
├── authMiddleware.ts # Server-side auth validation
├── authTokenStore.ts # Token storage utilities
├── rateLimiter.ts    # Rate limiting implementation
├── sendActionToken.ts # Email token dispatch
├── tokenUtils.ts     # JWT generation and validation
├── EmailTemplate.ts  # Email template renderer
├── getMongoData.ts   # MongoDB data fetching utilities
├── dateUtils.ts      # Date formatting and manipulation
├── axiosInstance.ts  # Configured Axios client
├── getIp.ts          # IP address extraction
├── utils.ts          # General utilities (cn for class names, etc.)
└── monaco/           # Monaco editor configuration
    └── monacoEnvironment.ts # Editor setup and worker config

types/                  # TypeScript definitions
├── mongodbTypes.ts   # Database schema types (User, Room, RefreshToken, etc.)
└── mogodbValidation.ts # Zod validation schemas & MongoDB validators

components/             # React components (147 .tsx files)
├── dashboard/        # Dashboard-specific components
│   ├── DashboardCard.tsx # Reusable dashboard cards
│   ├── SessionsList.tsx  # Session display
│   └── UpcomingRoomsList.tsx # Scheduled rooms
├── joinRoom/         # Room features
│   ├── MainContent.tsx    # Room layout
│   ├── BottomBar.tsx      # Room controls
│   ├── notes/        # Notes system (IndexedDB)
│   │   ├── NotesPage.tsx  # Main notes interface
│   │   ├── Note.tsx       # Individual note component
│   │   └── pagesPanel.tsx # Page navigation
│   ├── gemmini/      # AI chat integration
│   │   ├── AiChat.tsx     # Main chat component
│   │   ├── ChatMessages.tsx # Message list
│   │   ├── ChatMessage.tsx  # Single message
│   │   ├── ChatInput.tsx    # Message input
│   │   ├── ChatHeader.tsx   # Chat header
│   │   └── TypingIndicator.tsx # Typing animation
│   └── call/         # Video call integration
│       └── call.tsx  # Call component
├── custom/           # Custom reusable components
│   └── schedule/     # Modular form components
│       ├── dialogs/  # Form dialogs
│       ├── fields/   # Reusable form fields
│       ├── forms/    # Complete form components
│       └── schemas/  # Validation schemas
├── ui/               # Radix UI components (shadcn/ui)
│   ├── button.tsx    # Button component
│   ├── input.tsx     # Input component
│   ├── dialog.tsx    # Dialog component
│   ├── select.tsx    # Select component
│   ├── checkbox.tsx  # Checkbox component
│   └── ...           # Other UI primitives
├── auth/             # Authentication components
├── profile/          # Profile components
├── room/             # Room components
├── landing/          # Landing page components
├── ErrorBoundary.tsx # Error boundary implementation
├── AsyncErrorBoundary.tsx # Async error handling
├── Navbar.tsx        # Navigation bar
├── Footer.tsx        # Footer component
├── UserAvatar.tsx    # User avatar display
└── ThemeProvider.tsx # Dark/light theme management

hooks/                  # Custom React hooks (8 files)
├── useUser.ts        # User data and authentication state
├── useRooms.ts       # Room listing with caching (1-hour TTL)
├── useRoomOperations.ts # Room CRUD operations
├── useAIChat.ts      # AI chat state management
├── useToast.ts       # Toast notification management
├── useLoading.ts     # Loading state management
├── useErrorHandler.ts # Error handling utilities
└── useLayoutVisibility.ts # Layout visibility control

contexts/               # React contexts (2 files)
├── EditorContext.tsx # Monaco editor state and actions
└── ExploreContext.tsx # Room exploration state

constants/              # Application constants
└── links.ts          # Navigation, social, and support links

auth/                   # Authentication utilities
└── utils/            # Auth helper functions
    ├── verifyToken.ts         # Token verification
    ├── generateRefreshToken.ts # Refresh token generation
    └── generateAccessToken.ts  # Access token generation

websocket/              # Y.js WebSocket server (port 1234)
└── server.js         # Real-time collaboration server

public/                 # Static assets
├── avatars/          # User avatar images
└── ...               # Other static files
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

### User Schema
```typescript
interface User {
  _id?: ObjectId;
  name: string;              // Letters only, no spaces
  email: string;             // Restricted domains (see allowedEmailDomains)
  passwordHash: string;      // bcrypt hashed
  role: "user" | "admin";
  emailVerified: boolean;
  avatarUrl?: string;
  avatarId?: number;         // 1-20 for avatar selection
  pronouns?: string;
  dateOfBirth?: string;
  oauth?: OAuthProvider;     // Google/GitHub OAuth (future)
  pendingEmail?: {           // Email change in progress
    newEmail: string;
    verificationToken: string;
    tokenExpiry: Date;
  };
  createdAt?: Date;
}
```

### Room Schema
```typescript
interface Room {
  _id?: ObjectId;
  hostId: ObjectId;          // User who created the room
  title: string;
  description?: string;
  roomType: "interview" | "mock_interview" | "pair_programming";
  privacy: "public" | "private";
  scheduledAt?: Date;
  collaborators: Collaborator[]; // Users with roles
  status: "scheduled" | "active" | "completed" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}
```

### Validation
- All collections have MongoDB validators (see `types/mogodbValidation.ts`)
- User names must be letters-only (A-Z)
- Email domains must be in `allowedEmailDomains`
- Use Zod schemas for runtime validation

## API Endpoints

### Authentication API (`/api/auth/*`)

#### POST `/api/auth/signup`
- **Purpose**: Create new user account
- **Body**: `{ name, email, password }`
- **Validation**: Zod schema, domain whitelist
- **Response**: User created, verification email sent
- **Rate Limited**: Yes (prevents brute force)
- **Implementation**: Modular with `service.ts`, `types.ts`, `messages.ts`

#### POST `/api/auth/login`
- **Purpose**: Authenticate user and issue refresh token
- **Body**: `{ email, password }`
- **Response**: Sets HttpOnly `refreshToken` cookie
- **Security**: Validates emailVerified flag, rate limited
- **Token Rotation**: Issues new refresh token on each login

#### POST `/api/auth/logout`
- **Purpose**: Invalidate refresh token and clear cookies
- **Response**: Token removed from database, cookie cleared

#### GET `/api/auth/verify?token={token}`
- **Purpose**: Verify email address
- **Implementation**: Checks Redis token (10-min TTL), updates user
- **Auto-login**: Issues refresh token on successful verification

#### POST `/api/auth/verify-refresh-token`
- **Purpose**: Validate refresh token (used by middleware)
- **Body**: `{ refreshToken }`
- **Response**: Token validity and expiration status

#### GET `/api/auth/me`
- **Purpose**: Get current authenticated user
- **Authorization**: Requires valid refresh token
- **Response**: User object without sensitive data

#### POST `/api/auth/forgot-password`
- **Purpose**: Initiate password reset flow
- **Body**: `{ email }`
- **Implementation**: Sends reset token via email (Redis, 10-min TTL)

#### POST `/api/auth/reset-password`
- **Purpose**: Complete password reset
- **Body**: `{ token, newPassword }`
- **Security**: Validates token, hashes new password with bcrypt

### User API (`/api/user/*`)

#### GET `/api/user/profile`
- **Purpose**: Get detailed user profile
- **Authorization**: Required
- **Response**: Full user object including avatar, pronouns

#### POST `/api/user/update-profile`
- **Purpose**: Update user profile fields
- **Body**: `{ name?, pronouns?, dateOfBirth?, avatarId? }`
- **Validation**: Name must be letters-only, avatarId 1-20

#### POST `/api/user/change-email`
- **Purpose**: Initiate email change process
- **Body**: `{ newEmail }`
- **Implementation**: Sends verification to new email, stores in pendingEmail

#### GET `/api/user/verify-email-change?token={token}`
- **Purpose**: Complete email change
- **Security**: Validates token, updates email, clears pendingEmail

### Room API (`/api/rooms/*`)

#### GET `/api/rooms`
- **Purpose**: List all rooms (with filters)
- **Query Params**: `status`, `privacy`, `roomType`
- **Response**: Array of room objects

#### POST `/api/rooms`
- **Purpose**: Create new coding room
- **Body**: `{ title, description, roomType, privacy, scheduledAt }`
- **Authorization**: Required
- **Response**: Created room with generated ID

#### POST `/api/rooms/join`
- **Purpose**: Join existing room
- **Body**: `{ roomId, role }`
- **Implementation**: Adds user to collaborators array

### Dashboard API (`/api/dashboard/*`)

#### GET `/api/dashboard/get-data`
- **Purpose**: Aggregate dashboard data
- **Authorization**: Required
- **Response**: User sessions, upcoming rooms, statistics

### AI API (`/api/ai/*`)

#### POST `/api/ai/chat`
- **Purpose**: Send message to Gemini AI assistant
- **Body**: `{ message, code?, language? }`
- **Implementation**: Context-aware code analysis
- **Features**: Retry logic with exponential backoff
- **Rate Limited**: Message length limits

### Code Execution API

#### POST `/api/code-execute`
- **Purpose**: Execute code in supported languages
- **Body**: `{ code, language }`
- **Supported**: JavaScript, TypeScript, Python, Go, Java, C, C++
- **Response**: Execution output or error messages

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

## Custom Hooks

### useUser
- **Purpose**: Manage user authentication state
- **Features**: 
  - Fetches current user from `/api/auth/me`
  - Caches user data in localStorage (1-hour TTL via UserCache)
  - Provides loading and error states
  - Auto-refreshes on cache expiry
- **Usage**: `const { user, loading, error, refetch } = useUser()`

### useRooms
- **Purpose**: Fetch and cache room listings
- **Features**:
  - Fetches from `/api/rooms`
  - 1-hour cache duration
  - Filters by status, privacy, roomType
  - Provides refetch mechanism
- **Usage**: `const { rooms, loading, error, refetch } = useRooms(filters?)`

### useRoomOperations
- **Purpose**: CRUD operations for rooms
- **Features**:
  - Create new rooms
  - Join existing rooms
  - Leave rooms
  - Delete rooms (host only)
  - Toast notifications for all operations
- **Usage**: `const { createRoom, joinRoom, leaveRoom, deleteRoom } = useRoomOperations()`

### useAIChat
- **Purpose**: Manage AI chat state
- **Features**:
  - Send messages to Gemini API
  - Maintain conversation history
  - Handle streaming responses
  - Retry logic for failed requests
  - Code context injection
- **Usage**: `const { messages, sendMessage, loading } = useAIChat()`

### useToast
- **Purpose**: Display toast notifications
- **Features**:
  - Success, error, warning, info types
  - Auto-dismiss with configurable duration
  - Queue multiple toasts
- **Usage**: `const { toast } = useToast()`

### useLoading
- **Purpose**: Global loading state management
- **Features**:
  - Start/stop loading indicators
  - Multiple concurrent loading states
  - Automatic timeout protection
- **Usage**: `const { isLoading, startLoading, stopLoading } = useLoading()`

### useErrorHandler
- **Purpose**: Centralized error handling
- **Features**:
  - Parse API errors
  - Display user-friendly messages
  - Log errors for debugging
  - Retry failed requests
- **Usage**: `const { handleError, retry } = useErrorHandler()`

### useLayoutVisibility
- **Purpose**: Control UI layout visibility
- **Features**:
  - Toggle sidebar, navbar, footer
  - Persist preferences in localStorage
  - Responsive breakpoint handling
- **Usage**: `const { showSidebar, toggleSidebar } = useLayoutVisibility()`

## React Contexts

### EditorContext
- **Purpose**: Manage Monaco editor state across components
- **State**:
  - Current language
  - Editor instance
  - Code content
  - Cursor position
  - Editor settings (theme, font size)
- **Actions**:
  - Change language
  - Update code
  - Format code
  - Apply editor settings

### ExploreContext
- **Purpose**: Manage room exploration and filtering state
- **State**:
  - Search query
  - Active filters (roomType, privacy)
  - Sort order
  - Pagination state
- **Actions**:
  - Update filters
  - Clear filters
  - Set sort order
  - Navigate pages

## Utility Libraries

### lib/userCache.ts
- **Purpose**: Client-side user data caching
- **Security**: Only non-sensitive data (name, email, avatarId, pronouns)
- **Duration**: 1 hour (60 * 60 * 1000 ms)
- **Methods**:
  - `get()`: Retrieve cached user data
  - `set(userData)`: Store user data with timestamp
  - `clear()`: Remove cached data
  - `isValid()`: Check if cache is fresh

### lib/rateLimiter.ts
- **Purpose**: Rate limiting for API endpoints
- **Implementation**: Upstash Redis with sliding window
- **Configuration**:
  - Auth endpoints: 5 requests per 15 minutes
  - AI chat: 20 requests per hour
  - General API: 100 requests per hour
- **Response**: Returns 429 Too Many Requests when exceeded

### lib/authTokenStore.ts
- **Purpose**: Manage JWT tokens
- **Security**: Refresh tokens in HttpOnly cookies only
- **Methods**:
  - `storeRefreshToken()`: Set HttpOnly cookie
  - `getRefreshToken()`: Read from request
  - `clearTokens()`: Remove all tokens

### lib/dateUtils.ts
- **Purpose**: Date formatting and manipulation
- **Functions**:
  - `formatDate(date)`: User-friendly date strings
  - `isUpcoming(date)`: Check if date is in future
  - `getRelativeTime(date)`: "2 hours ago" style strings

### lib/utils.ts
- **Purpose**: General utility functions
- **Key Functions**:
  - `cn(...classes)`: Merge Tailwind classes with clsx and tailwind-merge
  - `validateEmail(email)`: Email format validation
  - `generateRoomId()`: Unique room identifier generation

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
- **Components**:
  - `NotesPage.tsx`: Main notes interface with tabs
  - `Note.tsx`: Individual note editor with character counter
  - `pagesPanel.tsx`: Page navigation and management
- **Operations**:
  - Create: `createNote(roomId, pageNumber, content, title)`
  - Read: `getNote(roomId, pageNumber)`
  - Update: `updateNote(roomId, pageNumber, updates)`
  - Delete: `deleteNote(roomId, pageNumber)`
  - List: `getAllNotesForRoom(roomId)`

## Middleware Protection

### Authentication Middleware (`middleware.ts`)
- **Purpose**: Protect routes requiring authentication
- **Protected Routes**:
  - `/dashboard/*` - User dashboard and sub-pages
  - `/profile/*` - User profile and settings
  - `/room/*` - Collaborative coding rooms
- **Flow**:
  1. Extract `refreshToken` from HttpOnly cookie
  2. Validate token via `/api/auth/verify-refresh-token`
  3. Check token expiration
  4. Redirect to `/login` if invalid
  5. Allow request to proceed if valid
- **Performance**: Server-side validation, no client-side token exposure

## Error Handling

### Error Boundaries
- **ErrorBoundary.tsx**: Catches React component errors
  - Displays user-friendly error message
  - Provides "Try Again" and "Go Home" actions
  - Logs error details (non-production)
- **AsyncErrorBoundary.tsx**: Handles async operation errors
  - Catches promise rejections
  - Retry mechanism with exponential backoff
  - Fallback UI during error state

### API Error Handling Pattern
```typescript
try {
  const response = await fetch('/api/endpoint', { ... });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Request failed');
  }
  const data = await response.json();
  return data;
} catch (error) {
  console.error('API Error:', error);
  toast({ 
    title: 'Error', 
    description: error.message,
    variant: 'destructive'
  });
  throw error;
}
```

## Component Patterns

### Form Components (in `components/custom/schedule/`)
- **Structure**:
  - `schemas/`: Zod validation schemas
  - `fields/`: Reusable form field components
  - `forms/`: Complete form assemblies
  - `dialogs/`: Modal form wrappers
- **Pattern**: React Hook Form + Zod resolvers
- **Example**:
  ```typescript
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { ... }
  });
  ```

### Dashboard Cards
- **Component**: `DashboardCard.tsx`
- **Props**: `{ title, icon, value, subtitle, action? }`
- **Features**:
  - Responsive grid layout
  - Loading skeleton state
  - Click action handlers
  - Icon support (lucide-react)

### Avatar System
- **Component**: `UserAvatar.tsx`
- **Features**:
  - Fallback to initials if no avatar
  - 20 pre-defined avatar options (avatarId 1-20)
  - Radix UI Avatar primitive
  - Size variants: sm, md, lg, xl

## Security Implementation

### Password Security
- **Hashing**: bcrypt with 10 salt rounds
- **Validation**: Minimum 8 characters, complexity requirements
- **Storage**: Never log or expose password hashes
- **Reset Flow**: Time-limited tokens (10 minutes) in Redis

### Token Security
- **Refresh Tokens**:
  - Stored in MongoDB with expiration
  - HttpOnly cookies (not accessible via JavaScript)
  - Rotated on each login
  - Single-use pattern (invalidated after use)
- **Access Tokens**:
  - Short-lived JWT (15 minutes)
  - Generated on-demand from refresh token
  - Contains userId, email, role
  - Never stored in localStorage

### Email Verification
- **Implementation**:
  - Unique tokens stored in Redis
  - 10-minute TTL (Time To Live)
  - One-time use (deleted after verification)
  - Cryptographically secure token generation

### Rate Limiting
- **Upstash Redis**: Sliding window algorithm
- **Limits**:
  - Login/Signup: 5 attempts per 15 minutes per IP
  - Password Reset: 3 attempts per hour per email
  - AI Chat: 20 messages per hour per user
  - General API: 100 requests per hour per user
- **Response**: 429 status with Retry-After header

### Input Validation
- **Server-Side**: All inputs validated with Zod schemas
- **Client-Side**: Form validation with react-hook-form
- **Sanitization**: Email normalization, string trimming
- **MongoDB Validators**: Schema-level validation in database

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

## Testing Strategy

### Current Test Infrastructure
- **Vitest**: Test runner configuration in `vitest.config.ts`
- **Error Boundary Tests**: `test-error-boundaries` page for manual testing
- **Component Testing**: Located in component directories

### Testing Patterns
```typescript
// API Route Test Pattern
import { describe, it, expect, beforeEach } from 'vitest';

describe('POST /api/auth/login', () => {
  it('should return 400 for invalid credentials', async () => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com', password: 'wrong' })
    });
    expect(response.status).toBe(400);
  });
});

// Hook Test Pattern
import { renderHook, waitFor } from '@testing-library/react';

describe('useUser', () => {
  it('should fetch user data', async () => {
    const { result } = renderHook(() => useUser());
    await waitFor(() => expect(result.current.user).toBeDefined());
  });
});
```

## Environment Variables

### Required Variables
```env
# Database
MONGODB_URI=mongodb+srv://...              # MongoDB connection string
MONGODB_DB=scode                            # Database name

# Authentication
JWT_SECRET=your-secret-key-min-32-chars    # JWT signing secret

# Redis (Upstash)
UPSTASH_REDIS_REST_URL=https://...         # Redis REST URL
UPSTASH_REDIS_REST_TOKEN=...               # Redis auth token

# Email (Resend)
RESEND_API_KEY=re_...                      # Resend API key
MY_DOMAIN=http://localhost:3000            # Base URL for emails

# AI (Optional)
GEMINI_API_KEY=...                         # Google Gemini API key
```

### Optional Variables
```env
# Public API URL (defaults to relative paths)
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# WebSocket Server (defaults to localhost:1234)
NEXT_PUBLIC_WS_URL=ws://localhost:1234
```

## Deployment

### Vercel Deployment (Recommended)
1. **Prerequisites**:
   - MongoDB Atlas cluster
   - Upstash Redis instance
   - Resend account with verified domain
   - Google Cloud account for Gemini API

2. **Environment Setup**:
   - Add all required env variables in Vercel dashboard
   - Set `MY_DOMAIN` to your Vercel deployment URL
   - Configure CORS in MongoDB Atlas

3. **WebSocket Server**:
   - Deploy separately on service supporting WebSocket
   - Options: Railway, Render, Fly.io
   - Update `NEXT_PUBLIC_WS_URL` to deployed WS URL

4. **Build Configuration**:
   - Next.js automatically optimizes for production
   - Static pages cached at edge
   - API routes deployed as serverless functions

### Docker Deployment (Future)
- Dockerfile configuration planned
- Docker Compose for local development with all services
- Container orchestration for production

## Performance Optimization

### Bundle Size Optimization
- **Dynamic Imports**: Heavy components loaded on-demand
  ```typescript
  const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
    ssr: false,
    loading: () => <EditorSkeleton />
  });
  ```
- **Code Splitting**: Automatic route-based splitting
- **Tree Shaking**: Unused code eliminated in production

### Caching Strategy
- **User Data**: 1-hour localStorage cache
- **Room Listings**: 1-hour in-memory cache
- **Static Assets**: CDN cached with versioning
- **API Responses**: Cache-Control headers for GET requests

### Database Optimization
- **Indexes**: Created on frequently queried fields
  - `usersCollection`: `email` (unique), `emailVerified`
  - `roomsCollection`: `hostId`, `status`, `scheduledAt`
  - `refreshTokensCollection`: `userId`, `token` (unique), `expiresAt`
- **Projection**: Only fetch required fields
- **Aggregation**: Use pipelines for complex queries

### Image Optimization
- **Next.js Image**: Automatic optimization and lazy loading
- **Avatar Images**: Pre-optimized, small file sizes
- **Responsive Images**: Multiple sizes served based on viewport

## Accessibility (a11y)

### Implementation
- **Semantic HTML**: Proper heading hierarchy, landmarks
- **ARIA Labels**: Screen reader support for interactive elements
- **Keyboard Navigation**: Tab order, focus management
- **Color Contrast**: WCAG AA compliance
- **Focus Indicators**: Visible focus states

### Component Guidelines
- Use Radix UI primitives (built-in a11y)
- Add `aria-label` for icon-only buttons
- Provide `alt` text for images
- Use `role` attributes where appropriate
- Test with screen readers (NVDA, JAWS, VoiceOver)

## Contributing

When contributing to this project:
1. Follow existing code patterns and conventions
2. Maintain type safety and validation
3. Add tests for new features
4. Update documentation as needed
5. Use conventional commits
6. Keep changes focused and atomic

## Code Style Guide

### TypeScript Conventions
- **Strict Mode**: Enabled in `tsconfig.json`
- **Type Exports**: Export types from barrel files
- **Type Imports**: Use `import type { ... }` for type-only imports
- **No Any**: Avoid `any` type, use `unknown` with type guards
- **Interface vs Type**: Use `interface` for object shapes, `type` for unions/intersections

### Naming Conventions
- **Files**: 
  - Components: `PascalCase.tsx`
  - Utilities: `camelCase.ts`
  - Constants: `UPPER_SNAKE_CASE.ts`
- **Variables**:
  - Components: `PascalCase`
  - Functions: `camelCase`
  - Constants: `UPPER_SNAKE_CASE`
  - Private: `_privateVariable` (prefix with underscore)
- **Database**:
  - Collections: `camelCase` (e.g., `usersCollection`)
  - Fields: `camelCase` (e.g., `emailVerified`)

### Component Structure
```typescript
// 1. Imports (external, internal, types, styles)
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import type { User } from '@/types/mongodbTypes';

// 2. Type definitions
interface ComponentProps {
  user: User;
  onUpdate: (user: User) => void;
}

// 3. Component
export function ComponentName({ user, onUpdate }: ComponentProps) {
  // 3a. Hooks (state, context, custom hooks)
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  // 3b. Derived state and memoization
  const fullName = useMemo(() => `${user.name}`, [user.name]);
  
  // 3c. Effects
  useEffect(() => {
    // Effect logic
  }, [dependencies]);
  
  // 3d. Event handlers
  const handleUpdate = useCallback(() => {
    // Handler logic
  }, [dependencies]);
  
  // 3e. Early returns (loading, error states)
  if (loading) return <LoadingSkeleton />;
  
  // 3f. Main render
  return (
    <div className="container">
      {/* JSX */}
    </div>
  );
}
```

### API Route Structure
```typescript
// app/api/endpoint/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { rateLimiter } from '@/lib/rateLimiter';
import { getMongoDb } from '@/lib/mongodb';

// 1. Request schema
const requestSchema = z.object({
  field: z.string().min(1).max(100),
});

// 2. Handler function
export async function POST(request: NextRequest) {
  try {
    // 2a. Rate limiting
    const rateLimitResult = await rateLimiter.limit(request);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }
    
    // 2b. Parse and validate request
    const body = await request.json();
    const validatedData = requestSchema.parse(body);
    
    // 2c. Database operations
    const db = await getMongoDb();
    const result = await db.collection.insertOne(validatedData);
    
    // 2d. Return response
    return NextResponse.json(
      { success: true, data: result },
      { status: 201 }
    );
    
  } catch (error) {
    // 2e. Error handling
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### CSS and Styling
- **Tailwind CSS**: Primary styling method
- **Class Merging**: Use `cn()` utility for conditional classes
  ```typescript
  <div className={cn(
    'base-classes',
    isActive && 'active-classes',
    className
  )} />
  ```
- **Responsive**: Mobile-first approach (`sm:`, `md:`, `lg:` prefixes)
- **Dark Mode**: Use `dark:` prefix for dark theme variants
- **Custom Styles**: Add to `globals.css` for app-wide styles

### Git Commit Conventions
- **Format**: `<type>(<scope>): <description>`
- **Types**:
  - `feat`: New feature
  - `fix`: Bug fix
  - `docs`: Documentation changes
  - `style`: Code style changes (formatting, no logic change)
  - `refactor`: Code refactoring
  - `perf`: Performance improvements
  - `test`: Adding or updating tests
  - `chore`: Maintenance tasks
- **Examples**:
  - `feat(auth): add OAuth login support`
  - `fix(rooms): resolve room join race condition`
  - `docs(readme): update installation instructions`

### Import Organization
```typescript
// 1. React and Next.js
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// 2. External libraries
import { z } from 'zod';
import { toast } from 'sonner';

// 3. Internal components
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/UserAvatar';

// 4. Utilities and helpers
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/dateUtils';

// 5. Types
import type { User } from '@/types/mongodbTypes';

// 6. Constants
import { CACHE_DURATION } from '@/constants/config';
```

## Development Tools

### Scripts
- `npm run dev`: Start development server (port 3000)
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint
- `npm run audit:repo`: Git repository health check
- `npm run audit:commit`: Validate commit message

### VSCode Extensions (Recommended)
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin (Volar)
- Error Lens
- GitLens
- MongoDB for VS Code

### Browser DevTools
- React Developer Tools
- Redux DevTools (if using Redux)
- Network tab for API debugging
- Application tab for localStorage/cookies inspection

## Common Pitfalls and Solutions

### Avoiding Infinite Loops
```typescript
// ❌ Bad: Missing dependency causes stale closure
useEffect(() => {
  fetchData(userId);
}, []);

// ✅ Good: Include all dependencies
useEffect(() => {
  fetchData(userId);
}, [userId, fetchData]);

// ✅ Better: Memoize function
const fetchData = useCallback(async (id: string) => {
  // fetch logic
}, []);

useEffect(() => {
  fetchData(userId);
}, [userId, fetchData]);
```

### Token Management
```typescript
// ❌ Bad: Storing tokens in localStorage
localStorage.setItem('accessToken', token);

// ✅ Good: Use HttpOnly cookies for refresh tokens
// Server-side: Set cookie in response
response.cookies.set('refreshToken', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
});

// ✅ Good: Request access token on-demand
const getAccessToken = async () => {
  const response = await fetch('/api/auth/get-access-token');
  const { accessToken } = await response.json();
  return accessToken;
};
```

### Race Conditions in Room Joins
```typescript
// ❌ Bad: No synchronization
async function joinRoom(roomId: string) {
  await addUserToRoom(roomId);
  await loadRoomData(roomId);
}

// ✅ Good: Use locking or optimistic updates
async function joinRoom(roomId: string) {
  const lockKey = `room:${roomId}:join`;
  await acquireLock(lockKey);
  try {
    await addUserToRoom(roomId);
    await loadRoomData(roomId);
  } finally {
    await releaseLock(lockKey);
  }
}
```

### Memory Leaks in Subscriptions
```typescript
// ❌ Bad: No cleanup
useEffect(() => {
  const subscription = websocket.subscribe(roomId, handleUpdate);
}, [roomId]);

// ✅ Good: Return cleanup function
useEffect(() => {
  const subscription = websocket.subscribe(roomId, handleUpdate);
  return () => subscription.unsubscribe();
}, [roomId, handleUpdate]);
```

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Y.js Documentation](https://docs.yjs.dev/)
- [Monaco Editor API](https://microsoft.github.io/monaco-editor/)
- [Radix UI](https://radix-ui.com/)
- [Zod](https://zod.dev/)

---

This is a learning-focused project emphasizing security, type safety, and modern web development practices. When suggesting code changes, prioritize maintainability, security, and user experience.
