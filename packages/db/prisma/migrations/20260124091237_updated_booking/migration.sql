/*
  Warnings:

  - You are about to drop the column `paymentStatus` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the `PaymentLink` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CANCELED', 'COMPLETED', 'FAILED', 'REFUNDED');

-- DropIndex
DROP INDEX "Booking_paymentStatus_idx";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "paymentStatus",
ADD COLUMN     "bookingStatus" "BookingStatus" NOT NULL DEFAULT 'PENDING';

-- DropTable
DROP TABLE "PaymentLink";

-- DropEnum
DROP TYPE "PaymentStatus";

-- CreateIndex
CREATE INDEX "Booking_bookingStatus_idx" ON "Booking"("bookingStatus");
