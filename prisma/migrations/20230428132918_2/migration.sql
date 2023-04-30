/*
  Warnings:

  - You are about to drop the column `supportTeamId` on the `SupportTeam` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "SupportTeam_supportTeamId_key";

-- AlterTable
ALTER TABLE "SupportTeam" DROP COLUMN "supportTeamId";
