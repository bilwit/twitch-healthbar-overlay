/*
  Warnings:

  - You are about to drop the `Monster` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RefreshToken` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Settings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Monster";

-- DropTable
DROP TABLE "RefreshToken";

-- DropTable
DROP TABLE "Settings";

-- CreateTable
CREATE TABLE "monster" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "hpMultiplier" INTEGER NOT NULL DEFAULT 10,

    CONSTRAINT "monster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settings" (
    "id" SERIAL NOT NULL,
    "listenerAuthCode" VARCHAR(255) NOT NULL,
    "listenerClientId" VARCHAR(255) NOT NULL,
    "listenerSecret" VARCHAR(255) NOT NULL,
    "listenerUserName" VARCHAR(255) NOT NULL,
    "channelName" VARCHAR(255) NOT NULL,
    "connectToTwitch" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refreshToken" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "value" VARCHAR(255) NOT NULL,

    CONSTRAINT "refreshToken_pkey" PRIMARY KEY ("id")
);
