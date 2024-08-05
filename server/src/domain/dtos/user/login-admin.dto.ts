import { UserType } from "@prisma/client";

export interface AdminLoginDTO {
  email: string;
  id: string;
  token: string;
  userType: UserType;
}
