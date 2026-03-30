import { getStorage } from "@/util/storage";
import { requestPortal } from "@/util/network";

// Generic API caller with flexible query support
export async function fetchFromEndpoint({ endpoint, params = {} }: { endpoint: string; params?: Record<string, any> }) {
  const orgId = getStorage("orgId") || "";

  const queryParams: Record<string, string> = {
    organizationId: orgId,
  };

  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      queryParams[key] = String(value);
    }
  });

  const query = new URLSearchParams(queryParams);
  const decodedQuery = decodeURIComponent(query.toString());

  const url = `dbservice/${endpoint}?${decodedQuery}`;

  const options = {
    method: "GET", // can be made dynamic if needed
  };

  const data = await requestPortal(url, options);
  return data;
}

export async function fetchFromEndpointPost({ endpoint, params = {} }: { endpoint: string; params?: Record<string, any> }) {
  const url = `dbservice/${endpoint}`;
  const options = {
    method: "POST",
    body: JSON.stringify(params),
  };

  const data = await requestPortal(url, options);
  return data;
}
