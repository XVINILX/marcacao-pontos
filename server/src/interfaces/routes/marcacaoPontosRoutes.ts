import { MarcacaoPontosService } from "../../application/services/marcacaoPontosService";
import { UserService } from "../../application/services/userService";
import { MarcacaoPontosRepositoryImpl } from "../../infrastructure/repositories/marcacaoPontosRepositoryImpl";
import { UserRepositoryImpl } from "../../infrastructure/repositories/userRepositoryImpl";
import { MarcacaoPontosController } from "../controllers/marcacaoPontosController";
import { IncomingMessage, ServerResponse } from "http";

const marcacaoPontosController = new MarcacaoPontosController(
  new MarcacaoPontosService(new MarcacaoPontosRepositoryImpl()),
  new UserService(new UserRepositoryImpl())
);

export const marcacaoPontosRoutes = async (
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> => {
  const { method, url } = req;

  if (url?.startsWith("/marcacoes")) {
    switch (method) {
      case "GET":
        if (url.includes("/user")) {
          await marcacaoPontosController.getMarcacoesByUser(req, res);
        } else {
          await marcacaoPontosController.getMarcacao(req, res);
        }
        break;
      case "POST":
        await marcacaoPontosController.createMarcacao(req, res);
        break;
      case "PUT":
        // await marcacaoPontosController.updateMarcacao(req, res);
        break;
      case "DELETE":
        await marcacaoPontosController.deleteMarcacao(req, res);
        break;
      default:
        res.statusCode = 405;
        res.end(JSON.stringify({ message: "Method Not Allowed" }));
    }
  }
};
