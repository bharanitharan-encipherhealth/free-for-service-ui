import { notification } from "antd";

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
