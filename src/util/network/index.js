import { checkStatus } from "./helper";
import { getStorage } from "@/util/storage";
import { portalUrl, tokenKey } from "@/util/config";

export async function requestPortal(url, options) {
  try {
    const orgId = getStorage("orgId");
    const client = getStorage("client");
    const project = getStorage("project");
    const roleId = getStorage("roleId");
    const token = getStorage(tokenKey);

    const actualUrl = `${portalUrl}${url}`;
    const actualOptions = {
      ...options,
      headers: {
        Authorization: `${"Bearer" + " " + token}`,
        "Content-Type": "application/json",
        "X-Role-Id": roleId,
        "X-Client": client,
        "X-Org": orgId,
        "X-Project": project,
        "X-Org-based": "true",
      },
    };
    return fetch(actualUrl, actualOptions).then(checkStatus);
  } catch (e) {
    console.error(e, "while Calling the requestPortal");
  }
}

export async function authRequestPortal(url, options) {
  const actualUrl = `${portalUrl}${url}`;
  const actualOptions = {
    ...options,
    headers: {
      "Content-Type": "application/json",
    },
  };
  return fetch(actualUrl, actualOptions).then(checkStatus);
}

export async function requestPortalExcel(url, options) {
  const orgId = getStorage("orgId");
  const client = getStorage("client");
  const project = getStorage("project");
  const roleId = getStorage("roleId");
  const token = getStorage(tokenKey);
  const actualUrl = `${portalUrl}${url}`;
  const actualOptions = {
    ...options,
    headers: {
      Authorization: `${"Bearer" + " " + token}`,
      "Content-Type": "application/json",
      "X-Role-Id": roleId,
      "X-Client": client,
      "X-Org": orgId,
      "X-Project": project,
      "X-Org-based": "true",
    },
  };
  return fetch(actualUrl, actualOptions);
}

export async function requestPortalFiles(url, options) {
  try {
    const orgId = getStorage("orgId");
    const client = getStorage("client");
    const project = getStorage("project");
    const roleId = getStorage("roleId");
    const token = getStorage(tokenKey);

    const actualUrl = `${portalUrl}${url}`;
    const actualOptions = {
      ...options,
      headers: {
        Authorization: `${"Bearer" + " " + token}`,
        "X-Role-Id": roleId,
        "X-Client": client,
        "X-Org": orgId,
        "X-Project": project,
        "X-Org-based": "true",
      },
    };
    return fetch(actualUrl, actualOptions).then(checkStatus);
  } catch (e) {
    console.error(e, "while Calling the requestPortalFiles");
  }
}
