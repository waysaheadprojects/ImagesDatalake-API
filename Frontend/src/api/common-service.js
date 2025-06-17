import axios from "axios";

// Create an axios instance
const apiClient = axios.create();

// Add a request interceptor to inject the token if it exists
apiClient.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Common error handler
const handleError = (error) => {
  if (error?.response?.data?.validation_type) {
    return error.response.data;
  }

  return {
    status: false,
    message: error?.message || JSON.stringify(error),
    data: false,
  };
};

// Helper to verify token before each request
const verifyToken = async () => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    window.location.href = "/";
    return false;
  }

  try {
    const response = await apiClient.get(
      "https://images-api.retailopedia.com/verify-token"
    );
    if (response?.data?.valid === true) {
      return true;
    } else {
      window.location.href = "/";
      return false;
    }
  } catch (err) {
    window.location.href = "/";
    return false;
  }
};

export const GET_REQUEST = async (url, params = {}) => {
  if (!(await verifyToken())) return;
  try {
    const response = await apiClient.get(url, { params });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const POST_REQUEST = async (
  url,
  data,
  params = {},
  headers = {},
  skipAuth = false
) => {
  if (!skipAuth && !(await verifyToken())) return;
  try {
    const response = await apiClient.post(url, data, {
      params,
      headers,
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const PUT_REQUEST = async (url, data, params = {}) => {
  if (!(await verifyToken())) return;
  try {
    const response = await apiClient.put(url, data, { params });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const DELETE_REQUEST = async (url, params = {}) => {
  if (!(await verifyToken())) return;
  try {
    const response = await apiClient.delete(url, { params });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};
