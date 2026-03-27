import { getToken } from "./auth-store";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";

export type ApiWrapper<T> = {
  success: boolean;
  message?: string;
  data?: T;
  error?: unknown;
};

function isWrapper<T>(value: unknown): value is ApiWrapper<T> {
  if (!value || typeof value !== "object") return false;
  return "success" in value && "data" in value;
}

async function parseJson(response: Response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function normalizeError(data: any, fallback: string) {
  if (!data) return fallback;
  if (typeof data === "string") return data;
  if (data.detail) return data.detail;
  if (data.message) return data.message;
  if (data.error) return data.error;
  return fallback;
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
  const headers = new Headers(options.headers);
  const token = getToken();
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const body = options.body;
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  if (!isFormData && body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, { ...options, headers });
  const data = await parseJson(response);

  if (!response.ok) {
    const message = normalizeError(data, response.statusText || "Request failed");
    throw new Error(message);
  }

  if (isWrapper<T>(data)) {
    return (data.data ?? null) as T;
  }

  return data as T;
}

export async function apiJson<T>(
  path: string,
  method: string,
  payload?: unknown,
  options: RequestInit = {}
) {
  return apiRequest<T>(path, {
    ...options,
    method,
    body: payload === undefined ? undefined : JSON.stringify(payload),
  });
}

export async function apiForm<T>(path: string, method: string, form: FormData) {
  return apiRequest<T>(path, { method, body: form });
}

export function buildQuery(params: Record<string, string | number | undefined>) {
  const query = Object.entries(params)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join("&");
  return query ? `?${query}` : "";
}
