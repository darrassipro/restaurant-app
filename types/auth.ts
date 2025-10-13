export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'admin' | 'manager' | 'chef' | 'customer';
  isActive: boolean;
  createdAt: string;
}

export interface LoginRequest {
  email?: string;
  phone?: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: 'customer';
}

export interface OtpVerification {
  identifier: string;
  otp: string;
  userData?: any;
  type?: 'registration' | 'login' | 'password_reset';
}

export interface AuthResponse {
  status: boolean;
  message: string;
  user?: User;
  token?: string;
  requiresOTP?: boolean;
  identifier?: string;
  userData?: any;
}