export interface AuthUser {
  id: string;
  name: string;
}

export interface LoginPayload {
  name: string;
  password: string;
}

export interface LoginResponse {
  user: AuthUser;
}
