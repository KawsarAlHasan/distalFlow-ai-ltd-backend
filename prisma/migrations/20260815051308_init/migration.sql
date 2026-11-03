/*
  Warnings:

  - The `status` column on the `Clinic` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ClinicStatus" AS ENUM ('ACTIVE', 'PENDING', 'INACTIVE', 'SUSPENDED', 'DELETED');

-- AlterTable
ALTER TABLE "Clinic" DROP COLUMN "status",
ADD COLUMN     "status" "ClinicStatus" NOT NULL DEFAULT 'ACTIVE';
