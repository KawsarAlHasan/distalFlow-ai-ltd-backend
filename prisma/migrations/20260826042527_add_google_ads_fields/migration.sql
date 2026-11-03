/*
  Warnings:

  - You are about to drop the column `email` on the `Clinic` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Clinic_googleId_key";

-- AlterTable
ALTER TABLE "Clinic" DROP COLUMN "email",
ADD COLUMN     "googleEmail" TEXT,
ALTER COLUMN "googleId" DROP NOT NULL,
ALTER COLUMN "refreshToken" DROP NOT NULL;
