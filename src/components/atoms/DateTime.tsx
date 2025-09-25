"use client";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/en";

dayjs.extend(relativeTime);

interface DateTimeProps {
  value: any;
  className?: string;
}

const DateTime = ({ value, className }: DateTimeProps) => {
  dayjs.locale("en");
  const days = 5;
  let raw = dayjs(value);
  let duration = dayjs().diff(dayjs(value), "hour");
  const datetime =
    duration > 24 * days ? raw.format("DD/MM/YYYY HH:mm") : raw.fromNow();
  return <span className={className}>{datetime}</span>;
};

export default DateTime;
