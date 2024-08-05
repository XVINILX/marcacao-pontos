import { User } from "../../domain/entities/user";
import { comparePassword } from "../../utils/comparePass";
import jwt from "jsonwebtoken";
import { UserRepositoryImpl } from "../../infrastructure/repositories/userRepositoryImpl";
import hashPassword from "../../utils/hashPassword";
import { generateRandomPassword } from "../../utils/generateRandomPassort";
import { AdminLoginDTO } from "../../domain/dtos/user/login-admin.dto";
import { UpdateUserDTO } from "../../domain/dtos/user/update-user-dto.dto";

export class UserService {
  constructor(private userRepository: UserRepositoryImpl) {}
  private SECRETKEY = process.env.SECRETKEY ?? "";

  async getAllUsers(
    itemsPerPage: number,
    page: number,
    search: string
  ): Promise<{ data: User[]; total: number }> {
    return this.userRepository.getAllUsers(itemsPerPage, page, search);
  }

  async getUserById(id: string): Promise<User | null> {
    return this.userRepository.getUserById(id);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.getUserByEmail({ email });
  }

  async getUserByUserIdentification(
    loginIdentification: string
  ): Promise<User | null> {
    return this.userRepository.getUserByUserIdentification(loginIdentification);
  }

  async createToken(user: User) {
    const SECRET_KEY = this.SECRETKEY;

    return {
      access_token: jwt.sign(
        { sub: user.id, loginIdentification: user.loginIdentification },
        SECRET_KEY,
        { expiresIn: "1h" }
      ),
    };
  }

  async checkToken(token: string): Promise<User | null> {
    try {
      const finalToken = token.startsWith("Bearer ") ? token.slice(7) : token;

      const decoded = jwt.verify(finalToken, this.SECRETKEY) as jwt.JwtPayload;

      const userId = decoded.sub;

      if (userId) {
        const userExists = await this.getUserById(userId);
        return userExists ? userExists : null;
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  async refreshToken(token: string): Promise<AdminLoginDTO | null> {
    const user = await this.checkToken(token);

    if (user) {
      const newToken = await this.createToken(user);
      return <AdminLoginDTO>{
        id: user.id,
        email: user.email,
        token: newToken.access_token,
        userType: user.userType,
      };
    }

    return null;
  }

  async login(email: string, password: string): Promise<AdminLoginDTO | null> {
    const user = await this.userRepository.getUserByEmail({ email: email });
    if (user) {
      const comparePass = await comparePassword(password, user.password);

      if (comparePass) {
        const jwtToken = await this.createToken(user);

        return <AdminLoginDTO>{
          email: user.email,
          id: user.id,
          token: jwtToken.access_token,
          userType: user.userType,
        };
      }
    }

    return null;
  }

  async loginEmployee(
    loginIdentification: string
  ): Promise<AdminLoginDTO | null> {
    const user = await this.userRepository.getUserByUserIdentification(
      loginIdentification
    );

    if (user) {
      const jwtToken = await this.createToken(user);

      return <AdminLoginDTO>{
        email: user.email,
        id: user.id,
        token: jwtToken.access_token,
        userType: user.userType,
      };
    }

    return null;
  }

  async createUser(user: User): Promise<User | null> {
    let userIdIdentification = "";
    let containsUserWithIdentification = false;

    while (!containsUserWithIdentification) {
      const userQuery = await this.getUserByUserIdentification(
        userIdIdentification
      );
      if (!userQuery) {
        let password = user.password;
        if (password) {
          password = await hashPassword(password);
          user.password = password;
        } else {
          password = generateRandomPassword();
          password = await hashPassword(password);
          user.password = password;
        }
        user.loginIdentification = generateRandomPassword();

        containsUserWithIdentification = true;
        return this.userRepository.createUser(user);
      }
    }

    return user;
  }

  async updateUser(user: UpdateUserDTO): Promise<User | null> {
    return this.userRepository.updateUser(user);
  }

  async deleteUser(id: string): Promise<User | null> {
    return this.userRepository.deleteUser(id);
  }
}
