import { UserService } from "../../application/services/userService";
import { IncomingMessage, ServerResponse } from "http";
import { parse } from "url";

export class AuthController {
  constructor(private userService: UserService) {}

  async loginEmployee(
    req: IncomingMessage,
    res: ServerResponse
  ): Promise<void> {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      const parsedBody = JSON.parse(body);

      const { loginIdentification } = parsedBody;

      const login = await this.userService.loginEmployee(loginIdentification);
      res.statusCode = 201;
      res.end(JSON.stringify(login));
    });
  }

  async loginAdmin(req: IncomingMessage, res: ServerResponse): Promise<void> {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      const parsedBody = JSON.parse(body);

      const { email, password } = parsedBody;

      const login = await this.userService.login(email, password);
      res.statusCode = 201;
      res.end(JSON.stringify(login));
    });
  }

  async refreshToken(req: IncomingMessage, res: ServerResponse): Promise<void> {
    const token = req.headers.authorization;

    if (token) {
      const login = await this.userService.refreshToken(token);
      res.statusCode = 201;
      res.end(JSON.stringify(login));
    }
  }
}
