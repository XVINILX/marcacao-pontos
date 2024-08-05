import axiosInstance from "../utils/axiosInstance";
import { CreateUser, ListUsers, User } from "../domain/entities/user";

export const getAllUsers = async (
  itemsPerPage: number,
  page: number,
  search: string
): Promise<ListUsers> => {
  const response = await axiosInstance.get("/users/list", {
    params: { itemsPerPage, page, search },
  });
  return response.data;
};

export const getUserById = async (id: string): Promise<User> => {
  const response = await axiosInstance.get(`/users?id=${id}`);
  return response.data;
};

export const createUser = async (user: CreateUser): Promise<CreateUser> => {
  const response = await axiosInstance.post("/users", user);
  return response.data;
};

export const updateUser = async (user: Partial<User>): Promise<User> => {
  const response = await axiosInstance.put(`/users/${user.id}`, user);
  return response.data;
};

export const deleteUser = async (id: string): Promise<User> => {
  const response = await axiosInstance.delete(`/users/${id}`);
  return response.data;
};
