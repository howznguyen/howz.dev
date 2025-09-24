"use client";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/en";
import Icon from "./Icon";

dayjs.extend(relativeTime);

interface DateTimeProps {
  value: any;
}

const DateTime = ({ value }: DateTimeProps) => {
  dayjs.locale("en");
  const days = 5;
  let raw = dayjs(value);
  let duration = dayjs().diff(dayjs(value), "hour");
  const datetime =
    duration > 24 * days ? raw.format("DD/MM/YYYY HH:mm") : raw.fromNow();
  return (
    <>
      <div className="flex items-center gap-1">
        <Icon icon="HiCalendar" />
        {datetime}
      </div>
    </>
  );
};

export default DateTime;
