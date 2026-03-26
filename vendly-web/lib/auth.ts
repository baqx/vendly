import { apiForm } from "./api";
import { clearToken, setToken } from "./auth-store";

export type LoginResponse = {
  access_token: string;
  token_type: string;
};

export async function login(username: string, password: string) {
  const form = new FormData();
  form.append("username", username);
  form.append("password", password);
  const data = await apiForm<LoginResponse>("/auth/login", "POST", form);
  if (!data?.access_token) {
    throw new Error("Login failed. Missing access token.");
  }
  setToken(data.access_token);
  return data;
}

export function logout() {
  clearToken();
}
