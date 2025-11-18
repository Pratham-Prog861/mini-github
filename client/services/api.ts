const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getAuthToken = () => localStorage.getItem("auth_token");

const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
};

export const authAPI = {
  register: (username: string, email: string, password: string) =>
    apiCall("/auth/register", {
      method: "POST",
      body: JSON.stringify({ username, email, password }),
    }),

  login: (email: string, password: string) =>
    apiCall("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
};

export const repoAPI = {
  create: (name: string, description: string, isPrivate: boolean) =>
    apiCall("/repositories", {
      method: "POST",
      body: JSON.stringify({ name, description, isPrivate }),
    }),

  list: () => apiCall("/repositories"),

  get: (username: string, reponame: string) =>
    apiCall(`/repositories/${username}/${reponame}`),

  star: (username: string, reponame: string) =>
    apiCall(`/repositories/${username}/${reponame}/star`, { method: "POST" }),

  unstar: (username: string, reponame: string) =>
    apiCall(`/repositories/${username}/${reponame}/star`, { method: "DELETE" }),

  delete: (username: string, reponame: string) =>
    apiCall(`/repositories/${username}/${reponame}`, { method: "DELETE" }),
};

export const userAPI = {
  getProfile: () => apiCall("/users/profile"),

  getUser: (username: string) => apiCall(`/users/${username}`),

  follow: (username: string) =>
    apiCall(`/users/${username}/follow`, { method: "POST" }),

  unfollow: (username: string) =>
    apiCall(`/users/${username}/follow`, { method: "DELETE" }),
};

export const notificationAPI = {
  list: () => apiCall("/notifications"),

  markAsRead: (id: string) =>
    apiCall(`/notifications/${id}/read`, { method: "PATCH" }),

  markAllAsRead: () => apiCall("/notifications/read-all", { method: "PATCH" }),
};

export const fileAPI = {
  upload: (
    username: string,
    reponame: string,
    path: string,
    name: string,
    content: string
  ) =>
    apiCall(`/files/${username}/${reponame}/files`, {
      method: "POST",
      body: JSON.stringify({ path, name, content }),
    }),

  list: (username: string, reponame: string) =>
    apiCall(`/files/${username}/${reponame}/files`),

  get: (username: string, reponame: string, filePath: string) =>
    apiCall(`/files/${username}/${reponame}/files/${filePath}`),
};
