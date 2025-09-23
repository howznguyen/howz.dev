import moment from "moment";

export const post = {
  published_at: (datetime: any) => {
    const days = 5;
    let raw = moment(datetime);
    let duration = moment.duration(moment().diff(datetime));
    const _datetime =
      duration.asHours() > 24 * days
        ? raw.format("DD/MM/YYYY HH:mm")
        : raw.fromNow();
    return `Published ${_datetime}.`;
  },
  reading_time: (min: any) => {
    return `${min} min read`;
  },
  views: (views: any) => {
    return `${views} views`;
  },
  tags: "Tags",
  relate_post: "Related Posts:",
  table_of_contents: "Table of Contents",
} as const;

export default post;