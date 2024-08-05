import { User } from "../domain/entities/user";

import { MarcacaoPontosService } from "../application/services/marcacaoPontosService";
import { UserService } from "../application/services/userService";

import { CreateMarcacaoPontosDTO } from "../domain/dtos/marcacaoPontos/create-marcacao-pontos.dto";

export async function createInitialUser(user: User, userService: UserService) {
  const userQuery = await userService.getUserByEmail(user.email);

  if (!userQuery && user) await userService.createUser(user);
}

function getRandomHoursInRange(minHours: number, maxHours: number): number {
  return Math.floor(Math.random() * (maxHours - minHours + 1)) + minHours;
}

// Function to format Date to 'YYYY-MM-DD' string
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Function to generate Marcacao for each day from the last 5 months
function createMarcacoesForLastFiveMonths(
  userId: string
): CreateMarcacaoPontosDTO[] {
  const marcacoes: CreateMarcacaoPontosDTO[] = [];
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 5);

  for (
    let date = new Date(startDate);
    date <= endDate;
    date.setDate(date.getDate() + 1)
  ) {
    const initialTime = new Date(date);
    initialTime.setHours(
      Math.floor(Math.random() * 24),
      Math.floor(Math.random() * 60),
      0,
      0
    );

    const minHours = 2;
    const maxHours = 9;
    const finalTime = new Date(initialTime);
    finalTime.setHours(
      initialTime.getHours() + getRandomHoursInRange(minHours, maxHours)
    );

    marcacoes.push({
      userId: userId,
      initialTime: initialTime,
      finalTime: finalTime,
    });
  }

  return marcacoes;
}

export async function createTestUserAndSomeMarcacaoPontos(
  userService: UserService,
  marcacaoPontosService: MarcacaoPontosService
) {
  let userId = "";
  const userQuery = await userService.getUserByEmail("employeeteste@teste.com");

  if (!userQuery) {
    const userCreate = await userService.createUser({
      email: "employeeteste@teste.com",
      password: "Teste@123",
      name: "Employee",
      userType: "employee",
      cellphone: "1600000000",
    });
    if (userCreate) userId = userCreate.id ?? "";
  } else {
    userId = userQuery.id ?? "";
  }

  const marcacoes = createMarcacoesForLastFiveMonths(userId);

  for (const marcacao of marcacoes) {
    await marcacaoPontosService.createMarcacao(marcacao);
  }
}
