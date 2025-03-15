export enum ExceptionType {
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  INVALID_REQUEST = 'INVALID_REQUEST',
  USER_EXISTS = 'USER_EXISTS',
  AUTH_FAILURE = 'AUTH_FAILURE',
  INVALID_TOKEN = 'INVALID_TOKEN',
  UNAUTHORIZED = 'UNAUTHORIZED',
  NOT_FOUND = 'NOT_FOUND',
}

export const Exceptions: Record<ExceptionType, { status: number, message: string }> = {
  [ExceptionType.INTERNAL_ERROR]: { status: 500, message: 'An unexpected error occurred.' },
  [ExceptionType.INVALID_REQUEST]: { status: 400, message: 'Invalid request.' },
  [ExceptionType.USER_EXISTS]: { status: 409, message: 'User already exists.' },
  [ExceptionType.AUTH_FAILURE]: { status: 401, message: 'Auth failure.' },
  [ExceptionType.UNAUTHORIZED]: { status: 403, message: 'Unauthorized.' },
  [ExceptionType.INVALID_TOKEN]: { status: 401, message: 'Auth failure: token is not provided.' },
  [ExceptionType.NOT_FOUND]: { status: 404, message: 'Does not exist.' },
};
