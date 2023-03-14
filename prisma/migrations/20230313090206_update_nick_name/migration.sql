-- DropForeignKey
ALTER TABLE "Artist" DROP CONSTRAINT "Artist_userId_fkey";

-- DropIndex
DROP INDEX "User_nickName_key";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "nickName" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Artist" ADD CONSTRAINT "Artist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
