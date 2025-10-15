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
  private usingApiKey: boolean;

  constructor() {
    this.baseUrl = process.env.UMAMI_HOST || "https://api.umami.is/v1";
    this.websiteId = process.env.UMAMI_WEBSITE_ID || "";
    this.token = process.env.UMAMI_TOKEN || "";
    this.usingApiKey = this.baseUrl === "https://api.umami.is/v1";
  }

  /**
   * Check if Umami is configured
   */
  isConfigured(): boolean {
    return !!(this.baseUrl && this.websiteId && this.token);
  }

  /**
   * Create Request Default
   */
   private async createRequest(method: string, endpoint: string, {
     body = {},
     headers = {},
     query = {},
   }: {
     body?: Record<string, any>;
     headers?: Record<string, any>;
     query?: Record<string, any>;
   }) {

    const defaultHeaders : Record<string, string> = {
      "Content-Type": "application/json",
    };

    // if usingApiKey then set x-umami-api-key
    if (this.usingApiKey) {
      defaultHeaders["x-umami-api-key"] = this.token;
    } else {
      defaultHeaders["Authorization"] = `Bearer ${this.token}`;
    }

    const options: Record<string, any> = {
      method,
      headers: {...defaultHeaders, ...headers},
    };

    if (Object.keys(body).length > 0) {
      options.body = JSON.stringify(body);
    }

    if (Object.keys(query).length > 0) {
      const queryParams = new URLSearchParams(query);
      endpoint += `?${queryParams.toString()}`;
    }

    return fetch(`${this.baseUrl}${endpoint}`, options);
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
      const endpoint = `/websites/${this.websiteId}/metrics`;

      const response = await this.createRequest("GET", endpoint, {
        query: {
          startAt: String(startAt),
          endAt: String(endAt),
          type: "url",
          limit: "100000", // Get up to 10000 URLs
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

      // Merge data by URL (remove hash and sum views)
      const urlMap = new Map<string, number>();

      data.forEach((item) => {
        // Remove hash from URL
        const cleanUrl = item.x.replace(/#.*/, '');
        // Sum views for the same URL
        const currentViews = urlMap.get(cleanUrl) || 0;
        urlMap.set(cleanUrl, currentViews + item.y);
      });

      // Convert map back to array format
      const mergedData: UmamiUrlMetric[] = Array.from(urlMap.entries()).map(
        ([url, views]) => ({
          x: url,
          y: views,
        })
      );

      return mergedData;
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
  ): Promise<number> {
    if (!this.isConfigured()) {
      return 0;
    }
    const res = await this.getUrlMetrics();

    const metric = res.filter((m) => m.x.split('#')[0] == url);
    return metric.length > 0 ? metric.reduce((acc, curr) => acc + curr.y, 0) : 0;
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
