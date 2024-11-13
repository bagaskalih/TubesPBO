import axios from "axios";
import { AuthData, AuthResponse } from "@/types/auth";

const API_URL = "http://localhost:8081/api/auth";

export const register = async (data: AuthData): Promise<void> => {
  await axios.post(`${API_URL}/register`, data);
};

export const login = async (data: AuthData): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(`${API_URL}/login`, data);
  return response.data;
};
