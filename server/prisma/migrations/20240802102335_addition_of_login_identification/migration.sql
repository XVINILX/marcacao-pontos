/*
  Warnings:

  - Added the required column `finalTime` to the `MarcacaoPontos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `initialTime` to the `MarcacaoPontos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cellphone` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `loginIdentification` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MarcacaoPontos" ADD COLUMN     "finalTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "initialTime" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "cellphone" TEXT NOT NULL,
ADD COLUMN     "loginIdentification" TEXT NOT NULL;
