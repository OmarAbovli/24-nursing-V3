
export interface TestCredentials {
  email: string;
  password: string;
}

export interface AuthFormProps {
  type: "login" | "register";
  userType: "patient" | "nurse";
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData extends LoginFormData {
  confirmPassword: string;
  fullName: string;
  phone: string;
  nationalId?: string;
  acceptTerms: boolean;
}
