import { apiRequest } from "./api";

export type SwrKey = string | [string, RequestInit];

export async function swrFetcher(key: SwrKey) {
  if (Array.isArray(key)) {
    const [path, options] = key;
    return apiRequest(path, options ?? {});
  }
  return apiRequest(key);
}
