import { notification, Tooltip } from "antd";
import momentTimezone from "moment-timezone";
import moment from "moment";
import Image from "next/image";

import { companyDeatils } from "@/util/config";
import { salt } from "@/util/config";
import dayjs from "dayjs";

import { renderUserPrfoileAvatar } from "@/components/layout/appHeader/function";
import { FaTriangleExclamation } from "react-icons/fa6";
import { useEffect, useState } from "react";

export const getResponePopup = (res) => {
  switch (res?.data?.status ? res?.data?.status : res?.status) {
    case "USER_DEFINED_ERROR":
      return notification.warning({
        description: res?.data?.message ? res?.data?.message : res?.message,
        duration: 3,
      });
    case "SUCCESS":
      return notification.success({
        description: res?.data?.message ? res?.data?.message : res?.message,
        duration: 2,
      });
    case "FAILED":
      return notification.error({
        description: res?.data?.message ? res?.data?.message : res?.message,
        duration: 2,
      });
    case "EXCEPTION":
      return notification.error({
        description: res?.data?.message ? res?.data?.message : res?.message,
        duration: 3,
      });
    case "CUSTOM_EXCEPTION":
      return notification.error({
        description: res?.data?.message ? res?.data?.message : res?.message,
        duration: 2,
      });
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
    initializationVector
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
      <div className="flex gap-2">
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
      (key) => obj[key] !== undefined && obj[key] !== null && key != "clientId"
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
    arr2?.some((obj2) => JSON.stringify(obj1) === JSON.stringify(obj2))
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
  allowFuture = false
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
            "header"
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
    lable: value ? item?.[value] : item,
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

export const useWindowWidth = () => {
  const [windowWidth, setWindowWidth] = useState(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);

    // Set initial width
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowWidth;
};

export const formatKValue = (val) => {
  if (typeof val !== "number" || isNaN(val)) return "0";

  if (val >= 1_000_000_000) return (val / 1_000_000_000).toFixed(1) + "B";
  if (val >= 1_000_000) return (val / 1_000_000).toFixed(1) + "M";
  if (val >= 1_000) return (val / 1_000).toFixed(1) + "K";
  return val.toFixed(0);
};

export const getColorValue = (key) => {
  switch (key) {
    case "primary":
    case "1":
      return "#064BAC";
    case "secondary":
    case "2":
      return "#5271FA";
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

export const getFormattedChartData = (rawSeries, chartType) => {
  const categories = rawSeries.map((item) => item.name);
  const values = rawSeries.map((item) => item.value);
  const colors = rawSeries.map((item) => item.color);
  const legendData = rawSeries.map((item) => ({
    ...item,
    itemStyle: { color: item.color || item.itemStyle?.color },
  }));
  const formattedSeries =
    chartType === "bar" || chartType === "line"
      ? [
          {
            name: "Status",
            data: values,
            colorBy: "data",
            itemStyle: {
              color: (params) => colors[params.dataIndex],
            },
          },
        ]
      : rawSeries.map((item) => ({
          ...item,
          itemStyle: { color: item.color },
        }));

  return {
    categories,
    formattedSeries,
    legendData,
    height: chartType === "donut" ? 180 : 220,
  };
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
  if (dates.length === 1) {
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
    resultArray = dates.map((date) => formatobj[formatDate(date)] || 0);
  }

  return resultArray;
}

export const toFixedNum = (value, precision = 2) => {
  return typeof value === "number" ? parseFloat(value?.toFixed(precision)) : 0;
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

export const statusFormate = (status) => {
  return typeof status == "string"
    ? status?.replace(/([a-z](?=[A-Z]))/g, "$1 ")
    : status;
};

