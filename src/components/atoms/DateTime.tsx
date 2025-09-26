"use client";

import dayjs from "dayjs";
import cn from "classnames";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/en";

dayjs.extend(relativeTime);

interface DateTimeProps {
  value: any;
  className?: string;
  showTooltip?: boolean;
  variant?: "default" | "badge" | "card";
}

const DateTime = ({
  value,
  className = "",
  showTooltip = false,
  variant = "default",
}: DateTimeProps) => {
  dayjs.locale("en");
  const days = 5;
  let raw = dayjs(value);
  let duration = dayjs().diff(dayjs(value), "hour");
  const datetime =
    duration > 24 * days ? raw.format("DD/MM/YYYY HH:mm") : raw.fromNow();

  const baseClasses = "transition-colors duration-200";

  const variantClasses = {
    default: "text-gray-600 dark:text-gray-300",
    badge:
      "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-2 py-1 rounded-md text-xs font-medium border border-gray-200 dark:border-gray-700",
    card: "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-700 dark:text-blue-300 px-3 py-2 rounded-lg text-sm font-medium border border-blue-200 dark:border-blue-800 shadow-sm",
  };

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;

  if (showTooltip) {
    return (
      <span
        className={cn(combinedClasses, "cursor-pointer")}
        title={raw.format("dddd, MMMM DD YYYY, HH:mm:ss")}
      >
        {datetime}
      </span>
    );
  }

  return <span className={combinedClasses}>{datetime}</span>;
};

export default DateTime;
