"use client";

import { useEffect } from "react";
import { STORAGE_KEYS } from "@/lib/constants";
import moment from "moment";

interface ScrollTrackerProps {
  slug: string;
  locale: string;
}

export default function ScrollTracker({ slug, locale }: ScrollTrackerProps) {
  useEffect(() => {
    const onScroll = () => {
      const pathname = location.pathname;
      const postsLocal = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.VIEWED_POSTS) ?? "{}"
      );

      if (
        pathname in postsLocal &&
        moment().diff(moment(postsLocal[pathname]), "m", true) >= 15
      ) {
        delete postsLocal[pathname];
      }

      // Removed view tracking logic
      if (!(pathname in postsLocal)) {
        postsLocal[pathname] = moment().toISOString();
        localStorage.setItem(
          STORAGE_KEYS.VIEWED_POSTS,
          JSON.stringify(postsLocal)
        );
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [slug, locale]);

  return null;
}
