/*
  Warnings:

  - A unique constraint covering the columns `[bookingId,ticketTypeId]` on the table `TicketLock` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TicketLock_bookingId_ticketTypeId_key" ON "TicketLock"("bookingId", "ticketTypeId");
