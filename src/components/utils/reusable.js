import { notification as staticNotification } from "antd";
import { getNotificationApi } from "@/util/notificationHolder";
import moment from "moment";
import dayjs from "dayjs";

export const getResponePopup = (res) => {
  const notification = getNotificationApi() || staticNotification;
  const description = res?.data?.message ? res?.data?.message : res?.message;
  switch (res?.data?.status ? res?.data?.status : res?.status) {
    case "USER_DEFINED_ERROR":
      return notification.warning({
        description,
        duration: 3,
      });
    case "SUCCESS":
      return notification.success({
        description,
        duration: 2,
      });
    case "FAILED":
      return notification.error({
        description,
        duration: 2,
      });
    case "EXCEPTION":
      return notification.error({
        description,
        duration: 3,
      });
    case "CUSTOM_EXCEPTION":
      return notification.error({
        description,
        duration: 2,
      });
    default:
      break;
  }
};

export const getRoleIdByRole = (role) => {
  switch (role?.toUpperCase().replaceAll(" ", "_")) {
    case "ADMIN":
      return "0";
    case "DOWNLOADER":
      return "1";
    case "OWNER":
      return "2";
    case "AI":
      return "3";
    case "CODER_1":
    case "EH_CODER":
      return "4";
    case "CODER_2":
    case "PHYSICIAN":
      return "5";
    case "QA":
    case "CODER":
      return "6";
    case "QA_LEAD":
      return "7";
    case "PROJECT_LEAD":
      return "8";
    case "CLIENT":
      return "9";
    default:
      return null;
  }
};

export const formatDateForIndex = ({ date, index }) => {
  if (!date) return "";

  const formattedDate = moment(date).format("YYYY-MM-DD");
  const dateFormat =
    index === 1
      ? `${formattedDate}T21:59:59.999Z`
      : `${formattedDate}T00:00:00.000Z`;
  if (!dateFormat) return dateFormat;
  const adjustedTime = moment(dateFormat)
    .subtract(2, "hours")
    .subtract(30, "minutes");

  return adjustedTime.toISOString();
};

export const createIdGen = (key) => {
  return key?.replaceAll(" ", "_")?.toLowerCase();
};

export const truncateString = (str, num) => {
  if (str?.length > num) {
    return str?.slice(0, num) + "...";
  }
  return str;
};

export const capitalizeFirstLetter = (string) => {
  const formattedString = string?.toLowerCase();
  return formattedString?.charAt(0)?.toUpperCase() + formattedString?.slice(1);
};

export const disabledDate = (
  currentDate,
  selectedDates = [],
  allowFuture = false,
) => {
  const today = dayjs().endOf("day");
  const [startDate, endDate] = Array.isArray(selectedDates)
    ? selectedDates
    : [null, null];

  const startDay = startDate ? dayjs(startDate) : null;
  const endDay = endDate ? dayjs(endDate) : null;

  if (!allowFuture && currentDate && currentDate.isAfter(today, "day")) {
    return true;
  }
  if (startDay && !endDay) {
    return currentDate && currentDate.isBefore(startDay, "day");
  }
  if (endDay && !startDay) {
    return currentDate && currentDate.isAfter(endDay, "day");
  }
  if (startDay && endDay) {
    return (
      currentDate &&
      (currentDate.isBefore(startDay, "day") ||
        currentDate.isAfter(endDay, "day"))
    );
  }
  return false;
};

export const getColorValue = (key) => {
  switch (key) {
    case "primary":
    case "1":
      return "#064BAC";
    case "secondary":
    case "2":
      return "#7F91DE";
    case "secondary2":
    case "3":
      return "#00C1FF";
    case "secondary3":
    case "4":
      return "#006DDC";
    case "secondary4":
    case "5":
      return "#008FCA";
    case "secondary5":
    case "6":
      return "#0A5EB0";
    case "secondary6":
    case "7":
      return "#8576FF";
    default:
      return null;
  }
};

export const getRoleColor = (key) => {
  switch (key) {
    case "1": // admin
      return "#064BAC";
    case "2": //coder 1
      return "#5271FA";
    case "3": //coder 2
      return "#00C1FF";
    case "4": //Qa
      return "#006DDC";
    case "5": //Qa lead
      return "#008FCA";
    case "6": //projectLead
      return "#0A5EB0";
    case "7": //owner
      return "#8576FF";
    default:
      return null;
  }
};
