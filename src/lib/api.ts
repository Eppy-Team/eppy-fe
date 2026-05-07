const BASE_URL = "http://54.251.135.49:3000/api/v1";

// ==================== TOKEN ====================
export const setToken = (token: string) => {
  localStorage.setItem("eppy_token", token);
};

export const getToken = () => {
  return localStorage.getItem("eppy_token");
};

export const removeToken = () => {
  localStorage.removeItem("eppy_token");
};

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

// ==================== AUTH ====================
export const login = async (email: string, password: string) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Login gagal");
  return data;
};

export const register = async (name: string, email: string, password: string) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Register gagal");
  return data;
};

// ==================== CHATBOT ====================
export const createConversation = async (title: string) => {
  const res = await fetch(`${BASE_URL}/conversations`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ title }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal membuat percakapan");
  return data;
};

export const getAllConversations = async () => {
  const res = await fetch(`${BASE_URL}/conversations`, {
    method: "GET",
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal mengambil percakapan");
  return data;
};

export const getDetailConversation = async (conversationId: string) => {
  const res = await fetch(`${BASE_URL}/conversations/${conversationId}/messages`, {
    method: "GET",
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal mengambil detail percakapan");
  return data;
};

export const sendChat = async (conversationId: string, content: string, image?: File) => {
  const formData = new FormData();
  formData.append("content", content);
  if (image) formData.append("image", image);

  const res = await fetch(`${BASE_URL}/conversations/${conversationId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal mengirim pesan");
  return data;
};

// ==================== KNOWLEDGE BASE ====================
export const createKnowledge = async (title: string, category: string, file: File) => {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("category", category);
  formData.append("file", file);

  const res = await fetch(`${BASE_URL}/knowledge`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal membuat knowledge");
  return data;
};

export const getAllKnowledges = async () => {
  const res = await fetch(`${BASE_URL}/knowledge`, {
    method: "GET",
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal mengambil knowledge");
  return data;
};

export const getDetailKnowledge = async (knowledgeId: string) => {
  const res = await fetch(`${BASE_URL}/knowledge/${knowledgeId}`, {
    method: "GET",
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal mengambil detail knowledge");
  return data;
};

export const deleteKnowledge = async (knowledgeId: string) => {
  const res = await fetch(`${BASE_URL}/knowledge/${knowledgeId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (res.status === 204) return { status: "success" };
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal menghapus knowledge");
  return data;
};