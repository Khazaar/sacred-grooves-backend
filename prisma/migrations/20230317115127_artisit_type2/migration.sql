/*
  Warnings:

  - Added the required column `artisitTypeName` to the `ArtistType` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ArtistType" ADD COLUMN     "artisitTypeName" TEXT NOT NULL;
