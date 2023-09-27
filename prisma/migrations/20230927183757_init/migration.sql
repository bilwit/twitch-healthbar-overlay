-- CreateTable
CREATE TABLE "Monster" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "hpMultiplier" INTEGER NOT NULL DEFAULT 10,

    CONSTRAINT "Monster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" SERIAL NOT NULL,
    "listenerAuthCode" VARCHAR(255) NOT NULL,
    "listenerClientId" VARCHAR(255) NOT NULL,
    "listenerSecret" VARCHAR(255) NOT NULL,
    "listenerUserName" VARCHAR(255) NOT NULL,
    "channelName" VARCHAR(255) NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);
