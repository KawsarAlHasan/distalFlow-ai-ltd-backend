/*
  Warnings:

  - Made the column `userId` on table `GameResult` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "GameResult" DROP CONSTRAINT "GameResult_userId_fkey";

-- AlterTable
ALTER TABLE "GameResult" ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "GameResult" ADD CONSTRAINT "GameResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
