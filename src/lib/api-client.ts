import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../store/auth-store';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

interface RetryConfig extends AxiosRequestConfig {
  _retryCount?: number;
}

// 1. Create Axios Instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Request Interceptor: Attach Authorization Token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Configuration for Retrying Failed Requests
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

// Helper to determine if an error is retriable (network error, timeout, or 5xx server errors)
const isRetriableError = (error: AxiosError): boolean => {
  if (!error.response) {
    return true;
  }
  if (error.code === 'ECONNABORTED') {
    return true;
  }
  const status = error.response.status;
  return status >= 500 && status <= 599;
};

// 3. Response Interceptor: Handle Retries, Token Expiry, and Error Mapping
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetryConfig;

    if (!config) {
      return Promise.reject(error);
    }

    config._retryCount = config._retryCount ?? 0;

    if (isRetriableError(error) && config._retryCount < MAX_RETRIES) {
      config._retryCount += 1;
      const backoffDelay = RETRY_DELAY_MS * Math.pow(2, config._retryCount - 1);
      console.log(`[API Client] Retrying request (${config._retryCount}/${MAX_RETRIES}) in ${backoffDelay}ms: ${config.url}`);
      
      await new Promise((resolve) => setTimeout(resolve, backoffDelay));
      return apiClient(config);
    }

    if (error.response?.status === 401) {
      console.warn('[API Client] 401 Unauthorized detected. Logging out user.');
      useAuthStore.getState().logout();
    }

    let friendlyMessage = 'An unexpected error occurred. Please try again.';
    
    if (error.code === 'ECONNABORTED') {
      friendlyMessage = 'Connection timed out. Please check if your backend server is running.';
    } else if (!error.response) {
      friendlyMessage = 'Network connection failed. Please check your internet connection.';
    } else if (error.response.data && typeof error.response.data === 'object') {
      const data = error.response.data as any;
      if (typeof data.message === 'string') {
        friendlyMessage = data.message;
      } else if (Array.isArray(data.message)) {
        friendlyMessage = data.message.join(', ');
      } else if (typeof data.error === 'string') {
        friendlyMessage = data.error;
      }
    }

    const customError = new Error(friendlyMessage);
    (customError as any).status = error.response?.status;
    (customError as any).originalError = error;

    return Promise.reject(customError);
  }
);
