const TOKEN_KEY = "vendly.access_token";
const AUTH_EVENT = "vendly-auth-change";

let memoryToken: string | null = null;

export function getToken(): string | null {
  if (memoryToken) {
    return memoryToken;
  }
  if (typeof window === "undefined") {
    return null;
  }
  const stored = window.localStorage.getItem(TOKEN_KEY);
  memoryToken = stored;
  return stored;
}

export function setToken(token: string) {
  memoryToken = token;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(TOKEN_KEY, token);
    window.dispatchEvent(new CustomEvent(AUTH_EVENT, { detail: token }));
  }
}

export function clearToken() {
  memoryToken = null;
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(TOKEN_KEY);
    window.dispatchEvent(new CustomEvent(AUTH_EVENT, { detail: null }));
  }
}

export function onAuthChange(handler: (token: string | null) => void) {
  if (typeof window === "undefined") {
    return () => {};
  }
  const listener = (event: Event) => {
    const custom = event as CustomEvent<string | null>;
    handler(custom.detail ?? getToken());
  };
  window.addEventListener(AUTH_EVENT, listener);
  return () => window.removeEventListener(AUTH_EVENT, listener);
}
