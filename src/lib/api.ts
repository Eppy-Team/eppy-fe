const BASE_URL = "https://api-eppy.my.id/api/v1";

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

export const sendChat = async (conversationId: string, content: string) => {
  const res = await fetch(`${BASE_URL}/conversations/${conversationId}/messages`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ content }),
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

// ==================== TICKET (USER) ====================
export const createTicket = async (title: string, description: string, category: string, conversationId?: string, messageId?: string) => {
  const res = await fetch(`${BASE_URL}/tickets/`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ title, description, category, conversationId, messageId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal membuat tiket");
  return data;
};

export const getAllTickets = async (page = 1, limit = 10) => {
  const res = await fetch(`${BASE_URL}/tickets/?page=${page}&limit=${limit}`, {
    method: "GET",
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal mengambil tiket");
  return data;
};

export const getDetailTicket = async (ticketId: string) => {
  const res = await fetch(`${BASE_URL}/tickets/${ticketId}`, {
    method: "GET",
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal mengambil detail tiket");
  return data;
};

// ==================== TICKET (ADMIN) ====================
export const getAllTicketsAdmin = async (page = 1, limit = 10) => {
  const res = await fetch(`${BASE_URL}/tickets/admin/all?page=${page}&limit=${limit}`, {
    method: "GET",
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal mengambil tiket admin");
  return data;
};

export const getDetailTicketAdmin = async (ticketId: string) => {
  const res = await fetch(`${BASE_URL}/tickets/admin/${ticketId}`, {
    method: "GET",
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal mengambil detail tiket admin");
  return data;
};

export const updateTicketStatus = async (ticketId: string, status: string) => {
  const res = await fetch(`${BASE_URL}/tickets/admin/${ticketId}/status`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ status }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal update status tiket");
  return data;
};

export const respondTicket = async (ticketId: string, adminResponse: string) => {
  const res = await fetch(`${BASE_URL}/tickets/admin/${ticketId}/respond`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ adminResponse }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal mengirim respons tiket");
  return data;
};