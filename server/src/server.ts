import { createServer, IncomingMessage, ServerResponse } from "http";
import { userRoutes } from "./interfaces/routes/userRoutes";
import { marcacaoPontosRoutes } from "./interfaces/routes/marcacaoPontosRoutes";
import { PrismaClient } from "@prisma/client";
import { UserService } from "./application/services/userService";
import { UserController } from "./interfaces/controllers/userController";
import { UserRepositoryImpl } from "./infrastructure/repositories/userRepositoryImpl";
import {
  createInitialUser,
  createTestUserAndSomeMarcacaoPontos,
} from "./utils/initServerServices";
import { authRoutes } from "./interfaces/routes/authRoutes";
import { MarcacaoPontosRepositoryImpl } from "./infrastructure/repositories/marcacaoPontosRepositoryImpl";
import { MarcacaoPontosService } from "./application/services/marcacaoPontosService";

const prisma = new PrismaClient();
const userRepository = new UserRepositoryImpl();
const userService = new UserService(userRepository);
const marcacaoPontosRepository = new MarcacaoPontosRepositoryImpl();
const marcacaoPontosService = new MarcacaoPontosService(
  marcacaoPontosRepository
);
const userController = new UserController(userService);

const requestListener = async (
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.url?.startsWith("/users")) {
    await userRoutes(req, res);
  } else if (req.url?.startsWith("/marcacoes")) {
    await marcacaoPontosRoutes(req, res);
  } else if (req.url?.startsWith("/auth")) {
    await authRoutes(req, res);
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ message: "Not Found" }));
  }
};

const server = createServer(requestListener);
createInitialUser(
  {
    email: "superadmin@teste.com",
    password: "Teste@123",
    name: "Admin",
    userType: "admin",
    cellphone: "1600000000",
  },
  userService
);

if (process.env.NODE_ENV === "DEV")
  createTestUserAndSomeMarcacaoPontos(userService, marcacaoPontosService);

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
