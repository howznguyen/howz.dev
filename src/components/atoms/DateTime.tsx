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
  format?: string;
  rawFormat?: boolean;
}

const DateTime = ({
  value,
  className = "",
  showTooltip = false,
  format = "DD/MM/YYYY HH:mm",
  rawFormat = false,
}: DateTimeProps) => {
  dayjs.locale("en");
  const days = 5;
  let raw = dayjs(value, format);
  let duration = dayjs().diff(raw, "hour");
  const datetime =
    duration > 24 * days ? raw.format("DD/MM/YYYY HH:mm") : raw.fromNow();

  const rawDatetime = raw.format("DD/MM/YYYY HH:mm");

  const baseClasses = "transition-colors duration-200";

  const combinedClasses = `${baseClasses}  ${className}`;

  if (showTooltip) {
    return (
      <span
        className={cn(combinedClasses, "cursor-pointer")}
        title={raw.format("dddd, MMMM DD YYYY, HH:mm:ss")}
      >
        {rawFormat ? rawDatetime : datetime}
      </span>
    );
  }

  return (
    <span className={combinedClasses}>
      {rawFormat ? rawDatetime : datetime}
    </span>
  );
};

export default DateTime;
