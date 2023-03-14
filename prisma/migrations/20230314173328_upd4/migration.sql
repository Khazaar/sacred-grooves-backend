/*
  Warnings:

  - You are about to drop the column `ograniserId` on the `Event` table. All the data in the column will be lost.
  - Added the required column `ogranizerId` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_ograniserId_fkey";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "ograniserId",
ADD COLUMN     "ogranizerId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_ogranizerId_fkey" FOREIGN KEY ("ogranizerId") REFERENCES "Organizer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
