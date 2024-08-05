// src/interfaces/controllers/marcacaoPontosController.ts
import { MarcacaoPontosService } from "../../application/services/marcacaoPontosService";
import { UserService } from "../../application/services/userService";
import { MarcacaoPontos } from "../../domain/entities/marcacaoPontos";
import { IncomingMessage, ServerResponse } from "http";
import { parse } from "url";

export class MarcacaoPontosController {
  constructor(
    private marcacaoPontosService: MarcacaoPontosService,
    private userService: UserService
  ) {}

  async getMarcacao(req: IncomingMessage, res: ServerResponse): Promise<void> {
    const parsedUrl = parse(req.url || "", true);
    const id = parsedUrl.query.id as string;

    if (id) {
      const marcacao = await this.marcacaoPontosService.getMarcacaoById(id);
      res.statusCode = 200;
      res.end(JSON.stringify(marcacao));
    } else {
      res.statusCode = 400;
      res.end(JSON.stringify({ message: "Marcação de Pontos ID is required" }));
    }
  }

  async getMarcacoesByUser(
    req: IncomingMessage,
    res: ServerResponse
  ): Promise<void> {
    const parsedUrl = parse(req.url || "", true);
    const { month, year, userId } = parsedUrl.query;
    const currentDate = new Date();
    const monthNumber = parseInt(month as string, 10) || currentDate.getMonth();

    const yearNumber =
      parseInt(year as string, 10) || currentDate.getFullYear();

    const searchQuery = userId as string;
    const auth = req.headers.authorization;

    if (auth) {
      const user = await this.userService.refreshToken(auth);

      if (user) {
        let userIdQuery = "";
        userIdQuery = user.id;
        if (user.userType === "admin") {
          userIdQuery = searchQuery;
        }

        const marcacoes = await this.marcacaoPontosService.getMarcacoesByUserId(
          userIdQuery,
          monthNumber,
          yearNumber
        );

        res.statusCode = 200;
        res.end(JSON.stringify(marcacoes));
      } else {
        res.statusCode = 401;
        res.end(JSON.stringify({ message: "Not authorized" }));
      }
    }
  }

  async createMarcacao(
    req: IncomingMessage,
    res: ServerResponse
  ): Promise<void> {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      const auth = req.headers.authorization;

      if (auth) {
        const user = await this.userService.refreshToken(auth);

        if (user) {
          const marcacao = await this.marcacaoPontosService.punchClock(user.id);
          res.statusCode = 200;
          res.end(JSON.stringify(marcacao));
        } else {
          res.statusCode = 401;
          res.end(JSON.stringify({ message: "Not authorized" }));
        }
      }
    });
  }

  async deleteMarcacao(
    req: IncomingMessage,
    res: ServerResponse
  ): Promise<void> {
    const parsedUrl = parse(req.url || "", true);
    const id = parsedUrl.query.id as string;

    if (id) {
      await this.marcacaoPontosService.deleteMarcacao(id);
      res.statusCode = 200;
      res.end(JSON.stringify({ message: "Marcação de Pontos deleted" }));
    } else {
      res.statusCode = 400;
      res.end(JSON.stringify({ message: "Marcação de Pontos ID is required" }));
    }
  }
}
