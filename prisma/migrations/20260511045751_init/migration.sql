/*
  Warnings:

  - You are about to drop the column `companyId` on the `Puzzle` table. All the data in the column will be lost.
  - You are about to drop the column `isAllRigs` on the `Puzzle` table. All the data in the column will be lost.
  - You are about to drop the column `isDefault` on the `Puzzle` table. All the data in the column will be lost.
  - You are about to drop the column `rigIds` on the `Puzzle` table. All the data in the column will be lost.
  - You are about to drop the column `companyId` on the `QuestionAnwser` table. All the data in the column will be lost.
  - You are about to drop the column `isAllRigs` on the `QuestionAnwser` table. All the data in the column will be lost.
  - You are about to drop the column `isDefault` on the `QuestionAnwser` table. All the data in the column will be lost.
  - You are about to drop the column `rigIds` on the `QuestionAnwser` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Puzzle" DROP CONSTRAINT "Puzzle_companyId_fkey";

-- DropForeignKey
ALTER TABLE "QuestionAnwser" DROP CONSTRAINT "QuestionAnwser_companyId_fkey";

-- AlterTable
ALTER TABLE "Puzzle" DROP COLUMN "companyId",
DROP COLUMN "isAllRigs",
DROP COLUMN "isDefault",
DROP COLUMN "rigIds";

-- AlterTable
ALTER TABLE "QuestionAnwser" DROP COLUMN "companyId",
DROP COLUMN "isAllRigs",
DROP COLUMN "isDefault",
DROP COLUMN "rigIds";
