import { NextRequest } from 'next/server';
import { RateLimitService, RATE_LIMIT_KEYS, RATE_LIMITS } from './redis'

export async function rateLimit(
  identifier: string,
  type: keyof typeof RATE_LIMITS = 'API_GENERAL'
) {
  const config = RATE_LIMITS[type]
  const key = type === 'CREATE_PAGE' 
    ? RATE_LIMIT_KEYS.CREATE_PAGE(identifier)
    : type === 'VIEW_PAGE'
    ? RATE_LIMIT_KEYS.VIEW_PAGE(identifier)
    : RATE_LIMIT_KEYS.API_GENERAL(identifier)

  return await RateLimitService.checkRateLimit(
    key,
    config.requests,
    config.window
  )
}

// Helper function to get client identifier
export function getClientIdentifier(request: NextRequest): string {
  // Try to get IP from various headers (for different proxy setups)
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  
  const ip = forwarded?.split(',')[0] || realIp || cfConnectingIp || 'unknown';
  
  // You could also include user agent or other identifiers
  const userAgent = request.headers.get('user-agent') || '';
  
  return `${ip}-${userAgent.slice(0, 50)}`;
}