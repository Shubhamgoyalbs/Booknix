/*
  Warnings:

  - Added the required column `bookingId` to the `TicketLock` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TicketLock" ADD COLUMN     "bookingId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "TicketLock" ADD CONSTRAINT "TicketLock_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
