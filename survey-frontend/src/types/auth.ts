export interface AuthData {
  username: string;
  password: string;
  role?: string;
}

export interface AuthResponse {
  id: string;
  role: string;
}

export interface AuthError {
  message: string;
}
