/*
  Warnings:

  - A unique constraint covering the columns `[googleId]` on the table `Clinic` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Clinic` table without a default value. This is not possible if the table is not empty.
  - Added the required column `googleId` to the `Clinic` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refreshToken` to the `Clinic` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Clinic" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "googleId" TEXT NOT NULL,
ADD COLUMN     "refreshToken" TEXT NOT NULL,
ADD COLUMN     "selectedCustomerId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Clinic_googleId_key" ON "Clinic"("googleId");
