export interface User {
  id?: number;
  email: string;
  firstName: string;
  lastName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  data: Data;
  timestamp: Date;
}

export interface Data {
  email: string;
  firstName: string;
  lastName: string;
  token: string;
}
