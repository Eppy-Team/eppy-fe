const BASE_URL = "http://13.250.25.77:3000/api";

// Simpan token ke localStorage
export const setToken = (token: string) => {
  localStorage.setItem("eppy_token", token);
};

export const getToken = () => {
  return localStorage.getItem("eppy_token");
};

export const removeToken = () => {
  localStorage.removeItem("eppy_token");
};

// Login
export const login = async (email: string, password: string) => {
  const res = await fetch(`${BASE_URL}/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Login gagal");
  return data;
};

// Register
export const register = async (name: string, email: string, password: string) => {
  const res = await fetch(`${BASE_URL}/v1/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Register gagal");
  return data;
};