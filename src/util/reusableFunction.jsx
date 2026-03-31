import { notification, Tooltip } from "antd";
import { getNotificationApi } from "@/util/notificationHolder";
import momentTimezone from "moment-timezone";
import moment from "moment";
import Image from "next/image";
import CryptoJS from "crypto-js";

import { companyDeatils } from "@/util/config";
import { salt } from "@/util/config";
import dayjs from "dayjs";
import isEqual from "lodash/isEqual";

import { renderUserPrfoileAvatar } from "@/components/layout/appHeader/function";
import { FaTriangleExclamation } from "react-icons/fa6";
import { useCallback, useEffect, useRef } from "react";

const getNotification = () => getNotificationApi() || notification;

export const getResponePopup = (res) => {
  const api = getNotification();
  const description =
    res?.data?.message != null ? res?.data?.message : res?.message;
  switch (res?.data?.status ?? res?.status) {
    case "USER_DEFINED_ERROR":
      return api.warning({ description, duration: 3 });
    case "SUCCESS":
      return api.success({ description, duration: 2 });
    case "FAILED":
      return api.error({ description, duration: 2 });
    case "EXCEPTION":
      return api.error({ description, duration: 3 });
    case "CUSTOM_EXCEPTION":
      return api.error({ description, duration: 2 });
    default:
      break;
  }
};

const encryptData = (data, key, iv) => {
  const keyUtf8 = CryptoJS.enc.Utf8.parse(key);
  const ivUtf8 = CryptoJS.enc.Utf8.parse(iv);

  const encrypted = CryptoJS.AES.encrypt(data, keyUtf8, {
    iv: ivUtf8,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return encrypted.toString();
};

export const encyptingPass = (password) => {
  const plaintextData = password;
  const encryptionKey = salt; // Should be 16, 24, or 32 bytes
  const initializationVector = generateRandomString(); // Should be 16 bytes
  const encryptedData = encryptData(
    plaintextData,
    encryptionKey,
    initializationVector,
  );
  const values = { pass: encryptedData, iv: initializationVector };
  return values;
};

export const getLogo = () => {
  switch (companyDeatils) {
    case "abha":
      return (
        <img
          className={`login-logo`}
          src={"/images/logo/abha-HEADER.png"}
          alt="Abha"
          style={{
            display: "block",
            margin: "0 auto",
            width: "450px",
          }}
        />
      );

    default:
      break;
  }
};

export const getheaderLogo = () => {
  switch (companyDeatils) {
    case "abha":
      return (
        <Image
          src={"/images/logo/abha-HEADER.png"}
          alt="Abha"
          width={150}
          height={150}
        />
      );

    default:
      break;
  }
};

export const checkWithIncludesKey = (list, key) => {
  return list?.includes(key);
};

export const findItemWithTrueOrFalse = (design, key) => {
  return design?.includes(key);
};

export const reusableEllipses = ({ str, count }) => {
  if (Array.isArray(str)) {
    return (
      <div className="flex gap-1">
        {str.map((item, index) => {
          if (item?.length > count) {
            return (
              <Tooltip placement="top" title={item} key={index}>
                {`${item?.substring(0, count)}...`}
              </Tooltip>
            );
          } else {
            return <div key={index}>{item}</div>;
          }
        })}
      </div>
    );
  } else {
    if (str?.length > count) {
      return (
        <Tooltip placement="top" title={str}>
          {`${str?.substring(0, count)}...`}
        </Tooltip>
      );
    } else {
      return str;
    }
  }
};

export const convertToCustomParams = (obj) => {
  const keys = Object.keys(obj);
  if (keys.length === 0) return "";
  const restParams = keys
    .filter(
      (key) => obj[key] !== undefined && obj[key] !== null && key != "clientId",
    )
    .map((key) => `&${key}=${obj[key]}`)
    .join("");
  return restParams;
};

export const convertToCustomParamsDatePicker = (obj) => {
  let params = "";

  Object.entries(obj).forEach(([key, value]) => {
    // let keyValue = key;
    if (typeof value === "object" && value !== null) {
      const { startDate, endDate } = value;
      // if(keyValue == "computedDate"){
      //   const userRole = getStorage("userRole");
      //   keyValue = userRole.replace("_", "").toLowerCase()+"CompletedDate";
      // }
      if (startDate) {
        params += `&${key}Start=${startDate}`;
      }

      if (endDate) {
        params += `&${key}End=${endDate}`;
      }
    }
  });

  return params;
};

export const findMatchesByField = (arr1, arr2) => {
  return arr1?.some((obj1) =>
    arr2?.some((obj2) => JSON.stringify(obj1) === JSON.stringify(obj2)),
  );
};

export const formatDateTime = ({ date, formatType = "date" }) => {
  if (!date) return "";

  let dateType;

  // Choose format based on formatType
  if (formatType === "date") {
    dateType = "DD/MM/YYYY";
  } else if (formatType === "time") {
    dateType = "h:mm:ss A"; // hour:minute:second AM/PM
  } else {
    dateType = "DD/MM/YYYY h:mm:ss A"; // full datetime
  }

  // Convert backend UTC time → Saudi Arabia time (UTC+3)
  const saudiTime = momentTimezone.utc(date).tz("Asia/Riyadh");

  // Return formatted string
  return saudiTime.format(dateType);
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

export const generateOptions = (items) => {
  if (items?.length > 0) {
    const options = [
      ...items?.map((item) => ({
        label: item,
        value: item,
      })),
    ].filter(Boolean);
    return options;
  } else {
    return [];
  }
};

export const generateOptionsObject = (items) => {
  if (items?.length > 0) {
    const options = [
      ...items?.map((item) => ({
        label: item?.name,
        value: item?.id,
      })),
    ].filter(Boolean);
    return options;
  } else {
    return [];
  }
};

export const findItemWithTrueKey = (dataArray, fieldName) => {
  const item = dataArray?.find((item) => item.actualField === fieldName);
  if (item?.actualField === fieldName) {
    return true;
  } else {
    return false;
  }
};

export const CreateIdGens = (key) => {
  if (key) {
    return key.trim().toLowerCase().replaceAll(" ", "-");
  } else if (key) {
    return key.trim().toLowerCase().replaceAll(" ", "-");
  } else {
    return key;
  }
};

export const renderUserProfile = (data, columnItem) => {
  const compareObj = data[columnItem?.actualField];

  if (
    compareObj?.firstName ||
    compareObj?.lastName ||
    compareObj?.profileImage
  ) {
    return (
      <div
        className="flex items-center text-truncate"
        style={{ width: "100%", margin: "auto" }}
      >
        <span style={{ marginRight: "10px" }}>
          {renderUserPrfoileAvatar(
            compareObj?.firstName || compareObj?.firstName,
            compareObj?.lastName || compareObj?.lastName,
            compareObj?.profileImage || compareObj?.profileImage,
            "header",
          )}
        </span>
        <span>
          {compareObj?.firstName || compareObj?.firstName}{" "}
          {compareObj?.lastName || compareObj?.lastName}
        </span>
      </div>
    );
  }
  return <div style={{ textAlign: "center" }}>---</div>;
};

export const generateHeaderTab = ({ tabList, value = "", id = "" }) => {
  const res = tabList?.map((item) => ({
    label: value ? item?.[value] : item,
    value: id ? item?.[id] : item,
  }));

  return res;
};

export const priorityOptions = [
  {
    value: "URGENT",
    label: (
      <div className="flex gap-1 items-center">
        <i>
          <FaTriangleExclamation className="text-red-500" />
        </i>
        <span style={{ fontSize: "13px", color: "red" }}>Urgent</span>{" "}
      </div>
    ),
  },
  {
    value: "HIGH",
    label: (
      <div className="flex gap-1 items-center">
        <i>
          <FaTriangleExclamation className="text-red-500" />
        </i>
        <span style={{ fontSize: "13px", color: "#cf940a" }}>High</span>{" "}
      </div>
    ),
  },
  {
    value: "NORMAL",
    label: (
      <div className="flex gap-1 items-center">
        <i>
          <FaTriangleExclamation className="text-red-500" />
        </i>
        <span style={{ fontSize: "13px", color: "#4466ff " }}>Normal</span>{" "}
      </div>
    ),
  },
  {
    value: "LOW",
    label: (
      <div className="flex gap-1 items-center">
        <i>
          <FaTriangleExclamation className="text-red-500" />
        </i>
        <span style={{ fontSize: "13px", color: "#87909e" }}>Low</span>{" "}
      </div>
    ),
  },
];

export const disablePastDate = (current) => {
  return current && current.isBefore(moment().subtract(1, "day"));
};

export const getDateFormat = (date, isFullData = false) => {
  if (!date) return "---";
  if (date && isFullData) {
    return moment(date, "DD/MM/YYYY")?.format("DD-MM-YYYY");
  }
  if (date) {
    return moment(date, "DD/MM/YYYY")?.format("MMM DD");
  }
};

export const pdfEncrypt = (value) => {
  const plaintextData = value;
  let now = new Date();
  let date = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    now.getUTCHours(),
    now.getUTCMinutes(),
    now.getUTCSeconds(),
    now.getUTCMilliseconds(),
  );
  const encryptionKey = salt; // Should be 16, 24, or 32 bytes
  const initializationVector = date + ":" + "vg"; // Should be 16 bytes
  const encryptedData = encryptData(
    plaintextData,
    encryptionKey,
    initializationVector,
  );
  const values = { pass: encryptedData, iv: initializationVector };
  return values;
};

export const timeLineDateAndTime = ({ inputDate }) => {
  return moment(inputDate).format("MMMM D YYYY hh:mm A");
};

export const isStatusDisabled = (
  patientIdDetailsData,
  patientDetailsResult,
  pathname,
) => {
  const dosWiseStatus =
    patientDetailsResult?.data?.response?.workflow?.[0]?.status ||
    patientDetailsResult?.data?.response?.masterAudit?.status;
  const overAllStatus =
    patientIdDetailsData?.data?.response?.workflow?.[0]?.status ||
    patientIdDetailsData?.data?.response?.masterAudit?.status;

  let disabled = dosWiseStatus !== "PENDING" || overAllStatus === "COMPLETED";
  const pathDisbaled =
    pathname.endsWith("/tenantadmin/tin/details") ||
    pathname.endsWith("/tenantadmin/project/details") ||
    pathname.endsWith("/tenantadmin/patientsync/batchfilesview");

  if (pathDisbaled) {
    return true;
  }
  if (pathname.endsWith("/tenantadmin/tin/tindetails/masteraudit")) {
    const dosWiseStatus = patientDetailsResult?.data?.response?.masterAudit
      ?.status
      ? patientDetailsResult?.data?.response?.masterAudit?.status
      : "PENDING";
    disabled = dosWiseStatus !== "PENDING";
    return disabled;
  }
  return disabled;
};

export const getStatusColors = (state) => {
  let previousStateColor = "";
  switch (state) {
    case "COMPLETED":
      previousStateColor = "#03512E";
      break;
    case "PENDING":
      previousStateColor = "#02854A";
      break;
    case "HOLD":
      previousStateColor = "#9CFAD0";
      break;
    case "DECLINED":
      previousStateColor = "#EB5252";
      break;
    case "AUDITED":
      previousStateColor = "#4AA1AB";
      break;
    case "REAUDIT":
      previousStateColor = "#964B00";
      break;
    case "AUDITHOLD":
      previousStateColor = "#EBAE00";
      break;
    case "AUDIT_PENDING":
      previousStateColor = "#BD3A79";
      break;
    case "AUDIT_DECLINED":
      previousStateColor = "#C21807";
      break;
    default:
      previousStateColor = "";
  }
  return previousStateColor;
};

export const useFormSubmittable = (form, fields) => {
  const initialValuesRef = useRef(null);

  useEffect(() => {
    initialValuesRef.current = form.getFieldsValue(true);
  }, [form]);

  const isDisabled = useCallback(() => {
    if (!initialValuesRef.current) return true;

    const hasErrors = form
      .getFieldsError(fields)
      .some(({ errors }) => errors.length > 0);

    const currentValues = fields
      ? form.getFieldsValue(fields)
      : form.getFieldsValue(true);

    const initialValues = fields
      ? fields.reduce((acc, key) => {
        acc[key] = initialValuesRef.current[key];
        return acc;
      }, {})
      : initialValuesRef.current;

    const isChanged = !isEqual(currentValues, initialValues);

    const isTouched = fields
      ? form.isFieldsTouched(fields, true)
      : form.isFieldsTouched(true);

    return hasErrors || !isChanged || !isTouched;
  }, [form, fields]);

  return isDisabled;
};

export const formValidate = ({ value, valueType }) => {
  switch (valueType) {
    case "allowNumber":
      return /^[0-9]+$/.test(value);

    case "allowDecimal":
      return /^\d*\.?\d*$/.test(value);

    case "allowAlphabet":
      return /^[A-Za-z]+$/.test(value);

    case "allowAlphanumeric":
      return /^[A-Za-z0-9]+$/.test(value);

    case "noSpecialChar":
      return /^[A-Za-z0-9 ]+$/.test(value);

    case "notEmpty":
      return value?.trim()?.length > 0;
    case "icdCode": {
      if (value === "") return true;

      const v = value.trim().toUpperCase();
      return /^[A-Z][A-Z0-9]{0,6}(\.[A-Z0-9]{0,4})?$/.test(v);
    }

    default:
      return true;
  }
};

const lightColors = [
  "#1B1B1B",
  "#2C3E50",
  "#3B3B98",
  "#2E4053",
  "#512E5F",
  "#4A235A",
  "#154360",
  "#1C2833",
  "#212F3D",
  "#424949",
  "#7B241C",
  "#641E16",
  "#873600",
  "#784212",
  "#4D5656",
  "#17202A",
  "#1A5276",
  "#0E6655",
  "#145A32",
  "#186A3B",
];

export const stringToColour = (str) => {
  if (!str) return lightColors[0];

  let hash = 0;
  str.split("").forEach((char) => {
    hash = char.charCodeAt(0) + ((hash << 5) - hash);
  });

  // Pick from the 20 colors deterministically
  let index = Math.abs(hash) % lightColors.length;
  let colour = lightColors[index];

  // Special overrides
  if (str.toLowerCase() === "plan") {
    colour = "#7e00ff";
  }
  if (str.toLowerCase() === "examination") {
    colour = "#9eb875";
  }
  if (["assessments", "assessment"].includes(str.toLowerCase())) {
    colour = "#f1a113";
  }

  return colour;
};

export const capitalizeFirstLetter = (string) => {
  const formattedString = string?.toLowerCase();
  return formattedString?.charAt(0)?.toUpperCase() + formattedString?.slice(1);
};

export function formatDate(dateString) {
  const date = new Date(dateString);
  const month = date.toLocaleString("default", { month: "short" });
  const day = date.getDate();
  return month + day;
}

export const formatDateLabel = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString("default", { month: "short" }) + date.getDate();
};

export function formatValues(values, dates) {
  const formatobj = {};

  if (Array.isArray(values)) {
    values.forEach((obj) => {
      const key = Object.keys(obj)[0];
      const formattedKey = formatDate(key);
      formatobj[formattedKey] = obj[key];
    });
  } else if (values && typeof values === "object") {
    Object.keys(values).forEach((key) => {
      const formattedKey = formatDate(key);
      formatobj[formattedKey] = values[key];
    });
  }
  let resultArray = [];
  if (dates?.length === 1) {
    const singleDate = dates[0];
    const nextDate = new Date(singleDate);
    nextDate.setDate(nextDate.getDate() + 1);
    const currentFormatted = formatDate(singleDate);
    const nextFormatted = formatDate(nextDate);

    resultArray = [
      formatobj[currentFormatted] || 0,
      formatobj[nextFormatted] || 0,
    ];
  } else {
    resultArray = dates?.map((date) => formatobj[formatDate(date)] || 0);
  }

  return resultArray;
}

export const getColorValue = (key) => {
  switch (key) {
    case "primary":
    case "1":
      return "#03512E";
    case "secondary":
    case "2":
      return "#87d068";
    case "secondary2":
    case "3":
      return "#02854A";
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

export function getLast30Days() {
  const date_thirty_days = [];
  const currentDate = new Date();

  for (let i = 0; i < 30; i++) {
    const pastDate = new Date(currentDate);
    pastDate.setDate(currentDate.getDate() - i);
    date_thirty_days.push(
      pastDate.toLocaleString("default", { month: "short" }) +
      pastDate.getDate(),
    );
  }

  return date_thirty_days.reverse();
}

export function getLast7Days() {
  const date_seven_days = [];
  const currentDate = new Date();

  for (let i = 0; i < 7; i++) {
    const pastDate = new Date(currentDate);
    pastDate.setDate(currentDate.getDate() - i);
    date_seven_days.push(
      pastDate.toLocaleString("default", { month: "short" }) +
      pastDate.getDate(),
    );
  }

  return date_seven_days.reverse();
}

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

export const getStatusColor = (key) => {
  switch (key) {
    case "1": // allocated
      return "#03512E";
    case "2": //Not Allocated
      return "#02854A";
    case "3": //Completed
      return "#9CFAD0";
    case "4": //InProgress
      return "#006DDC";
    case "5": //Reassigned
      return "#008FCA";
    // case "secondary5":
    // case "6":
    //   return "#0A5EB0";
    // case "secondary6":
    // case "7":
    //   return "#8576FF";
    default:
      return null;
  }
};

export const statusFormate = (status) => {
  return typeof status == "string"
    ? status?.replace(/([a-z](?=[A-Z]))/g, "$1 ")
    : status;
};

export const truncateString = (str, num) => {
  if (str?.length > num) {
    return str?.slice(0, num) + "...";
  }
  return str;
};

export const toFixedNum = (value, precision = 2) => {
  return typeof value === "number" ? parseFloat(value?.toFixed(precision)) : 0;
};

export const parseKValue = (val) => {
  if (typeof val === "string") {
    const num = parseFloat(val);
    if (val.toUpperCase().includes("K")) return num * 1_000;
    if (val.toUpperCase().includes("M")) return num * 1_000_000;
    if (val.toUpperCase().includes("B")) return num * 1_000_000_000;
    return num;
  }
  return typeof val === "number" ? val : 0;
};

export const formatKValue = (val) => {
  if (typeof val !== "number" || isNaN(val)) return "0";

  if (val >= 1_000_000_000) return (val / 1_000_000_000).toFixed(1) + "B";
  if (val >= 1_000_000) return (val / 1_000_000).toFixed(1) + "M";
  if (val >= 1_000) return (val / 1_000).toFixed(1) + "K";
  return val.toFixed(0);
};

export const getChartTimeLine = (obj, plotConfig) => {
  const { key, value } = plotConfig;
  const tempObj = {};
  if (obj) {
    for (const i of obj) {
      tempObj[i[key]] = toFixedNum(i[value], 2);
    }
  }
  return tempObj;
};
