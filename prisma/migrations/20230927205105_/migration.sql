/*
  Warnings:

  - You are about to drop the column `createdAt` on the `monster` table. All the data in the column will be lost.
  - You are about to drop the column `hpMultiplier` on the `monster` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `monster` table. All the data in the column will be lost.
  - You are about to drop the column `channelName` on the `settings` table. All the data in the column will be lost.
  - You are about to drop the column `connectToTwitch` on the `settings` table. All the data in the column will be lost.
  - You are about to drop the column `listenerAuthCode` on the `settings` table. All the data in the column will be lost.
  - You are about to drop the column `listenerClientId` on the `settings` table. All the data in the column will be lost.
  - You are about to drop the column `listenerSecret` on the `settings` table. All the data in the column will be lost.
  - You are about to drop the column `listenerUserName` on the `settings` table. All the data in the column will be lost.
  - You are about to drop the `refreshtoken` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `channel_name` to the `settings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `listener_auth_code` to the `settings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `listener_client_id` to the `settings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `listener_secret` to the `settings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `listener_user_name` to the `settings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "monster" DROP COLUMN "createdAt",
DROP COLUMN "hpMultiplier",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "hp_multiplier" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "settings" DROP COLUMN "channelName",
DROP COLUMN "connectToTwitch",
DROP COLUMN "listenerAuthCode",
DROP COLUMN "listenerClientId",
DROP COLUMN "listenerSecret",
DROP COLUMN "listenerUserName",
ADD COLUMN     "channel_name" VARCHAR(255) NOT NULL,
ADD COLUMN     "is_connected" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "listener_auth_code" VARCHAR(255) NOT NULL,
ADD COLUMN     "listener_client_id" VARCHAR(255) NOT NULL,
ADD COLUMN     "listener_secret" VARCHAR(255) NOT NULL,
ADD COLUMN     "listener_user_name" VARCHAR(255) NOT NULL;

-- DropTable
DROP TABLE "refreshtoken";

-- CreateTable
CREATE TABLE "refresh_token" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "value" VARCHAR(255) NOT NULL,

    CONSTRAINT "refresh_token_pkey" PRIMARY KEY ("id")
);
