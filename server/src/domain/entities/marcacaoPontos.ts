export class MarcacaoPontos {
  constructor(
    public id: string,
    public userId: string,
    public initialTime: Date | null,
    public finalTime?: Date | null
  ) {}
}
