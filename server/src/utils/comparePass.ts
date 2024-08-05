import bcrypt from "bcrypt";

export async function comparePassword(
  plainPassword: string,
  hashedPassword: string
) {
  const match = await bcrypt.compare(plainPassword, hashedPassword);
  return match;
}
