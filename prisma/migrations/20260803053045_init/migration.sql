/*
  Warnings:

  - You are about to drop the column `userId` on the `CardSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `DailyDebrief` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `GameResult` table. All the data in the column will be lost.
  - You are about to drop the column `approveStatus` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `companyId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `entryCompany` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `position` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `rigId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "CardSubmission" DROP CONSTRAINT "CardSubmission_userId_fkey";

-- DropForeignKey
ALTER TABLE "DailyDebrief" DROP CONSTRAINT "DailyDebrief_userId_fkey";

-- DropForeignKey
ALTER TABLE "GameResult" DROP CONSTRAINT "GameResult_userId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_companyId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_rigId_fkey";

-- AlterTable
ALTER TABLE "CardSubmission" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "DailyDebrief" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "GameResult" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "approveStatus",
DROP COLUMN "companyId",
DROP COLUMN "entryCompany",
DROP COLUMN "position",
DROP COLUMN "rigId";
