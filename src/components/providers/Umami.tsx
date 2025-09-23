"use client";

import Script from "next/script";

interface UmamiProps {
  trackPageViews?: boolean;
}

export const Umami = ({ trackPageViews = true }: UmamiProps) => {
  if (!trackPageViews || !process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID) return null;

  return (
    <Script
      defer
      src={`${process.env.NEXT_PUBLIC_UMAMI_SCRIPT}/script.js`}
      data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
      strategy="afterInteractive"
    />
  );
};