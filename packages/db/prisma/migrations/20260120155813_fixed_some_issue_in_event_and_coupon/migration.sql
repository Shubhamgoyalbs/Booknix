/*
  Warnings:

  - You are about to drop the column `couponId` on the `Event` table. All the data in the column will be lost.
  - Added the required column `eventId` to the `Coupon` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_couponId_fkey";

-- AlterTable
ALTER TABLE "Coupon" ADD COLUMN     "eventId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "couponId",
ALTER COLUMN "eventBookingStatus" SET DEFAULT 'WAITING',
ALTER COLUMN "eventStatus" SET DEFAULT 'OPEN';

-- AddForeignKey
ALTER TABLE "Coupon" ADD CONSTRAINT "Coupon_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
