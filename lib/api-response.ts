import { NextResponse } from 'next/server';
import { z } from 'zod';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  details?: z.ZodIssue[];
}

export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json<ApiResponse<T>>(
    { success: true, data },
    { status }
  );
}

export function errorResponse(
  message: string,
  status = 500,
  details?: z.ZodIssue[]
) {
  return NextResponse.json<ApiResponse>(
    { success: false, error: message, details },
    { status }
  );
}

export function validationError(issues: z.ZodIssue[]) {
  return errorResponse('Validation failed', 400, issues);
}

export function notFoundError(resource = 'Resource') {
  return errorResponse(`${resource} not found`, 404);
}

export function unauthorizedError(message = 'Unauthorized') {
  return errorResponse(message, 401);
}

export function forbiddenError(message = 'Forbidden') {
  return errorResponse(message, 403);
}

export function serverError(message = 'Internal server error') {
  return errorResponse(message, 500);
}

export function validateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; response: NextResponse } {
  const result = schema.safeParse(data);
  if (!result.success) {
    return {
      success: false,
      response: validationError(result.error.issues),
    };
  }
  return { success: true, data: result.data };
}
