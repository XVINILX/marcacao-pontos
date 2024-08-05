import { UserService } from "../../application/services/userService";
import { UserRepositoryImpl } from "../../infrastructure/repositories/userRepositoryImpl";
import { UserController } from "../controllers/userController";
import { IncomingMessage, ServerResponse } from "http";

const userController = new UserController(
  new UserService(new UserRepositoryImpl())
);

export const userRoutes = async (
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> => {
  const { method, url } = req;

  if (url?.startsWith("/users")) {
    switch (method) {
      case "GET":
        if (url.includes("/users/list")) {
          await userController.getAllUsers(req, res);
        } else {
          await userController.getUser(req, res);
        }
        break;
      case "POST":
        await userController.createUser(req, res);
        break;
      case "PUT":
        await userController.updateUser(req, res);
        break;
      case "DELETE":
        await userController.deleteUser(req, res);
        break;

      case "OPTIONS":
        res.writeHead(204);
        res.end();
        return;
      default:
        res.statusCode = 405;
        res.end(JSON.stringify({ message: "Method Not Allowed" }));
    }
  }
};
