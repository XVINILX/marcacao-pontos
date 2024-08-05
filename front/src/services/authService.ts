import {
  LoginAdminDto,
  LoginEmployeeDto,
  LoginResponseDto,
} from "domain/dtos/auth.dto";
import axiosInstance from "utils/axiosInstance";

export const loginAdminDto = async (
  login: LoginAdminDto
): Promise<LoginResponseDto> => {
  const response = await axiosInstance.post(`/auth/admin`, login);
  return response.data;
};

export const loginEmployee = async (
  login: LoginEmployeeDto
): Promise<LoginResponseDto> => {
  const response = await axiosInstance.post("/auth/employee", login);
  return response.data;
};

export const refreshToken = async (): Promise<LoginResponseDto> => {
  const response = await axiosInstance.post("/auth/refresh-token");
  return response.data;
};
