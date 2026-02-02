import { getStorage } from "../../../util/storage";
import { requestPortal } from "../../../util/network";

// Generic API caller with flexible query support
export async function fetchFromEndpoint({ endpoint, params = {} }: { endpoint: string; params?: any }) {
  const orgId = getStorage("orgId");

  const query = new URLSearchParams({
    organizationId: orgId,
    ...params, // merges your custom query params
  });
  const decodedQuery = decodeURIComponent(query.toString());
  // const query = Object.entries({
  //   organizationId: orgId,
  //   ...params,
  // })
  //   .map(([key, value]) => `${key}=${value}`) // No encoding!
  //   .join("&");

  // const url = `dbservice/${endpoint}?${query}`;

  const url = `dbservice/${endpoint}?${decodedQuery.toString()}`;

  const options = {
    method: "GET", // can be made dynamic if needed
  };

  const data = await requestPortal(url, options);
  return data;
}

export async function fetchFromEndpointPost({ endpoint, params = {} }: { endpoint: string; params?: any }) {
  const url = `dbservice/${endpoint}`;
  const options = {
    method: "POST",
    body: JSON.stringify(params),
  };

  const data = await requestPortal(url, options);
  return data;
}
