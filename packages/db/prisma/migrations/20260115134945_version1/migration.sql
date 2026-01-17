-- CreateEnum
CREATE TYPE "EventBookingStatus" AS ENUM ('WAITING', 'STARTED', 'CLOSED');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('OPEN', 'CLOSED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- CreateTable
CREATE TABLE "User"
(
    "id"            TEXT         NOT NULL,
    "email"         TEXT         NOT NULL,
    "firstName"     TEXT         NOT NULL,
    "lastName"      TEXT         NOT NULL,
    "profilePicUrl" TEXT,
    "password"      TEXT         NOT NULL,
    "verified"      BOOLEAN      NOT NULL DEFAULT false,
    "isOrganizer"   BOOLEAN      NOT NULL DEFAULT false,
    "refreshToken"  TEXT,
    "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"     TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event"
(
    "id"                 TEXT                 NOT NULL,
    "title"              TEXT                 NOT NULL,
    "description"        TEXT                 NOT NULL,
    "imageUrl"           TEXT                 NOT NULL,
    "location"           TEXT                 NOT NULL,
    "dateTime"           TIMESTAMP(3)         NOT NULL,
    "duration"           INTEGER              NOT NULL,
    "eventBookingStatus" "EventBookingStatus" NOT NULL,
    "eventStatus"        "EventStatus"        NOT NULL,
    "createdAt"          TIMESTAMP(3)         NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"          TIMESTAMP(3)         NOT NULL,
    "eventTypeId"        TEXT                 NOT NULL,
    "organizerId"        TEXT                 NOT NULL,
    "couponId"           TEXT,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TicketType"
(
    "id"        TEXT             NOT NULL,
    "typeName"  TEXT             NOT NULL,
    "available" INTEGER          NOT NULL,
    "total"     INTEGER          NOT NULL,
    "imageUrl"  TEXT             NOT NULL,
    "price"     DOUBLE PRECISION NOT NULL,
    "eventId"   TEXT             NOT NULL,
    "createdAt" TIMESTAMP(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3)     NOT NULL,

    CONSTRAINT "TicketType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification"
(
    "id"        TEXT         NOT NULL,
    "message"   TEXT         NOT NULL,
    "seen"      BOOLEAN      NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId"    TEXT         NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Coupon"
(
    "id"              TEXT             NOT NULL,
    "code"            TEXT             NOT NULL,
    "description"     TEXT             NOT NULL,
    "minPrice"        DOUBLE PRECISION NOT NULL,
    "maxDiscount"     DOUBLE PRECISION NOT NULL,
    "discountPercent" DOUBLE PRECISION NOT NULL,
    "createdAt"       TIMESTAMP(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"       TIMESTAMP(3)     NOT NULL,

    CONSTRAINT "Coupon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking"
(
    "id"              TEXT             NOT NULL,
    "totalAmount"     DOUBLE PRECISION NOT NULL,
    "discountPercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "finalAmount"     DOUBLE PRECISION NOT NULL,
    "paymentStatus"   "PaymentStatus"  NOT NULL DEFAULT 'PENDING',
    "expiresAt"       TIMESTAMP(3)     NOT NULL,
    "createdAt"       TIMESTAMP(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"       TIMESTAMP(3)     NOT NULL,
    "userId"          TEXT             NOT NULL,
    "eventId"         TEXT             NOT NULL,
    "couponId"        TEXT,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookingItem"
(
    "id"           TEXT         NOT NULL,
    "quantity"     INTEGER      NOT NULL,
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bookingId"    TEXT         NOT NULL,
    "ticketTypeId" TEXT         NOT NULL,

    CONSTRAINT "BookingItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bookmark"
(
    "id"        TEXT         NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eventId"   TEXT         NOT NULL,
    "userId"    TEXT         NOT NULL,

    CONSTRAINT "Bookmark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscribe"
(
    "id"        TEXT         NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eventId"   TEXT         NOT NULL,
    "userId"    TEXT         NOT NULL,

    CONSTRAINT "Subscribe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TicketLock"
(
    "id"           TEXT         NOT NULL,
    "quantity"     INTEGER      NOT NULL,
    "expiresAt"    TIMESTAMP(3) NOT NULL,
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId"       TEXT         NOT NULL,
    "ticketTypeId" TEXT         NOT NULL,

    CONSTRAINT "TicketLock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventType"
(
    "id"        TEXT         NOT NULL,
    "typeName"  TEXT         NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentLink"
(
    "id"        TEXT         NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User" ("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User" ("email");

-- CreateIndex
CREATE INDEX "Event_eventTypeId_idx" ON "Event" ("eventTypeId");

-- CreateIndex
CREATE INDEX "Event_organizerId_idx" ON "Event" ("organizerId");

-- CreateIndex
CREATE INDEX "Event_dateTime_idx" ON "Event" ("dateTime");

-- CreateIndex
CREATE INDEX "Event_eventStatus_idx" ON "Event" ("eventStatus");

-- CreateIndex
CREATE INDEX "TicketType_eventId_idx" ON "TicketType" ("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "TicketType_eventId_typeName_key" ON "TicketType" ("eventId", "typeName");

-- CreateIndex
CREATE INDEX "Notification_userId_seen_idx" ON "Notification" ("userId", "seen");

-- CreateIndex
CREATE UNIQUE INDEX "Coupon_code_key" ON "Coupon" ("code");

-- CreateIndex
CREATE INDEX "Coupon_code_idx" ON "Coupon" ("code");

-- CreateIndex
CREATE INDEX "Booking_userId_idx" ON "Booking" ("userId");

-- CreateIndex
CREATE INDEX "Booking_eventId_idx" ON "Booking" ("eventId");

-- CreateIndex
CREATE INDEX "Booking_paymentStatus_idx" ON "Booking" ("paymentStatus");

-- CreateIndex
CREATE INDEX "Booking_expiresAt_idx" ON "Booking" ("expiresAt");

-- CreateIndex
CREATE INDEX "BookingItem_bookingId_idx" ON "BookingItem" ("bookingId");

-- CreateIndex
CREATE INDEX "BookingItem_ticketTypeId_idx" ON "BookingItem" ("ticketTypeId");

-- CreateIndex
CREATE INDEX "Bookmark_userId_idx" ON "Bookmark" ("userId");

-- CreateIndex
CREATE INDEX "Bookmark_eventId_idx" ON "Bookmark" ("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_userId_eventId_key" ON "Bookmark" ("userId", "eventId");

-- CreateIndex
CREATE INDEX "Subscribe_userId_idx" ON "Subscribe" ("userId");

-- CreateIndex
CREATE INDEX "Subscribe_eventId_idx" ON "Subscribe" ("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscribe_userId_eventId_key" ON "Subscribe" ("userId", "eventId");

-- CreateIndex
CREATE INDEX "TicketLock_expiresAt_idx" ON "TicketLock" ("expiresAt");

-- CreateIndex
CREATE INDEX "TicketLock_userId_idx" ON "TicketLock" ("userId");

-- CreateIndex
CREATE INDEX "TicketLock_ticketTypeId_idx" ON "TicketLock" ("ticketTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "EventType_typeName_key" ON "EventType" ("typeName");

-- CreateIndex
CREATE INDEX "EventType_typeName_idx" ON "EventType" ("typeName");

-- AddForeignKey
ALTER TABLE "Event"
    ADD CONSTRAINT "Event_eventTypeId_fkey" FOREIGN KEY ("eventTypeId") REFERENCES "EventType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event"
    ADD CONSTRAINT "Event_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event"
    ADD CONSTRAINT "Event_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "Coupon" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketType"
    ADD CONSTRAINT "TicketType_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification"
    ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking"
    ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking"
    ADD CONSTRAINT "Booking_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking"
    ADD CONSTRAINT "Booking_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "Coupon" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingItem"
    ADD CONSTRAINT "BookingItem_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingItem"
    ADD CONSTRAINT "BookingItem_ticketTypeId_fkey" FOREIGN KEY ("ticketTypeId") REFERENCES "TicketType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookmark"
    ADD CONSTRAINT "Bookmark_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookmark"
    ADD CONSTRAINT "Bookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscribe"
    ADD CONSTRAINT "Subscribe_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscribe"
    ADD CONSTRAINT "Subscribe_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketLock"
    ADD CONSTRAINT "TicketLock_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketLock"
    ADD CONSTRAINT "TicketLock_ticketTypeId_fkey" FOREIGN KEY ("ticketTypeId") REFERENCES "TicketType" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
