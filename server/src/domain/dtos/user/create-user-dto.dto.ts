import { UserType } from "@prisma/client";

export interface CreateUserDTO {
  name: string;
  email: string;
  cellphone: string;
  userType: UserType;
  password: string;
}
