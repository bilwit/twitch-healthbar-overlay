/*
  Warnings:

  - Added the required column `default_image` to the `redeems` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "redeems" ADD COLUMN     "default_image" VARCHAR(255) NOT NULL;
