export interface ListMarcacaoPontosDTO {
  marcacoPontosByDay: ReadMarcacaoPontosWithDto[];
  totalForThatMonth: number;
  notFinished: UniqueMarcacaoPontosDto;
}

export interface ReadMarcacaoPontosWithDto {
  totalForThatDay: string;
  totalMinutesForThatDay: number;
  marcacao: UniqueMarcacaoPontosDto[];
}

export interface UniqueMarcacaoPontosDto {
  initialTime?: Date | null;
  finalTime?: Date | null;
  timeDifference?: string;
  totalMinutesDifference?: number;
}
