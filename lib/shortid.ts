import { nanoid } from 'nanoid'

// Generate a short ID for personal pages
// Using 8 characters for good uniqueness while keeping URLs short
export function generateShortId(): string {
  return nanoid(8)
}

// Generate a longer ID for sensitive operations
export function generateLongId(): string {
  return nanoid(16)
}

// Validate short ID format
export function isValidShortId(id: string): boolean {
  return /^[A-Za-z0-9_-]{8}$/.test(id)
}