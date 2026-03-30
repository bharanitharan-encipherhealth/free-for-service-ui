import { requestPortal } from "@/util/network";

export async function fetchFromEndpoint(endpoint: string, params: any) {
  const query = new URLSearchParams(params).toString();
  return requestPortal(`${endpoint}?${query}`, { method: "GET" });
}

export async function fetchFromEndpointPost(endpoint: string, body: any) {
  return requestPortal(endpoint, {
    method: "POST",
    body: JSON.stringify(body),
  });
}
