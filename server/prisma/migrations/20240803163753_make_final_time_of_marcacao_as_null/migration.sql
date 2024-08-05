/*
  Warnings:

  - You are about to drop the column `points` on the `MarcacaoPontos` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MarcacaoPontos" DROP COLUMN "points",
ALTER COLUMN "finalTime" DROP NOT NULL;
