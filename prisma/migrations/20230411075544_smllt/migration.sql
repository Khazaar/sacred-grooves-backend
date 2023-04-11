/*
  Warnings:

  - You are about to drop the `artist` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `supportTeam` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `visitor` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ArtistType" DROP CONSTRAINT "ArtistType_artistId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_artisitId_fkey";

-- DropForeignKey
ALTER TABLE "MusicStyle" DROP CONSTRAINT "MusicStyle_artistId_fkey";

-- DropForeignKey
ALTER TABLE "artist" DROP CONSTRAINT "artist_userId_fkey";

-- DropForeignKey
ALTER TABLE "supportTeam" DROP CONSTRAINT "supportTeam_supportTeamId_fkey";

-- DropForeignKey
ALTER TABLE "visitor" DROP CONSTRAINT "visitor_userId_fkey";

-- DropTable
DROP TABLE "artist";

-- DropTable
DROP TABLE "supportTeam";

-- DropTable
DROP TABLE "visitor";

-- CreateTable
CREATE TABLE "Artist" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Artist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Visitor" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Visitor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupportTeam" (
    "id" SERIAL NOT NULL,
    "supportTeamId" INTEGER NOT NULL,

    CONSTRAINT "SupportTeam_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Artist_userId_key" ON "Artist"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Visitor_userId_key" ON "Visitor"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SupportTeam_supportTeamId_key" ON "SupportTeam"("supportTeamId");

-- AddForeignKey
ALTER TABLE "Artist" ADD CONSTRAINT "Artist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visitor" ADD CONSTRAINT "Visitor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_artisitId_fkey" FOREIGN KEY ("artisitId") REFERENCES "Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtistType" ADD CONSTRAINT "ArtistType_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MusicStyle" ADD CONSTRAINT "MusicStyle_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportTeam" ADD CONSTRAINT "SupportTeam_supportTeamId_fkey" FOREIGN KEY ("supportTeamId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
