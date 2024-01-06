/*
  Warnings:

  - Added the required column `redeem_id` to the `redeems` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "redeems" ADD COLUMN     "redeem_id" VARCHAR(255) NOT NULL;
