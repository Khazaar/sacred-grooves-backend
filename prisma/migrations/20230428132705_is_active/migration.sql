/*
  Warnings:

  - You are about to drop the `organizer` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_ogranizerId_fkey";

-- DropForeignKey
ALTER TABLE "organizer" DROP CONSTRAINT "organizer_profileId_fkey";

-- AlterTable
ALTER TABLE "Artist" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "SupportTeam" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "organizer";

-- CreateTable
CREATE TABLE "Organizer" (
    "id" SERIAL NOT NULL,
    "profileId" INTEGER NOT NULL,
    "mainLocation" TEXT,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Organizer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Organizer_profileId_key" ON "Organizer"("profileId");

-- AddForeignKey
ALTER TABLE "Organizer" ADD CONSTRAINT "Organizer_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_ogranizerId_fkey" FOREIGN KEY ("ogranizerId") REFERENCES "Organizer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
