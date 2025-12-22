import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

// Extend dayjs with the relativeTime plugin
dayjs.extend(relativeTime);

export const formatTimestamp = (timestamp: number) => {
  const timeFromNow = dayjs(timestamp).fromNow();

  return `${timeFromNow}`;
};
