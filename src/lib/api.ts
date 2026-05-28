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

// ⚠️ DIUPDATE: pakai form-data karena ada optional image
export const sendChat = async (conversationId: string, content: string, image?: File) => {
  const formData = new FormData();
  formData.append("content", content);
  if (image) formData.append("file", image);

  const res = await fetch(`${BASE_URL}/conversations/${conversationId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
      // ⚠️ Jangan set Content-Type manual — biarkan browser set boundary untuk form-data
    },
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal mengirim pesan");
  return data;
};

// ⚠️ BARU: Search message
export const searchMessage = async (q: string, page = 1, limit = 10) => {
  const params = new URLSearchParams({
    q,
    page: String(page),
    limit: String(limit),
  });
  const res = await fetch(`${BASE_URL}/conversations/search?${params}`, {
    method: "GET",
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal mencari pesan");
  return data;
};

// ==================== KNOWLEDGE BASE ====================

// ✅ Tidak perlu diubah — sudah benar
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

// ⚠️ DIUPDATE: tambah pagination (page, limit)
export const getAllKnowledges = async (page = 1, limit = 10) => {
  const res = await fetch(`${BASE_URL}/knowledge?page=${page}&limit=${limit}`, {
    method: "GET",
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal mengambil knowledge");
  return data;
};

// ✅ Tidak perlu diubah
export const getDetailKnowledge = async (knowledgeId: string) => {
  const res = await fetch(`${BASE_URL}/knowledge/${knowledgeId}`, {
    method: "GET",
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal mengambil detail knowledge");
  return data;
};

// ✅ Tidak perlu diubah
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
export const createTicket = async (
  title: string,
  description: string,
  category: string,
  conversationId: string,
  messageId: string
) => {
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

// ⚠️ DIUPDATE: field name dari adminResponse → response
export const respondTicket = async (ticketId: string, adminResponse: string) => {
  const res = await fetch(`${BASE_URL}/tickets/admin/${ticketId}/respond`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ response: adminResponse }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal mengirim respons tiket");
  return data;
};

// ==================== DASHBOARD ====================

// ⚠️ BARU: Get chatbot activity statistics
export const getDashboardChatbot = async (page = 1, limit = 10, status?: string, startDate?: string, endDate?: string) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    ...(status ? { status } : {}),
    ...(startDate ? { startDate } : {}),
    ...(endDate ? { endDate } : {}),
  });
  const res = await fetch(`${BASE_URL}/dashboard/chatbot?${params}`, {
    method: "GET",
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal mengambil data dashboard chatbot");
  return data;
};

// ⚠️ BARU: Get ticket statistics
export const getDashboardTicket = async (page = 1, limit = 10, status?: string) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    ...(status ? { status } : {}),
  });
  const res = await fetch(`${BASE_URL}/dashboard/tickets?${params}`, {
    method: "GET",
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal mengambil data dashboard tiket");
  return data;
};

// ⚠️ BARU: Export report JSON format
export const exportReportJSON = async (startDate: string, endDate: string) => {
  const params = new URLSearchParams({ startDate, endDate });
  const res = await fetch(`${BASE_URL}/dashboard/report?${params}`, {
    method: "GET",
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal export laporan JSON");
  return data;
};

// ✅ SUDAH ADA — update parameter name agar konsisten
export const exportReport = async (format: "excel" | "pdf", startDate: string, endDate: string) => {
  const params = new URLSearchParams({ startDate, endDate, format });
  const res = await fetch(`${BASE_URL}/dashboard/report/export?${params}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  if (!res.ok) throw new Error("Gagal export laporan");
  return res.blob();
};

// ⚠️ BARU: Send feedback untuk pesan chatbot
export const sendFeedback = async (conversationId: string, messageId: string, feedback: "HELPFUL" | "NOT_HELPFUL") => {
  const res = await fetch(`${BASE_URL}/conversations/${conversationId}/messages/${messageId}/feedback`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ feedback }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal mengirim feedback");
  return data;
};

// ==================== AUTH ====================
export const forgotPassword = async (email: string) => {
  const res = await fetch(`${BASE_URL}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal mengirim email reset password");
  return data;
};

export const resetPassword = async (token: string, newPassword: string) => {
  const res = await fetch(`${BASE_URL}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, newPassword }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal reset password");
  return data;
};