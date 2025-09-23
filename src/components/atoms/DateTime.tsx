"use client";

import moment from "moment";
import "moment/locale/vi";
import { usePathname } from "next/navigation";

interface DateTimeProps {
  value: any;
}

const DateTime = ({ value }: DateTimeProps) => {
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "vi";
  moment.locale(locale);
  const days = 5;
  let raw = moment(value);
  let duration = moment.duration(moment().diff(value));
  const datetime =
    duration.asHours() > 24 * days
      ? raw.format("DD/MM/YYYY HH:mm")
      : raw.fromNow();
  return <>{datetime}</>;
};

export default DateTime;
