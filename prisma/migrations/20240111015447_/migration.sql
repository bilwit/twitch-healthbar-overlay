/*
  Warnings:

  - You are about to drop the column `redeems_id` on the `monster` table. All the data in the column will be lost.
  - You are about to drop the column `redeem_id` on the `redeems` table. All the data in the column will be lost.
  - Added the required column `twitch_id` to the `redeems` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "monster" DROP CONSTRAINT "monster_redeems_id_fkey";

-- AlterTable
ALTER TABLE "monster" DROP COLUMN "redeems_id";

-- AlterTable
ALTER TABLE "redeems" DROP COLUMN "redeem_id",
ADD COLUMN     "twitch_id" VARCHAR(255) NOT NULL;

-- CreateTable
CREATE TABLE "monsters_on_redeems" (
    "monster_id" INTEGER NOT NULL,
    "redeems_id" INTEGER NOT NULL,

    CONSTRAINT "monsters_on_redeems_pkey" PRIMARY KEY ("monster_id","redeems_id")
);

-- AddForeignKey
ALTER TABLE "monsters_on_redeems" ADD CONSTRAINT "monsters_on_redeems_monster_id_fkey" FOREIGN KEY ("monster_id") REFERENCES "monster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monsters_on_redeems" ADD CONSTRAINT "monsters_on_redeems_redeems_id_fkey" FOREIGN KEY ("redeems_id") REFERENCES "redeems"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
