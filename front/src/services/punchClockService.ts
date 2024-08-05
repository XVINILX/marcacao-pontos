import axiosInstance from "../utils/axiosInstance";
import {
  MarcacaoPontos,
  ListMarcacaoPontosDTO,
} from "../domain/entities/punchClock";

export const getMarcacoesByUser = async (
  userId: string,
  month: number,
  year: number
): Promise<ListMarcacaoPontosDTO> => {
  const response = await axiosInstance.get(`/marcacoes/user`, {
    params: { month, year, userId },
  });
  return response.data;
};

export const getMarcacaoById = async (id: string): Promise<MarcacaoPontos> => {
  const response = await axiosInstance.get(`/marcacoes?id=${id}`);
  return response.data;
};

export const createMarcacao = async (): Promise<MarcacaoPontos> => {
  const response = await axiosInstance.post("/marcacoes");
  return response.data;
};

export const updateMarcacao = async (
  marcacao: Partial<MarcacaoPontos>
): Promise<MarcacaoPontos> => {
  const response = await axiosInstance.put(
    `/marcacoes/${marcacao.id}`,
    marcacao
  );
  return response.data;
};

export const deleteMarcacao = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/marcacoes/${id}`);
};
