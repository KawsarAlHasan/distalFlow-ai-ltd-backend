-- CreateEnum
CREATE TYPE "PlanType" AS ENUM ('SOLO', 'GROWTH', 'PRO', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "PriceStatus" AS ENUM ('ACTIVE', 'LEGACY', 'GRANDFATHERED');

-- CreateEnum
CREATE TYPE "MigrationMode" AS ENUM ('MIGRATE', 'GRANDFATHER');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('PRICE_CREATED', 'PRICE_UPDATED', 'SUBSCRIBERS_MIGRATED', 'PRICE_GRANDFATHERED', 'OVERRIDE_APPLIED', 'OVERRIDE_REMOVED');

-- CreateTable
CREATE TABLE "plans" (
    "id" TEXT NOT NULL,
    "type" "PlanType" NOT NULL,
    "name" TEXT NOT NULL,
    "accent" TEXT NOT NULL,
    "campaigns" TEXT NOT NULL,
    "campaignLimit" INTEGER,
    "isUnlimitedCampaign" BOOLEAN NOT NULL DEFAULT false,
    "locations" TEXT NOT NULL,
    "locationLimit" INTEGER,
    "isUnlimitedLocation" BOOLEAN NOT NULL DEFAULT false,
    "selfServe" BOOLEAN NOT NULL DEFAULT true,
    "additionalSiteAmount" INTEGER,
    "additionalSiteSetup" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prices" (
    "id" TEXT NOT NULL,
    "stripePriceId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "setupFee" INTEGER NOT NULL DEFAULT 0,
    "status" "PriceStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clinics" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clinics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clinic_subscriptions" (
    "id" TEXT NOT NULL,
    "clinicId" TEXT NOT NULL,
    "priceId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clinic_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clinic_overrides" (
    "id" TEXT NOT NULL,
    "clinicId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "standardPrice" INTEGER NOT NULL,
    "overridePrice" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,

    CONSTRAINT "clinic_overrides_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_log_entries" (
    "id" TEXT NOT NULL,
    "admin" TEXT NOT NULL,
    "action" "AuditAction" NOT NULL,
    "planId" TEXT NOT NULL,
    "previous" TEXT NOT NULL,
    "next" TEXT NOT NULL,
    "affected" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_log_entries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "plans_type_key" ON "plans"("type");

-- CreateIndex
CREATE UNIQUE INDEX "prices_stripePriceId_key" ON "prices"("stripePriceId");

-- CreateIndex
CREATE INDEX "prices_planId_idx" ON "prices"("planId");

-- CreateIndex
CREATE INDEX "prices_planId_status_idx" ON "prices"("planId", "status");

-- CreateIndex
CREATE INDEX "clinic_subscriptions_clinicId_idx" ON "clinic_subscriptions"("clinicId");

-- CreateIndex
CREATE INDEX "clinic_subscriptions_priceId_idx" ON "clinic_subscriptions"("priceId");

-- CreateIndex
CREATE INDEX "clinic_overrides_clinicId_idx" ON "clinic_overrides"("clinicId");

-- CreateIndex
CREATE INDEX "clinic_overrides_planId_idx" ON "clinic_overrides"("planId");

-- CreateIndex
CREATE INDEX "audit_log_entries_planId_idx" ON "audit_log_entries"("planId");

-- CreateIndex
CREATE INDEX "audit_log_entries_action_idx" ON "audit_log_entries"("action");

-- CreateIndex
CREATE INDEX "audit_log_entries_createdAt_idx" ON "audit_log_entries"("createdAt");

-- AddForeignKey
ALTER TABLE "prices" ADD CONSTRAINT "prices_planId_fkey" FOREIGN KEY ("planId") REFERENCES "plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinic_subscriptions" ADD CONSTRAINT "clinic_subscriptions_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "clinics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinic_subscriptions" ADD CONSTRAINT "clinic_subscriptions_priceId_fkey" FOREIGN KEY ("priceId") REFERENCES "prices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinic_overrides" ADD CONSTRAINT "clinic_overrides_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "clinics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinic_overrides" ADD CONSTRAINT "clinic_overrides_planId_fkey" FOREIGN KEY ("planId") REFERENCES "plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_log_entries" ADD CONSTRAINT "audit_log_entries_planId_fkey" FOREIGN KEY ("planId") REFERENCES "plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
