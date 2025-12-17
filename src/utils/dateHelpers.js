import { subDays } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { timezone } from "./constants";

// formats date to ist format time HH:mm
export const formatTime = (date) => {
  try {
    const istDate = formatInTimeZone(new Date(date), timezone, "HH:mm a");
    return istDate;
  } catch (err) {
    console.log(err);
  }
};

// formats date to ist format dd-MM-yyyy
const formatToISTDate = (date) => {
  try {
    const istDate = formatInTimeZone(new Date(date), timezone, "dd-MM-yyyy");
    return istDate;
  } catch (err) {
    console.log(err);
  }
};

export const groupMessagesByCreatedAt = (messages) => {
  // Map to store messages by createdAt
  const messagesMap = new Map();
  for (const item of messages) {
    const createdDate = new Date(item?.createdAt);
    const formatedCreatedAt = formatToISTDate(item?.createdAt);
    // item value to set
    let valueItem = {};
    if (!messagesMap.has(formatedCreatedAt)) {
      valueItem.createdAt = createdDate;
      const fromDate = new Date(subDays(new Date(), 6));
      const toDate = new Date(subDays(new Date(), 2));
      valueItem.messages = [item];
      if (formatedCreatedAt === formatToISTDate(new Date())) {
        valueItem.dateInfo = "Today";
      } else if (
        formatedCreatedAt === formatToISTDate(new Date(subDays(new Date(), 1)))
      ) {
        valueItem.dateInfo = "Yesterday";
      } else if (fromDate <= createdDate && createdDate <= toDate) {
        valueItem.dateInfo = formatInTimeZone(createdDate, timezone, "EEEE");
      } else {
        valueItem.dateInfo = formatedCreatedAt;
      }
    } else {
      valueItem = messagesMap.get(formatedCreatedAt);
      valueItem.messages.push(item);
    }
    messagesMap.set(formatedCreatedAt, valueItem);
  }
  // return values sorted by created
  return [...messagesMap.values()]?.sort(
    (a, b) => new Date(a?.createdAt) - new Date(b?.createdAt)
  );
};
