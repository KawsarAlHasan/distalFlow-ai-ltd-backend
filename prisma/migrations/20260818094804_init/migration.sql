/*
  Warnings:

  - The `onTimePassword` column on the `ClinicAdmin` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ClinicAdminStatus" AS ENUM ('ACTIVE', 'PENDING', 'INACTIVE', 'SUSPENDED', 'DELETED');

-- AlterTable
ALTER TABLE "ClinicAdmin" ADD COLUMN     "status" "ClinicAdminStatus" NOT NULL DEFAULT 'PENDING',
DROP COLUMN "onTimePassword",
ADD COLUMN     "onTimePassword" BOOLEAN NOT NULL DEFAULT false;
