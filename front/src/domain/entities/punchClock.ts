export interface MarcacaoPontos {
  id: string;
  userId: string;
  timestamp: Date;
  initialTime: Date;
  finalTime: Date;
  points: number;
}

export interface CreateMarcacaoPontos {
  userId: string;
  timestamp: Date;
  initialTime: Date;
  finalTime: Date;
  points: number;
}

export interface ListMarcacaoPontos {
  data: MarcacaoPontos[];
  total: number;
}

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
  timeDifference: string;
  totalMinutesDifference?: number;
}
