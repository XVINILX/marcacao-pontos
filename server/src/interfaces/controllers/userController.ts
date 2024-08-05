import { UserType } from "@prisma/client";
import { UserService } from "../../application/services/userService";
import { User } from "../../domain/entities/user";
import { IncomingMessage, ServerResponse } from "http";
import { parse } from "url";
import { UpdateUserDTO } from "../../domain/dtos/user/update-user-dto.dto";

export class UserController {
  constructor(private userService: UserService) {}

  async getUser(req: IncomingMessage, res: ServerResponse): Promise<void> {
    const parsedUrl = parse(req.url || "", true);
    const id = parsedUrl.query.id as string;

    if (id) {
      const user = await this.userService.getUserById(id);
      res.statusCode = 200;
      res.end(JSON.stringify(user));
    } else {
      res.statusCode = 400;
      res.end(JSON.stringify({ message: "User ID is required" }));
    }
  }

  async getUserByToken(
    req: IncomingMessage,
    res: ServerResponse
  ): Promise<void> {
    const parsedUrl = parse(req.url || "", true);
    const id = parsedUrl.query.id as string;

    if (id) {
      const user = await this.userService.getUserById(id);
      res.statusCode = 200;
      res.end(JSON.stringify(user));
    } else {
      res.statusCode = 400;
      res.end(JSON.stringify({ message: "User ID is required" }));
    }
  }

  async getAllUsers(req: IncomingMessage, res: ServerResponse): Promise<void> {
    const parsedUrl = parse(req.url || "", true);
    const { itemsPerPage, page, search } = parsedUrl.query;

    const itemsPerPageNumber = parseInt(itemsPerPage as string, 10) || 10; // default to 10 if not provided
    const pageNumber = parseInt(page as string, 10) || 1; // default to 1 if not provided
    const searchQuery = search as string;

    const users = await this.userService.getAllUsers(
      itemsPerPageNumber,
      pageNumber,
      searchQuery
    );

    res.statusCode = 200;
    res.end(JSON.stringify(users));
  }

  async createUser(req: IncomingMessage, res: ServerResponse): Promise<void> {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      const parsedBody = JSON.parse(body);

      const { id, name, email, password, loginIdentification, cellphone } =
        parsedBody;

      const userType = UserType["employee"];
      const user = new User(
        name,
        email,
        cellphone,
        userType,
        loginIdentification
      );

      await this.userService.createUser(user);
      res.statusCode = 201;
      res.end(JSON.stringify(user));
    });
  }

  async updateUser(req: IncomingMessage, res: ServerResponse): Promise<void> {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      const { id, name, email, cellphone } = JSON.parse(body);
      const user = new UpdateUserDTO(id, name, email, cellphone);

      if (user.id) {
        await this.userService.updateUser(user);
        res.statusCode = 200;
        res.end(JSON.stringify(user));
      }
    });
  }

  async deleteUser(req: IncomingMessage, res: ServerResponse): Promise<void> {
    const parsedUrl = parse(req.url || "", true);
    const id = parsedUrl.query.id as string;

    if (id) {
      await this.userService.deleteUser(id);
      res.statusCode = 200;
      res.end(JSON.stringify({ message: "User deleted" }));
    } else {
      res.statusCode = 400;
      res.end(JSON.stringify({ message: "User ID is required" }));
    }
  }
}
