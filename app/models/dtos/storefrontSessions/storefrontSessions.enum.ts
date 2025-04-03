export const StorefrontSessionsEnum = {
  AUTHENTICATED: 'AUTHENTICATED',
  PENDING: 'PENDING',
  REJECTED: 'REJECTED',
} as const;

export type StorefrontSessionsEnum = typeof StorefrontSessionsEnum[keyof typeof StorefrontSessionsEnum];
