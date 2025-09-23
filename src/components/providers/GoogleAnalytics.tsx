"use client";

import { GoogleAnalytics as NextGoogleAnalytics } from "nextjs-google-analytics";

export function GoogleAnalytics({
  trackPageViews,
}: {
  trackPageViews?: boolean;
}) {
  return <NextGoogleAnalytics trackPageViews={trackPageViews} />;
}
