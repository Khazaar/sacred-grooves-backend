-- CreateTable
CREATE TABLE "Artist" (
    "id" SERIAL NOT NULL,
    "nickName" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "telegramName" TEXT,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Artist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Artist_nickName_key" ON "Artist"("nickName");
