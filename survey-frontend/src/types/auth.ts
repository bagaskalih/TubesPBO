export interface AuthData {
  username: string;
  password: string;
  role?: string;
}

export interface AuthResponse {
  token: string;
}
