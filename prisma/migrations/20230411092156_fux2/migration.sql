/*
  Warnings:

  - You are about to drop the column `artisitId` on the `Event` table. All the data in the column will be lost.
  - Added the required column `artistId` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_artisitId_fkey";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "artisitId",
ADD COLUMN     "artistId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
