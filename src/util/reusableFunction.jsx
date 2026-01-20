import { notification, Tooltip } from "antd";
import momentTimezone from "moment-timezone";
import moment from "moment";
import Image from "next/image";

import { companyDeatils } from "@/util/config";
import { salt } from "@/util/config";
import dayjs from "dayjs";

import { renderUserPrfoileAvatar } from "@/components/layout/appHeader/function";
import { FaTriangleExclamation } from "react-icons/fa6";

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
