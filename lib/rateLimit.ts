import { NextRequest } from 'next/server'

// Simple in-memory rate limiter
// In production, consider using Redis or a database
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

interface RateLimitOptions {
  maxRequests: number
  windowMs: number
}

export function rateLimit(options: RateLimitOptions) {
  return {
    check: (request: NextRequest, identifier?: string) => {
      const key = identifier || getClientIdentifier(request)
      const now = Date.now()

      // Clean up old entries
      for (const [k, v] of rateLimitMap.entries()) {
        if (v.resetTime < now) {
          rateLimitMap.delete(k)
        }
      }

      const current = rateLimitMap.get(key)
      
      if (!current || current.resetTime < now) {
        // First request or window expired
        rateLimitMap.set(key, {
          count: 1,
          resetTime: now + options.windowMs
        })
        return { success: true, remaining: options.maxRequests - 1 }
      }

      if (current.count >= options.maxRequests) {
        return { 
          success: false, 
          remaining: 0,
          resetTime: current.resetTime
        }
      }

      current.count++
      return { 
        success: true, 
        remaining: options.maxRequests - current.count 
      }
    }
  }
}

function getClientIdentifier(request: NextRequest): string {
  // Try to get real IP from headers (for production behind proxy)
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIp) {
    return realIp
  }
  
  // Fallback identifier
  return 'unknown'
}

// Pre-configured rate limiters
export const pageViewRateLimit = rateLimit({
  maxRequests: 1000, // 1000 views per minute per IP (increased for development)
  windowMs: 60 * 1000 // 1 minute
})

export const checkoutRateLimit = rateLimit({
  maxRequests: 50, // 50 checkout attempts per hour per IP (increased for testing)
  windowMs: 60 * 60 * 1000 // 1 hour
})

export const apiRateLimit = rateLimit({
  maxRequests: 1000, // 1000 API calls per minute per IP (increased for development)
  windowMs: 60 * 1000 // 1 minute
})