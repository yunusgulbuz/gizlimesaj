// Analytics helper for tracking events on personal pages
export interface AnalyticsEvent {
  event_type: string;
  metadata?: Record<string, any>;
  user_agent?: string;
  ip_address?: string;
}

export class AnalyticsTracker {
  private shortId: string;

  constructor(shortId: string) {
    this.shortId = shortId;
  }

  async trackEvent(event: AnalyticsEvent): Promise<boolean> {
    try {
      const response = await fetch(`/api/personal-pages/${this.shortId}/analytics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_type: event.event_type,
          metadata: event.metadata,
          user_agent: event.user_agent || navigator.userAgent,
          ip_address: event.ip_address, // Will be handled server-side
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Analytics tracking error:', error);
      return false;
    }
  }

  // Convenience methods for common events
  async trackPageView(): Promise<boolean> {
    return this.trackEvent({
      event_type: 'page_view',
    });
  }

  async trackButtonClick(buttonType: string, additionalData?: Record<string, any>): Promise<boolean> {
    return this.trackEvent({
      event_type: 'button_click',
      metadata: {
        buttonType,
        ...additionalData,
      },
    });
  }

  async trackAudioPlay(audioUrl?: string): Promise<boolean> {
    return this.trackEvent({
      event_type: 'audio_play',
      metadata: {
        audioUrl,
      },
    });
  }

  async trackVideoPlay(videoUrl?: string): Promise<boolean> {
    return this.trackEvent({
      event_type: 'video_play',
      metadata: {
        videoUrl,
      },
    });
  }

  async trackShare(platform?: string): Promise<boolean> {
    return this.trackEvent({
      event_type: 'share',
      metadata: {
        platform,
      },
    });
  }

  async trackDownload(fileType?: string): Promise<boolean> {
    return this.trackEvent({
      event_type: 'download',
      metadata: {
        fileType,
      },
    });
  }
}

// Factory function to create analytics tracker
export function createAnalyticsTracker(shortId: string): AnalyticsTracker {
  return new AnalyticsTracker(shortId);
}