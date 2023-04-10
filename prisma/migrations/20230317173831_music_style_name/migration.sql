/*
  Warnings:

  - Added the required column `musicStyleName` to the `MusicStyle` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MusicStyle" ADD COLUMN     "musicStyleName" TEXT NOT NULL;
