/*
  Warnings:

  - Added the required column `title` to the `Kanban` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Kanban" ADD COLUMN     "title" TEXT NOT NULL;
