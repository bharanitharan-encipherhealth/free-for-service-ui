import { notification, Tooltip } from "antd";

import { companyDeatils } from "@/util/config";
import { salt } from "@/util/config";
import Image from "next/image";
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
