export interface UmamiUrlMetric {
  x: string; // URL path
  y: number; // Number of pageviews
}

export interface UmamiStatsResponse {
  pageviews: { value: number; prev: number };
  visitors: { value: number; prev: number };
  visits: { value: number; prev: number };
  bounces: { value: number; prev: number };
  totaltime: { value: number; prev: number };
}

/**
 * Service to interact with Umami Analytics API
 */
export class UmamiService {
  private baseUrl: string;
  private websiteId: string;
  private token: string;

  constructor() {
    this.baseUrl = process.env.UMAMI_HOST || "";
    this.websiteId = process.env.UMAMI_WEBSITE_ID || "";
    this.token = process.env.UMAMI_TOKEN || "";
  }

  /**
   * Check if Umami is configured
   */
  isConfigured(): boolean {
    return !!(this.baseUrl && this.websiteId && this.token);
  }

  /**
   * Get pageviews for multiple URLs in a single request
   */
  async getUrlMetrics(timeRange?: {
    startAt?: number;
    endAt?: number;
  }): Promise<UmamiUrlMetric[]> {
    if (!this.isConfigured()) {
      console.warn("Umami not configured, returning empty metrics");
      return [];
    }

    const now = new Date();
    const startAt = timeRange?.startAt || Date.UTC(2024, 0, 1); // Default to 2024-01-01
    const endAt = timeRange?.endAt || now.getTime();

    try {
      const url =
        `${this.baseUrl}/websites/${this.websiteId}/metrics?` +
        new URLSearchParams({
          startAt: String(startAt),
          endAt: String(endAt),
          type: "url",
          limit: "1000", // Get up to 1000 URLs
        });

      const response = await fetch(url, {
        headers: {
          "x-umami-api-key": this.token,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.error(
          "Umami API error:",
          response.status,
          await response.text()
        );
        return [];
      }

      const data: UmamiUrlMetric[] = await response.json();
      return data || [];
    } catch (error) {
      console.error("Error fetching Umami URL metrics:", error);
      return [];
    }
  }

  async getViewsByPostSlug(slug: string): Promise<number> {
    const url = `/post/${slug}`;
    return this.getUrlPageviews(url);
  }

  /**
   * Get pageviews for a specific URL
   */
  async getUrlPageviews(
    url: string,
    timeRange?: { startAt?: number; endAt?: number }
  ): Promise<number> {
    if (!this.isConfigured()) {
      return 0;
    }

    const now = new Date();
    const startAt = timeRange?.startAt || Date.UTC(2024, 0, 1);
    const endAt = timeRange?.endAt || now.getTime();

    try {
      const apiUrl =
        `${this.baseUrl}/websites/${this.websiteId}/pageviews?` +
        new URLSearchParams({
          startAt: String(startAt),
          endAt: String(endAt),
          url: url,
          unit: "day",
          timezone: "Asia/Ho_Chi_Minh",
        });

      const response = await fetch(apiUrl, {
        headers: {
          "x-umami-api-key": this.token,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Umami API error:", response.status, errorText);
        return 0;
      }

      const data = await response.json();

      // Handle the actual response format from Umami v1 API
      if (data?.sessions && Array.isArray(data.pageviews)) {
        // Sum up pageviews from array of daily data: [{ x: '2025-08-31T17:00:00Z', y: 10 }]
        return data.sessions.reduce(
          (sum: number, item: any) => sum + (item.y || 0),
          0
        );
      } else if (Array.isArray(data)) {
        // Fallback: if data is directly an array
        return data.reduce(
          (sum: number, item: any) => sum + (item.y || item.value || 0),
          0
        );
      } else if (data?.sessions?.value) {
        // Handle stats response format (legacy)
        return data.sessions.value;
      } else if (typeof data === "number") {
        return data;
      }

      return 0;
    } catch (error) {
      console.error("Error fetching Umami pageviews:", error);
      return 0;
    }
  }

  /**
   * Create a map of slug -> pageviews for easy lookup
   */
  async getViewsMap(): Promise<Map<string, number>> {
    const metrics = await this.getUrlMetrics();
    const viewsMap = new Map<string, number>();

    metrics.forEach((metric) => {
      // Extract slug from URL path (e.g., "/post/my-slug" -> "my-slug")
      const match = metric.x.match(/\/post\/([^/?]+)/);
      if (match) {
        const slug = match[1];
        viewsMap.set(slug, metric.y);
      }
    });

    return viewsMap;
  }
}

// Export singleton instance
export const umamiService = new UmamiService();
