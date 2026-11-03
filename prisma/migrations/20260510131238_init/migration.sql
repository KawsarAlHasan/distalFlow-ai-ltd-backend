-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "roleName" TEXT,
ALTER COLUMN "roleId" DROP NOT NULL;
