import { UserService } from "../../application/services/userService";
import { UserRepositoryImpl } from "../../infrastructure/repositories/userRepositoryImpl";
import { AuthController } from "../controllers/authController";
import { IncomingMessage, ServerResponse } from "http";

const authController = new AuthController(
  new UserService(new UserRepositoryImpl())
);

export const authRoutes = async (
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> => {
  const { method, url } = req;

  if (url?.startsWith("/auth")) {
    switch (method) {
      case "POST":
        if (url.includes("admin")) await authController.loginAdmin(req, res);
        else if (url.includes("employee"))
          await authController.loginEmployee(req, res);
        else if (url.includes("refresh-token"))
          await authController.refreshToken(req, res);

        break;

      case "OPTIONS":
        res.writeHead(204); // No Content
        res.end();
        return;
      default:
        res.statusCode = 405;
        res.end(JSON.stringify({ message: "Method Not Allowed" }));
    }
  }
};
