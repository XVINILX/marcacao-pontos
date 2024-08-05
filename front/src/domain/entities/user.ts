export type UserType = "admin" | "employee";

export interface User {
  id?: string;
  name: string;
  email: string;
  userType: UserType;
  cellphone: string;
  loginIdentification?: string | null;
}

export interface AdminLogin {
  email: string;
  password: string;
}

export interface EmployeeLogin {
  loginIdentification: string;
}

export interface CreateUser {
  name: string;
  email: string;
  cellphone: string;
}

export interface ListUsers {
  data: User[];
  total: number;
}
