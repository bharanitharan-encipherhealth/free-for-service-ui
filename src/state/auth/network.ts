import { authRequestPortal, requestPortal } from "../../util/network";
import { setStorage } from "../../util/storage";
import { getResponePopup } from "../../util/reusableFunction";
import { mfaValidationType } from "./model";

export async function mfaValidation({
  username,
  password,
  route,
}: mfaValidationType) {
  const params = {
    userName: username,
    password: password?.pass,
    passwordIv: password?.iv,
  };
  const options = {
    method: "POST",
    body: JSON.stringify(params),
  };

  const data = await authRequestPortal(
    `securityservice/auth/mfaValidation`,
    options
  );
  const skip = data?.response?.skipEntryAvailable;
  const mfa = data?.response?.mfaIsEnabled;

  if (data?.response) {
    setStorage("userId", username);
    setStorage("password", JSON.stringify(password));
    setStorage("skipEntry", skip);
    setStorage("mfa", mfa);
    route?.push(`/twofactorauthentication/authentication`);
  } else {
    getResponePopup(data);
  }
}

export async function getAllRoles() {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(`dbservice/user/get/user-dropdown`, options);
  return data;
}

export async function getClientId() {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(`dbservice/user/orgid`, options);
  return data;
}

export async function getClientDetails() {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/client/get/client-dropdown`,
    options
  );
  return data;
}

export async function getProjectDetails() {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/project/get/project-dropdown`,
    options
  );
  return data;
}

export async function CurrentUserInfo({ userId }: { userId: string }) {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(
    `dbservice/user/get?userName=${userId}`,
    options
  );
  return data;
}

export async function getAllTinDropdown() {
  const options = {
    method: "GET",
  };
  const data = await requestPortal(`dbservice/tin/get/tin-dropdown`, options);
  return data;
}
