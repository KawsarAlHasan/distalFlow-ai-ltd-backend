/*
  Warnings:

  - Made the column `city` on table `Clinic` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Clinic" ALTER COLUMN "city" DROP NOT NULL;
