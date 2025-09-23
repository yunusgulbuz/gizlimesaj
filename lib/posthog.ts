import { PostHog } from 'posthog-node'

// Server-side PostHog client
let posthogClient: PostHog | null = null

export function getPostHogClient(): PostHog | null {
  if (!process.env.POSTHOG_KEY) {
    console.warn('PostHog key not found in environment variables')
    return null
  }

  if (!posthogClient) {
    posthogClient = new PostHog(process.env.POSTHOG_KEY, {
      host: 'https://eu.posthog.com', // EU instance
      flushAt: 20,
      flushInterval: 30000,
    })
  }

  return posthogClient
}

// Event tracking functions
export class AnalyticsEvents {
  static async trackPageView(
    userId: string | null,
    page: string,
    properties?: Record<string, any>
  ) {
    const client = getPostHogClient()
    if (!client) return

    try {
      client.capture({
        distinctId: userId || 'anonymous',
        event: 'page_view',
        properties: {
          page,
          ...properties,
        },
      })
    } catch (error) {
      console.error('PostHog page view tracking error:', error)
    }
  }

  static async trackTemplateView(
    userId: string | null,
    templateSlug: string,
    templateId: string
  ) {
    const client = getPostHogClient()
    if (!client) return

    try {
      client.capture({
        distinctId: userId || 'anonymous',
        event: 'template_viewed',
        properties: {
          template_slug: templateSlug,
          template_id: templateId,
        },
      })
    } catch (error) {
      console.error('PostHog template view tracking error:', error)
    }
  }

  static async trackPersonalPageCreated(
    userId: string | null,
    shortId: string,
    templateId: string,
    durationDays: number
  ) {
    const client = getPostHogClient()
    if (!client) return

    try {
      client.capture({
        distinctId: userId || 'anonymous',
        event: 'personal_page_created',
        properties: {
          short_id: shortId,
          template_id: templateId,
          duration_days: durationDays,
        },
      })
    } catch (error) {
      console.error('PostHog personal page creation tracking error:', error)
    }
  }

  static async trackPersonalPageViewed(
    viewerId: string | null,
    shortId: string,
    isUnique: boolean
  ) {
    const client = getPostHogClient()
    if (!client) return

    try {
      client.capture({
        distinctId: viewerId || 'anonymous',
        event: 'personal_page_viewed',
        properties: {
          short_id: shortId,
          is_unique_view: isUnique,
        },
      })
    } catch (error) {
      console.error('PostHog personal page view tracking error:', error)
    }
  }

  static async trackOrderCreated(
    userId: string | null,
    orderId: string,
    totalAmount: number,
    paymentProvider: string
  ) {
    const client = getPostHogClient()
    if (!client) return

    try {
      client.capture({
        distinctId: userId || 'anonymous',
        event: 'order_created',
        properties: {
          order_id: orderId,
          total_amount: totalAmount,
          payment_provider: paymentProvider,
        },
      })
    } catch (error) {
      console.error('PostHog order creation tracking error:', error)
    }
  }

  static async trackPaymentCompleted(
    userId: string | null,
    orderId: string,
    totalAmount: number,
    paymentProvider: string
  ) {
    const client = getPostHogClient()
    if (!client) return

    try {
      client.capture({
        distinctId: userId || 'anonymous',
        event: 'payment_completed',
        properties: {
          order_id: orderId,
          total_amount: totalAmount,
          payment_provider: paymentProvider,
        },
      })
    } catch (error) {
      console.error('PostHog payment completion tracking error:', error)
    }
  }

  static async trackError(
    userId: string | null,
    errorType: string,
    errorMessage: string,
    context?: Record<string, any>
  ) {
    const client = getPostHogClient()
    if (!client) return

    try {
      client.capture({
        distinctId: userId || 'anonymous',
        event: 'error_occurred',
        properties: {
          error_type: errorType,
          error_message: errorMessage,
          ...context,
        },
      })
    } catch (error) {
      console.error('PostHog error tracking error:', error)
    }
  }
}

// Feature flags
export class FeatureFlags {
  static async isFeatureEnabled(
    userId: string | null,
    featureKey: string
  ): Promise<boolean> {
    const client = getPostHogClient()
    if (!client) return false

    try {
      const isEnabled = await client.isFeatureEnabled(
        featureKey,
        userId || 'anonymous'
      )
      return isEnabled || false
    } catch (error) {
      console.error('PostHog feature flag check error:', error)
      return false
    }
  }

  static async getFeatureFlag(
    userId: string | null,
    featureKey: string
  ): Promise<string | boolean | undefined> {
    const client = getPostHogClient()
    if (!client) return undefined

    try {
      const flagValue = await client.getFeatureFlag(
        featureKey,
        userId || 'anonymous'
      )
      return flagValue
    } catch (error) {
      console.error('PostHog feature flag get error:', error)
      return undefined
    }
  }
}

// User identification
export class UserIdentification {
  static async identifyUser(
    userId: string,
    properties?: Record<string, any>
  ) {
    const client = getPostHogClient()
    if (!client) return

    try {
      client.identify({
        distinctId: userId,
        properties: {
          ...properties,
        },
      })
    } catch (error) {
      console.error('PostHog user identification error:', error)
    }
  }

  static async aliasUser(
    userId: string,
    previousId: string
  ) {
    const client = getPostHogClient()
    if (!client) return

    try {
      client.alias({
        distinctId: userId,
        alias: previousId,
      })
    } catch (error) {
      console.error('PostHog user alias error:', error)
    }
  }
}

// Graceful shutdown
export async function shutdownPostHog() {
  if (posthogClient) {
    await posthogClient.shutdown()
  }
}