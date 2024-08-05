import { UpdateUserDTO } from "../dtos/user/update-user-dto.dto";
import { User } from "../entities/user";

export interface UserRepository {
  getUserById(id: string): Promise<User | null>;
  getAllUsers(
    itemsPerPage: number,
    page: number,
    search: string
  ): Promise<{ data: User[]; total: number }>;
  createUser(user: User): Promise<User | null>;
  loginAdmin({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<User | null>;
  loginEmployee({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<User | null>;
  getUserByEmail({ email }: { email: string }): Promise<User | null>;

  updateUser(user: UpdateUserDTO): Promise<User | null>;
  deleteUser(id: string): Promise<User | null>;
}
