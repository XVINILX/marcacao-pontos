import axios, { AxiosInstance } from "axios";
import { parseCookies, setCookie } from "nookies";
const baseURL = process.env.REACT_APP_API_URL;

const axiosInstance: AxiosInstance = axios.create({
  baseURL: baseURL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const cookies = parseCookies();
    const token = cookies.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    console.error("error", error);
    if (error.response && !originalRequest._retry) {
      originalRequest._retry = true;
      const newToken = await refreshAuthToken(); // Implement token refresh logic

      if (newToken) {
        setCookie(null, "token", newToken, {
          maxAge: 30 * 24 * 60 * 60, // Set cookie expiration (30 days in this example)
          path: "/",
        });
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

async function refreshAuthToken(): Promise<string> {
  // Your token refresh logic here
  const cookies = parseCookies();
  const token = cookies.token;
  // Make a request to your backend to get a new token and return it
  return token;
}

export default axiosInstance;
