import { PrismaClient } from "@prisma/client";
import { CreateMarcacaoPontosDTO } from "../../domain/dtos/marcacaoPontos/create-marcacao-pontos.dto";
import { MarcacaoPontos } from "../../domain/entities/marcacaoPontos";
import { UpdateMarcacaoPontosDTO } from "../../domain/dtos/marcacaoPontos/update-marcacao-pontos.dto";

export class MarcacaoPontosRepositoryImpl {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }
  private marcacoes: MarcacaoPontos[] = [];

  async findById(id: string): Promise<MarcacaoPontos | null> {
    return this.marcacoes.find((marcacao) => marcacao.id === id) || null;
  }

  async findAllByUserId(
    userId: string,
    month: number,
    year: number
  ): Promise<MarcacaoPontos[]> {
    try {
      const initialDayOfMonth = new Date(year, month, 1);
      const endDayOfMonth = new Date(year, month + 1, 0);

      return await this.prisma.marcacaoPontos.findMany({
        where: {
          AND: [
            { userId: userId },
            { finalTime: { not: null } },
            { initialTime: { lte: endDayOfMonth, gte: initialDayOfMonth } },
          ],
        },
      });
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  async createMarcacaoPontos(
    marcacaoPontos: CreateMarcacaoPontosDTO
  ): Promise<MarcacaoPontos | null> {
    try {
      return await this.prisma.marcacaoPontos.create({
        data: marcacaoPontos,
      });
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async getMarcacaoNotFinishedByUser(
    userId: string
  ): Promise<MarcacaoPontos | null> {
    try {
      return await this.prisma.marcacaoPontos.findFirst({
        where: {
          AND: [{ userId: userId }, { finalTime: null }],
        },
      });
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async update(
    marcacaoPontos: UpdateMarcacaoPontosDTO
  ): Promise<MarcacaoPontos | null> {
    try {
      return await this.prisma.marcacaoPontos.update({
        where: {
          id: marcacaoPontos.id,
        },
        data: { finalTime: marcacaoPontos.finalTime },
      });
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async delete(id: string): Promise<void> {
    this.marcacoes = this.marcacoes.filter((marcacao) => marcacao.id !== id);
  }
}
