import { Redis } from '@upstash/redis'

// Redis client configuration
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// Cache keys
export const CACHE_KEYS = {
  TEMPLATES: 'templates:all',
  TEMPLATE: (slug: string) => `template:${slug}`,
  DURATIONS: 'durations:all',
  PERSONAL_PAGE: (shortId: string) => `page:${shortId}`,
  PAGE_VIEWS: (shortId: string) => `views:${shortId}`,
} as const

// Cache TTL (Time To Live) in seconds
export const CACHE_TTL = {
  TEMPLATES: 60 * 15, // 15 minutes
  TEMPLATE: 60 * 30, // 30 minutes
  DURATIONS: 60 * 60, // 1 hour
  PERSONAL_PAGE: 60 * 5, // 5 minutes
  PAGE_VIEWS: 60 * 60 * 24, // 24 hours
} as const

// Rate limiting keys
export const RATE_LIMIT_KEYS = {
  CREATE_PAGE: (ip: string) => `rate_limit:create_page:${ip}`,
  VIEW_PAGE: (ip: string) => `rate_limit:view_page:${ip}`,
  API_GENERAL: (ip: string) => `rate_limit:api:${ip}`,
} as const

// Rate limiting configuration
export const RATE_LIMITS = {
  CREATE_PAGE: { requests: 5, window: 60 * 15 }, // 5 requests per 15 minutes
  VIEW_PAGE: { requests: 100, window: 60 }, // 100 requests per minute
  API_GENERAL: { requests: 60, window: 60 }, // 60 requests per minute
} as const

// Cache helper functions
export class CacheService {
  static async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redis.get(key)
      return data as T
    } catch (error) {
      console.error('Redis get error:', error)
      return null
    }
  }

  static async set(key: string, value: any, ttl?: number): Promise<boolean> {
    try {
      if (ttl) {
        await redis.setex(key, ttl, JSON.stringify(value))
      } else {
        await redis.set(key, JSON.stringify(value))
      }
      return true
    } catch (error) {
      console.error('Redis set error:', error)
      return false
    }
  }

  static async del(key: string): Promise<boolean> {
    try {
      await redis.del(key)
      return true
    } catch (error) {
      console.error('Redis del error:', error)
      return false
    }
  }

  static async invalidatePattern(pattern: string): Promise<boolean> {
    try {
      const keys = await redis.keys(pattern)
      if (keys.length > 0) {
        await redis.del(...keys)
      }
      return true
    } catch (error) {
      console.error('Redis invalidate pattern error:', error)
      return false
    }
  }
}

// Rate limiting helper functions
export class RateLimitService {
  static async checkRateLimit(
    key: string,
    limit: number,
    window: number
  ): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    try {
      const current = await redis.incr(key)
      
      if (current === 1) {
        // First request, set expiration
        await redis.expire(key, window)
      }
      
      const ttl = await redis.ttl(key)
      const resetTime = Date.now() + (ttl * 1000)
      
      return {
        allowed: current <= limit,
        remaining: Math.max(0, limit - current),
        resetTime
      }
    } catch (error) {
      console.error('Rate limit check error:', error)
      // On error, allow the request
      return {
        allowed: true,
        remaining: limit - 1,
        resetTime: Date.now() + (window * 1000)
      }
    }
  }

  static async resetRateLimit(key: string): Promise<boolean> {
    try {
      await redis.del(key)
      return true
    } catch (error) {
      console.error('Rate limit reset error:', error)
      return false
    }
  }
}

// Analytics helper functions
export class AnalyticsService {
  static async incrementPageView(shortId: string, ip?: string): Promise<void> {
    try {
      const key = CACHE_KEYS.PAGE_VIEWS(shortId)
      await redis.incr(key)
      
      // Set expiration if it's a new key
      const ttl = await redis.ttl(key)
      if (ttl === -1) {
        await redis.expire(key, CACHE_TTL.PAGE_VIEWS)
      }
      
      // Track unique views by IP if provided
      if (ip) {
        const uniqueKey = `${key}:unique:${ip}`
        const isUnique = await redis.set(uniqueKey, '1', { ex: CACHE_TTL.PAGE_VIEWS, nx: true })
        if (isUnique) {
          await redis.incr(`${key}:unique`)
        }
      }
    } catch (error) {
      console.error('Analytics increment error:', error)
    }
  }

  static async getPageViews(shortId: string): Promise<{ total: number; unique: number }> {
    try {
      const key = CACHE_KEYS.PAGE_VIEWS(shortId)
      const [total, unique] = await Promise.all([
        redis.get(key),
        redis.get(`${key}:unique`)
      ])
      
      return {
        total: (total as number) || 0,
        unique: (unique as number) || 0
      }
    } catch (error) {
      console.error('Analytics get error:', error)
      return { total: 0, unique: 0 }
    }
  }
}

export default redis