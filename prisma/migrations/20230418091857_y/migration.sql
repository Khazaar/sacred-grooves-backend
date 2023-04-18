/*
  Warnings:

  - You are about to drop the column `userId` on the `organizer` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "organizer_userId_key";

-- AlterTable
ALTER TABLE "organizer" DROP COLUMN "userId";
