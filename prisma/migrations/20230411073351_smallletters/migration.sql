/*
  Warnings:

  - You are about to drop the `Artist` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Organizer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SupportTeam` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Visitor` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Artist" DROP CONSTRAINT "Artist_userId_fkey";

-- DropForeignKey
ALTER TABLE "ArtistType" DROP CONSTRAINT "ArtistType_artistId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_artisitId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_ogranizerId_fkey";

-- DropForeignKey
ALTER TABLE "MusicStyle" DROP CONSTRAINT "MusicStyle_artistId_fkey";

-- DropForeignKey
ALTER TABLE "Organizer" DROP CONSTRAINT "Organizer_userId_fkey";

-- DropForeignKey
ALTER TABLE "SupportTeam" DROP CONSTRAINT "SupportTeam_supportTeamId_fkey";

-- DropForeignKey
ALTER TABLE "Visitor" DROP CONSTRAINT "Visitor_userId_fkey";

-- DropTable
DROP TABLE "Artist";

-- DropTable
DROP TABLE "Organizer";

-- DropTable
DROP TABLE "SupportTeam";

-- DropTable
DROP TABLE "Visitor";

-- CreateTable
CREATE TABLE "artist" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "artist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organizer" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "mainLocation" TEXT,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "organizer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visitor" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "visitor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supportTeam" (
    "id" SERIAL NOT NULL,
    "supportTeamId" INTEGER NOT NULL,

    CONSTRAINT "supportTeam_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "artist_userId_key" ON "artist"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "organizer_userId_key" ON "organizer"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "visitor_userId_key" ON "visitor"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "supportTeam_supportTeamId_key" ON "supportTeam"("supportTeamId");

-- AddForeignKey
ALTER TABLE "artist" ADD CONSTRAINT "artist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizer" ADD CONSTRAINT "organizer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visitor" ADD CONSTRAINT "visitor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_ogranizerId_fkey" FOREIGN KEY ("ogranizerId") REFERENCES "organizer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_artisitId_fkey" FOREIGN KEY ("artisitId") REFERENCES "artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtistType" ADD CONSTRAINT "ArtistType_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MusicStyle" ADD CONSTRAINT "MusicStyle_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supportTeam" ADD CONSTRAINT "supportTeam_supportTeamId_fkey" FOREIGN KEY ("supportTeamId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
