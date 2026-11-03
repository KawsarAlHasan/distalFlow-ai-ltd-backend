-- DropIndex
DROP INDEX "Company_name_key";

-- AlterTable
ALTER TABLE "Company" ALTER COLUMN "name" DROP NOT NULL;
