import CryptoJS from "crypto-js";
import { removeSpecialChars } from "../formatting";
import { message } from "antd";
import { setStorage, removeStorage } from "@/util/storage";
import { tokenKey, salt, isEncrypted } from "@/util/config";
import Swal from "sweetalert2";

const defaultHeaders = {
  "Content-Type": "application/json",
  "User-Agent": removeSpecialChars(navigator.userAgent),
};

export const setHeaders = async () => {
  return { ...defaultHeaders };
};

let sessionExpired = false;

function decryptData(encryptedData, key, iv) {
  try {
    encryptedData = CryptoJS.enc.Base64.parse(encryptedData);
    const keyUtf8 = CryptoJS.enc.Utf8.parse(key);
    const ivUtf8 = CryptoJS.enc.Utf8.parse("Ne8ZXeHhilLBuAcW");

    const dec111 = CryptoJS.AES.decrypt(
      { ciphertext: encryptedData },
      keyUtf8,
      {
        iv: ivUtf8,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );
    const decryptedText = dec111.toString(CryptoJS.enc.Utf8);
    return decryptedText.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error("Decryption error:", error);
    return null;
  }
}

export async function checkStatus(response) {
  setStorage("loginCheck", false);

  const showModal = async (
    message,
    buttonText = "Back",
    showCloseButton = true,
    clearStorage = false,
    showSendMailButton = true
  ) => {
    try {
      if (showCloseButton) appendCloseButtonStyle();

      const result = await Swal.fire({
        title: "",
        text: message,
        icon: "warning",
        confirmButtonText: buttonText,
        confirmButtonColor: "#DD6B55",
        showDenyButton: showSendMailButton,
        denyButtonText: showSendMailButton ? `Send Mail` : "",
        denyButtonColor: "rgb(59, 130, 246)",
        showCloseButton,
      });

      if (result.isConfirmed && clearStorage) {
        removeStorage();
        window.location = "/login";
      } else if (
        result.isDenied &&
        (response?.status === 500 ||
          response?.status === 502 ||
          response?.status === 512)
      ) {
        try {
          Swal.fire({
            title: "Sending Email...",
            text: "Please wait while we notify the admin.",
            icon: "info",
            showConfirmButton: false,
            willOpen: () => Swal.showLoading(),
          });

          const res = await exceptionMail({
            obj: {
              exceptionMessage: "Error occurring.",
              exceptionSubject: "Error in DB",
              stackTrace: "Stack trace details go here.",
              subject: "Exception Email",
              exceptionMailServiceEnum: "DB",
            },
          });

          if (res?.status === "SUCCESS") {
            Swal.fire({
              title: "Success!",
              text: "The admin has been notified via email.",
              icon: "success",
              timer: 3000,
            });
          } else {
            Swal.fire({
              title: "Error",
              text: "Something went wrong while sending the email.",
              icon: "error",
            });
          }
        } catch (error) {
          console.error("Error sending email:", error);
          Swal.fire({
            title: "Error",
            text: "An error occurred while trying to send the email.",
            icon: "error",
          });
        }
      }
    } catch (e) {
      console.error(e, "log error");
    }
  };

  const appendCloseButtonStyle = () => {
    const existingStyle = document.getElementById("swal2-close-style");
    if (!existingStyle) {
      const style = document.createElement("style");
      style.id = "swal2-close-style";
      style.innerHTML = `
        .swal2-close {
          font-size: 32px !important;
          top: 10px !important;
          right: 10px !important;
        }
      `;
      document.head.appendChild(style);
    }
  };

  const handleDecryption = async (data) => {
    try {
      const decrypted = decryptData(
        data,
        salt,
        "Or-F1IjTa]1LiOt30en36,Py6z5Hz^Z="
      );
      return JSON.parse(decrypted);
    } catch (error) {
      console.error("Decryption error:", error);
      throw new Error("Failed to decrypt response data");
    }
  };

  if (!response) return;

  const { status } = response;
  console.log(status, "status");

  switch (status) {
    case 401: {
      if (!sessionExpired) {
        sessionExpired = true;
        await showModal(
          "Your session has timed out. Please log in again.",
          "Logout",
          false,
          true,
          false
        );
      }
      break;
    }
    case 500:
      await showModal(
        "Something went wrong on our end. Please try again later.",
        "Back",
        true,
        false,
        false
      );
      break;
    case 403:
      await showModal(
        "You don't have permission to access this page.",
        "Back",
        true,
        false,
        false
      );
      break;
    case 512:
      await showModal(
        "An error occurred due to unhandled exceptions or unexpected conditions within the system. The admin will be notified by email.",
        "Back",
        true,
        false,
        true
      );
      break;
    default: {
      const data =
        isEncrypted === "true" ? await response.text() : await response.json();

      if (isEncrypted === "true") {
        return await handleDecryption(data);
      } else {
        if (data.logout) {
          await removeStorage(tokenKey);
          window.open("/", "_self");
          return;
        }
        if (status !== 200) {
          throw { ...data };
        }
        return data;
      }
    }
  }
}
