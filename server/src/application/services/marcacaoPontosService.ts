import { MarcacaoPontosRepositoryImpl } from "../../infrastructure/repositories/marcacaoPontosRepositoryImpl";
import { MarcacaoPontos } from "../../domain/entities/marcacaoPontos";
import { UpdateMarcacaoPontosDTO } from "../../domain/dtos/marcacaoPontos/update-marcacao-pontos.dto";
import {
  ListMarcacaoPontosDTO,
  ReadMarcacaoPontosWithDto,
} from "../../domain/dtos/marcacaoPontos/list-user-marcacao-pontos.dto";
import { CreateMarcacaoPontosDTO } from "../../domain/dtos/marcacaoPontos/create-marcacao-pontos.dto";

export class MarcacaoPontosService {
  constructor(private marcacaoPontosRepository: MarcacaoPontosRepositoryImpl) {}

  async getMarcacaoById(id: string): Promise<MarcacaoPontos | null> {
    return this.marcacaoPontosRepository.findById(id);
  }

  async getMarcacoesByUserId(
    userId: string,
    month: number,
    year: number
  ): Promise<ListMarcacaoPontosDTO> {
    const marcacaoList = await this.marcacaoPontosRepository.findAllByUserId(
      userId,
      month,
      year
    );

    let totalMinuteForThatMonth = 0;

    totalMinuteForThatMonth =
      this.calculateTotalMinutesForMarcacoes(marcacaoList);

    let marcacaoPontosByDay: ReadMarcacaoPontosWithDto[] = [];
    const splitMarcacaoList = marcacaoList.flatMap(this.splitMarcacaoByDay);
    const groupedByDay = this.groupMarcacoesByDay(splitMarcacaoList);

    for (const [day, marcacoes] of Object.entries(groupedByDay)) {
      const totalMinutesForThatDay =
        this.calculateTotalMinutesForMarcacoes(marcacoes);

      marcacaoPontosByDay.push({
        totalForThatDay: this.formatMinutesToHoursAndMinutes(
          totalMinutesForThatDay
        ),
        totalMinutesForThatDay,
        marcacao: marcacoes.map((marcacao) => {
          const totalMinutesForThatDay = this.calculateTotalMinutesForMarcacoes(
            [marcacao]
          );
          return {
            timeDifference: this.formatMinutesToHoursAndMinutes(
              totalMinutesForThatDay
            ),
            initialTime: marcacao.initialTime,
            finalTime: marcacao.finalTime,
          };
        }),
      });
    }

    const getMarcacaNotFinished = await this.getMarcacaoByDate(userId);

    let minutesDifferenceNotFinished = 0;

    if (getMarcacaNotFinished && getMarcacaNotFinished.initialTime) {
      const marcacaoNotFinishedInititalTime =
        getMarcacaNotFinished?.initialTime;
      minutesDifferenceNotFinished =
        (new Date().getTime() - marcacaoNotFinishedInititalTime.getTime()) /
        60000;
      totalMinuteForThatMonth =
        totalMinuteForThatMonth + minutesDifferenceNotFinished;
    }

    return <ListMarcacaoPontosDTO>{
      marcacoPontosByDay: marcacaoPontosByDay,
      ...(getMarcacaNotFinished
        ? {
            notFinished: {
              ...getMarcacaNotFinished,
              totalMinutesDifference: minutesDifferenceNotFinished,
            },
          }
        : {}),
      totalForThatMonth: totalMinuteForThatMonth,
    };
  }

  private groupMarcacoesByDay(marcacaoList: MarcacaoPontos[]): {
    [day: string]: MarcacaoPontos[];
  } {
    return marcacaoList.reduce((acc, marcacao) => {
      const day = marcacao.initialTime?.toISOString().split("T")[0];
      if (day) {
        if (!acc[day]) {
          acc[day] = [];
        }
        acc[day].push(marcacao);
      }
      return acc;
    }, {} as { [day: string]: MarcacaoPontos[] });
  }

  splitMarcacaoByDay(marcacao: MarcacaoPontos): MarcacaoPontos[] {
    if (marcacao.initialTime && marcacao.finalTime) {
      const splitEntries: MarcacaoPontos[] = [];
      let currentStart = new Date(marcacao.initialTime);
      let currentEnd = new Date(currentStart);
      currentEnd.setHours(23, 59, 59, 999); // End of the first day
      let insideWhile = 0;
      while (currentEnd < marcacao.finalTime && insideWhile <= 5) {
        splitEntries.push(
          new MarcacaoPontos(
            marcacao.id,
            marcacao.userId,
            currentStart,
            currentEnd
          )
        );
        currentStart = new Date(currentEnd);
        currentStart.setHours(0, 0, 0, 0); // Start of the next day
        currentEnd = new Date(currentStart);
        currentEnd.setHours(23, 59, 59, 999); // End of the next day
        insideWhile++;
      }

      // Add the final segment
      splitEntries.push(
        new MarcacaoPontos(
          marcacao.id,
          marcacao.userId,
          currentStart,
          marcacao.finalTime
        )
      );

      return splitEntries;
    }

    return [];
  }

  formatMinutesToHoursAndMinutes(totalMinutes: number): string {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const formattedMinutes = minutes.toFixed(2).padStart(5, "0");
    return `${hours}h${formattedMinutes}m`;
  }

  private calculateTotalMinutesForMarcacoes(
    marcacoes: MarcacaoPontos[]
  ): number {
    return marcacoes.reduce((total, marcacao) => {
      if (marcacao.initialTime && marcacao.finalTime) {
        const diff =
          (marcacao.finalTime.getTime() - marcacao.initialTime.getTime()) /
          60000;
        return total + diff;
      }
      return total;
    }, 0);
  }

  async punchClock(userId: string): Promise<void> {
    const marcacaoWithoutFinished = await this.getMarcacaoByDate(userId);

    if (marcacaoWithoutFinished) {
      await this.updateMarcacao({
        id: marcacaoWithoutFinished.id,
        finalTime: new Date(),
      });
    } else {
      await this.marcacaoPontosRepository.createMarcacaoPontos({
        initialTime: new Date(),
        userId: userId,
      });
    }
  }

  async createMarcacao(marcacaoPontos: CreateMarcacaoPontosDTO): Promise<void> {
    await this.marcacaoPontosRepository.createMarcacaoPontos(marcacaoPontos);
  }

  async getMarcacaoByDate(userId: string): Promise<MarcacaoPontos | null> {
    try {
      const marcacao =
        await this.marcacaoPontosRepository.getMarcacaoNotFinishedByUser(
          userId
        );

      return marcacao;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async updateMarcacao(marcacao: UpdateMarcacaoPontosDTO): Promise<void> {
    await this.marcacaoPontosRepository.update(marcacao);
  }

  async deleteMarcacao(id: string): Promise<void> {
    await this.marcacaoPontosRepository.delete(id);
  }
}
