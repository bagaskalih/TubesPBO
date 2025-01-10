export interface AuthData {
  username: string;
  password: string;
  role?: string;
}

export interface AuthResponse {
  id: string;
  username: string;
  role: string;
  token?: string;
  message?: string;
}

export interface AuthError {
  message: string;
}
