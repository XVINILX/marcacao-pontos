import { UserType } from "@prisma/client";
import { MarcacaoPontos } from "./marcacaoPontos";

export class User {
  constructor(
    public name: string,
    public email: string,
    public cellphone: string,
    public userType: UserType,
    public password: string,
    public loginIdentification?: string | null,
    public MarcacaoPontos?: MarcacaoPontos[],
    public id?: string
  ) {}
}
