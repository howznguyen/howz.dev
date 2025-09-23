"use client";

import { Icon } from '../atoms';

interface ViewsProps {
  views?: number; // Direct views count
  className?: string;
}

export default function Views({ views, className = "" }: ViewsProps) {
  // If views prop is provided, use it directly
  if (typeof views === 'number') {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        <Icon icon="HiEye" />
        <span>{views} views</span>
      </div>
    );
  }

  // If no views prop and no Umami config, don't render
  if (!process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID) {
    return null;
  }

  // Legacy fallback: fetch from API (not recommended now)
  return null;
}