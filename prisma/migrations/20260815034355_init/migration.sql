/*
  Warnings:

  - You are about to drop the `clinic_subscriptions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `clinics` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "clinic_overrides" DROP CONSTRAINT "clinic_overrides_clinicId_fkey";

-- DropForeignKey
ALTER TABLE "clinic_subscriptions" DROP CONSTRAINT "clinic_subscriptions_clinicId_fkey";

-- DropForeignKey
ALTER TABLE "clinic_subscriptions" DROP CONSTRAINT "clinic_subscriptions_priceId_fkey";

-- DropTable
DROP TABLE "clinic_subscriptions";

-- DropTable
DROP TABLE "clinics";

-- CreateTable
CREATE TABLE "Clinic" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "tradingCompany" TEXT,
    "city" TEXT,
    "status" "AllStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Clinic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClinicAdmin" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "clinicId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClinicAdmin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClinicPostcode" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "unavailable" BOOLEAN NOT NULL DEFAULT false,
    "override" BOOLEAN NOT NULL DEFAULT false,
    "clinicId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClinicPostcode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClinicLocation" (
    "id" TEXT NOT NULL,
    "lat" TEXT,
    "lng" TEXT,
    "clinicId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClinicLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClinicSubscription" (
    "id" TEXT NOT NULL,
    "plan" TEXT NOT NULL,
    "locations" INTEGER NOT NULL DEFAULT 1,
    "discount" TEXT NOT NULL DEFAULT 'none',
    "promoCode" TEXT,
    "monthlyFee" DOUBLE PRECISION,
    "setupFee" DOUBLE PRECISION,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "clinicId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "planPriceId" TEXT,

    CONSTRAINT "ClinicSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClinicAdmin_email_key" ON "ClinicAdmin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ClinicAdmin_clinicId_key" ON "ClinicAdmin"("clinicId");

-- CreateIndex
CREATE UNIQUE INDEX "ClinicPostcode_clinicId_code_key" ON "ClinicPostcode"("clinicId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "ClinicLocation_clinicId_key" ON "ClinicLocation"("clinicId");

-- CreateIndex
CREATE UNIQUE INDEX "ClinicSubscription_clinicId_key" ON "ClinicSubscription"("clinicId");

-- AddForeignKey
ALTER TABLE "ClinicAdmin" ADD CONSTRAINT "ClinicAdmin_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicPostcode" ADD CONSTRAINT "ClinicPostcode_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicLocation" ADD CONSTRAINT "ClinicLocation_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicSubscription" ADD CONSTRAINT "ClinicSubscription_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicSubscription" ADD CONSTRAINT "ClinicSubscription_planPriceId_fkey" FOREIGN KEY ("planPriceId") REFERENCES "prices"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinic_overrides" ADD CONSTRAINT "clinic_overrides_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
