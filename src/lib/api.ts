import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor - attach token
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("ecospark_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      const path = window.location.pathname;
      if (!path.includes("/auth")) {
        localStorage.removeItem("ecospark_token");
        localStorage.removeItem("ecospark_user");
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  }
);

// API methods
export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post("/auth/register", data),
  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),
  updateProfile: (data: { name?: string; bio?: string; avatar?: string }) =>
    api.put("/auth/profile", data),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put("/auth/change-password", data),
  googleLogin: (idToken: string) => api.post("/auth/google", { idToken }),
};

export const ideasApi = {
  getAll: (params?: Record<string, string | number | boolean | undefined>) =>
    api.get("/ideas", { params }),
  getBySlug: (slug: string) => api.get(`/ideas/${slug}`),
  getTop: () => api.get("/ideas/top"),
  getMy: (params?: Record<string, string | number | undefined>) =>
    api.get("/ideas/my", { params }),
  create: (data: FormData | Record<string, unknown>) => api.post("/ideas", data),
  update: (id: string, data: Record<string, unknown>) =>
    api.put(`/ideas/${id}`, data),
  delete: (id: string) => api.delete(`/ideas/${id}`),
  submitForReview: (id: string) => api.post(`/ideas/${id}/submit`),
};

export const categoriesApi = {
  getAll: () => api.get("/categories"),
  create: (data: Record<string, unknown>) => api.post("/categories", data),
  update: (id: string, data: Record<string, unknown>) =>
    api.put(`/categories/${id}`, data),
  delete: (id: string) => api.delete(`/categories/${id}`),
};

export const votesApi = {
  vote: (ideaId: string, type: "UPVOTE" | "DOWNVOTE") =>
    api.post(`/votes/${ideaId}`, { type }),
};

export const commentsApi = {
  getByIdea: (ideaId: string) => api.get(`/comments/${ideaId}`),
  create: (ideaId: string, data: { content: string; parentId?: string }) =>
    api.post(`/comments/${ideaId}`, data),
  delete: (id: string) => api.delete(`/comments/${id}`),
};

export const paymentApi = {
  createIntent: (ideaId: string) =>
    api.post("/payment/create-intent", { ideaId }),
  confirmPayment: (paymentIntentId: string, ideaId: string) =>
    api.post("/payment/confirm", { paymentIntentId, ideaId }),
  checkPurchase: (ideaId: string) => api.get(`/payment/check/${ideaId}`),
  getMyPurchases: () => api.get("/payment/purchases"),
};

export const adminApi = {
  getStats: () => api.get("/admin/dashboard"),
  getIdeas: (params?: Record<string, string | number | undefined>) =>
    api.get("/admin/ideas", { params }),
  approveIdea: (id: string) => api.put(`/admin/ideas/${id}/approve`),
  rejectIdea: (id: string, feedback: string) =>
    api.put(`/admin/ideas/${id}/reject`, { feedback }),
  getUsers: (params?: Record<string, string | number | undefined>) =>
    api.get("/admin/users", { params }),
  toggleUserStatus: (id: string) =>
    api.put(`/admin/users/${id}/toggle-status`),
  updateUserRole: (id: string, role: string) =>
    api.put(`/admin/users/${id}/role`, { role }),
};

export const bookmarkApi = {
  toggle: (ideaId: string) => api.post(`/bookmarks/${ideaId}`),
  getAll: () => api.get("/bookmarks"),
  getIds: () => api.get("/bookmarks/ids"),
  check: (ideaId: string) => api.get(`/bookmarks/check/${ideaId}`),
};

export const newsletterApi = {
  subscribe: (email: string) => api.post("/newsletter/subscribe", { email }),
};

export const uploadApi = {
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    return api.post("/upload/image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

export const userApi = {
  getStats: () => api.get("/users/stats"),
};
