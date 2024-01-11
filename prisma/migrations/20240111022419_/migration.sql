/*
  Warnings:

  - A unique constraint covering the columns `[twitch_id]` on the table `redeems` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "redeems_twitch_id_key" ON "redeems"("twitch_id");
