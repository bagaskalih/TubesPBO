import axios from "axios";
import { AuthData, AuthResponse } from "@/types/auth";

const API_URL = "http://localhost:8081/api/auth";

export const register = async (data: AuthData): Promise<void> => {
  await axios.post(`${API_URL}/register`, data);
};

export const login = async (data: AuthData): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>(`${API_URL}/login`, data);
    console.log("Login response:", response.data);

    if (response.data) {
      // Check both token and message fields since the backend might use either
      const token = response.data.token || response.data.message;
      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("role", response.data.role);
        localStorage.setItem("username", response.data.username);
        localStorage.setItem("id", response.data.id.toString());
      } else {
        console.error("No token found in response:", response.data);
      }
    }
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};
