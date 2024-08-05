import { PrismaClient, User as PrismaUser } from "@prisma/client";
import { User } from "../../domain/entities/user";
import { UserRepository } from "../../domain/repositories/userRepository";
import { CreateUserDTO } from "../../domain/dtos/user/create-user-dto.dto";
import { UpdateUserDTO } from "../../domain/dtos/user/update-user-dto.dto";

export class UserRepositoryImpl implements UserRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getAllUsers(
    itemsPerPage: number,
    page: number,
    search: string
  ): Promise<{ data: User[]; total: number }> {
    try {
      const skip = (page - 1) * itemsPerPage;
      const take = itemsPerPage;

      const count = await this.prisma.user.count({
        where: { name: { contains: search || "", mode: "insensitive" } },
      });

      const users = await this.prisma.user.findMany({
        where: { name: { contains: search || "", mode: "insensitive" } },
        skip: skip,
        take: take,
      });

      return { data: users, total: count };
    } catch (err) {
      console.error(err);
      return { data: [], total: 0 };
    }
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      return await this.prisma.user.findUnique({
        where: { id },
      });
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async getUserByUserIdentification(
    loginIdentification: string
  ): Promise<User | null> {
    try {
      return await this.prisma.user.findFirst({
        where: { loginIdentification: loginIdentification },
      });
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async loginAdmin({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<User | null> {
    try {
      return this.prisma.user.findUnique({
        where: { email },
      });
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async getUserByEmail({ email }: { email: string }): Promise<User | null> {
    try {
      return this.prisma.user.findUnique({
        where: { email },
      });
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async loginEmployee({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<User | null> {
    try {
      return this.prisma.user.findUnique({
        where: { email },
      });
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async createUser(user: CreateUserDTO): Promise<User | null> {
    try {
      return this.prisma.user.create({
        data: user,
      });
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async updateUser(user: UpdateUserDTO): Promise<User | null> {
    try {
      const { id, ...data } = user;

      return this.prisma.user.update({
        where: { id: user.id },
        data: data,
      });
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async deleteUser(id: string): Promise<User | null> {
    try {
      return this.prisma.user.delete({
        where: { id },
      });
    } catch (err) {
      console.error(err);
      return null;
    }
  }
}
