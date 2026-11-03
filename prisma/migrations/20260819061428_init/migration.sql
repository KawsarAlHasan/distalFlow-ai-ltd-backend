/*
  Warnings:

  - Made the column `email` on table `ClinicAdmin` required. This step will fail if there are existing NULL values in that column.
  - Made the column `password` on table `ClinicAdmin` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ClinicAdmin" ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "password" SET NOT NULL;
