// src/domain/repositories/marcacaoPontosRepository.ts
import { MarcacaoPontos } from "../entities/marcacaoPontos";

export interface MarcacaoPontosRepository {
  findById(id: string): Promise<MarcacaoPontos | null>;
  findAllByUserId(userId: string): Promise<MarcacaoPontos[]>;
  createMarcacaoPontos(marcacaoPontos: MarcacaoPontos): Promise<void>;
  update(marcacaoPontos: MarcacaoPontos): Promise<void>;
  delete(id: string): Promise<void>;
}
