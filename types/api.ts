/**
 * API Response Types
 * 
 * This file demonstrates how to create consistent, type-safe API responses
 * that help prevent common beginner mistakes in API design.
 */

/**
 * Base API response structure
 * All API responses should follow this pattern for consistency
 */
export interface BaseApiResponse {
  ok: boolean;
  message: string;
}

/**
 * API response with data payload
 */
export interface ApiResponseWithData<T = any> extends BaseApiResponse {
  data: T;
}

/**
 * API error response with optional field errors
 */
export interface ApiErrorResponse extends BaseApiResponse {
  ok: false;
  fieldErrors?: Record<string, string>;
  code?: string;
}

/**
 * Auth-specific API responses
 */
export interface AuthApiResponse extends BaseApiResponse {
  redirect?: string;
  fieldErrors?: Record<string, string>;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

/**
 * Login API response
 */
export interface LoginApiResponse extends AuthApiResponse {
  accessToken?: string;
}

/**
 * Signup API response  
 */
export interface SignupApiResponse extends AuthApiResponse {
  requiresVerification?: boolean;
}

/**
 * Room-related API responses
 */
export interface RoomApiResponse extends BaseApiResponse {
  room?: {
    id: string;
    title: string;
    ownerId: string;
    isPrivate: boolean;
    inviteCode?: string;
  };
}

export interface RoomListApiResponse extends BaseApiResponse {
  rooms: Array<{
    id: string;
    title: string;
    description?: string;
    language?: string;
    status: "live" | "scheduled" | "ended";
    participants: number;
    maxParticipants: number;
    scheduledAt?: string;
  }>;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
  };
}

/**
 * Type-safe API response creators
 * These help ensure consistent response structure
 */

export function createSuccessResponse<T = undefined>(
  message: string,
  data?: T
): T extends undefined ? BaseApiResponse : ApiResponseWithData<T> {
  const response: any = {
    ok: true,
    message,
  };
  
  if (data !== undefined) {
    response.data = data;
  }
  
  return response;
}

export function createErrorResponse(
  message: string,
  fieldErrors?: Record<string, string>,
  code?: string
): ApiErrorResponse {
  return {
    ok: false,
    message,
    fieldErrors,
    code,
  };
}

export function createAuthResponse(
  success: boolean,
  message: string,
  options: {
    user?: AuthApiResponse['user'];
    redirect?: string;
    fieldErrors?: Record<string, string>;
    accessToken?: string;
  } = {}
): AuthApiResponse {
  return {
    ok: success,
    message,
    redirect: options.redirect,
    fieldErrors: options.fieldErrors,
    user: options.user,
    ...(options.accessToken && { accessToken: options.accessToken }),
  };
}

/**
 * Type guards for API responses
 * These help with type narrowing in client code
 */

export function isSuccessResponse(
  response: BaseApiResponse
): response is BaseApiResponse & { ok: true } {
  return response.ok === true;
}

export function isErrorResponse(
  response: BaseApiResponse
): response is ApiErrorResponse {
  return response.ok === false;
}

export function hasFieldErrors(
  response: BaseApiResponse
): response is BaseApiResponse & { fieldErrors: Record<string, string> } {
  return 'fieldErrors' in response && response.fieldErrors !== undefined;
}

/**
 * HTTP Status Code constants
 * Use these instead of magic numbers
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  VALIDATION_ERROR: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export type HttpStatusCode = typeof HTTP_STATUS[keyof typeof HTTP_STATUS];

/**
 * Example usage in API routes:
 * 
 * ❌ Bad:
 * return NextResponse.json({ success: true, data: user }); // Inconsistent structure
 * 
 * ✅ Good:
 * return NextResponse.json(
 *   createSuccessResponse("User created successfully", user),
 *   { status: HTTP_STATUS.CREATED }
 * );
 * 
 * ❌ Bad:
 * return NextResponse.json({ error: "Invalid email" }, { status: 400 });
 * 
 * ✅ Good:
 * return NextResponse.json(
 *   createErrorResponse("Invalid email", { email: "Email format is invalid" }),
 *   { status: HTTP_STATUS.BAD_REQUEST }
 * );
 */