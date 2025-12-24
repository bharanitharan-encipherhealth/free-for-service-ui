import CryptoJS from "crypto-js";
import { salt, isEncrypted } from "@/util/config";

const secretKey = salt;
const hashKey = (key) => CryptoJS.SHA256(key).toString();

// in-memory mapping (not persisted)``
const keyMap = {};

// ----- getStorage -----
export const getStorage = (key) => {
  try {
    if (
      typeof window === "undefined" ||
      typeof sessionStorage === "undefined"
    ) {
      return null;
    }
    if (isEncrypted == "true") {
      const hashedKey = hashKey(key);
      const encryptedValue = sessionStorage.getItem(hashedKey);
      if (!encryptedValue) return null;
      const decryptedBytes = CryptoJS.AES.decrypt(encryptedValue, secretKey);
      const decryptedValue = decryptedBytes.toString(CryptoJS.enc.Utf8);
      return decryptedValue;
    } else {
      const value = sessionStorage.getItem(key);
      return value;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

// ----- setStorage -----
export const setStorage = (key, value) => {
  try {
    if (isEncrypted === "true") {
      const hashedKey = hashKey(key);
      const stringValue =
        typeof value === "string" ? value : JSON.stringify(value);

      const encryptedValue = CryptoJS.AES.encrypt(
        stringValue,
        secretKey
      ).toString();

      sessionStorage.setItem(hashedKey, encryptedValue);

      // keep mapping only in memory
      keyMap[hashedKey] = key;

      return Promise.resolve();
    } else {
      const stringValue =
        typeof value === "string" ? value : JSON.stringify(value);
      sessionStorage.setItem(key, stringValue);
      return Promise.resolve();
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

// ----- removeStorage -----
export const removeStorage = (key) => {
  try {
    if (key) {
      if (isEncrypted === "true") {
        const hashedKey = hashKey(key);
        sessionStorage.removeItem(hashedKey);
        delete keyMap[hashedKey]; // clean in-memory mapping
        return Promise.resolve();
      } else {
        sessionStorage.removeItem(key);
        return Promise.resolve();
      }
    } else {
      sessionStorage.clear();
      for (const k in keyMap) delete keyMap[k];
      return Promise.resolve();
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

// ----- getLocalStored -----
export const getLocalStored = () => {
  const allSessionStorage = {};
  try {
    if (
      typeof window !== "undefined" &&
      typeof sessionStorage !== "undefined"
    ) {
      for (let i = 0; i < sessionStorage.length; i++) {
        const storedKey = sessionStorage.key(i);
        const storedValue = sessionStorage.getItem(storedKey);
        const hashedKey = hashKey(storedKey);
        let originalKey = keyMap[storedKey] || storedKey; // fall back to hashed key

        if (isEncrypted === "true") {
          const decryptedBytes = CryptoJS.AES.decrypt(storedValue, secretKey);
          const decryptedValue = decryptedBytes.toString(CryptoJS.enc.Utf8);
          //  console.log("testings", hashedKey, storedKey, originalKey);
          try {
            allSessionStorage[originalKey] = JSON.parse(decryptedValue);
          } catch {
            allSessionStorage[originalKey] = decryptedValue || null;
          }
        } else {
          try {
            allSessionStorage[originalKey] = JSON.parse(storedValue);
          } catch {
            allSessionStorage[originalKey] = storedValue;
          }
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
  return allSessionStorage;
};
