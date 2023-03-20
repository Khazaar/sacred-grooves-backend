/*
  Warnings:

  - A unique constraint covering the columns `[artisitTypeName]` on the table `ArtistType` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "ArtistType_artistId_key";

-- CreateIndex
CREATE UNIQUE INDEX "ArtistType_artisitTypeName_key" ON "ArtistType"("artisitTypeName");
