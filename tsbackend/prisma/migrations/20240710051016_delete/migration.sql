/*
  Warnings:

  - You are about to drop the column `home` on the `Kanban` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Kanban` table. All the data in the column will be lost.
  - You are about to drop the `KanbanCard` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `KanbanColumn` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `data` to the `Kanban` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "KanbanCard" DROP CONSTRAINT "KanbanCard_columnId_fkey";

-- DropForeignKey
ALTER TABLE "KanbanColumn" DROP CONSTRAINT "KanbanColumn_kanbanId_fkey";

-- AlterTable
ALTER TABLE "Kanban" DROP COLUMN "home",
DROP COLUMN "title",
ADD COLUMN     "data" JSONB NOT NULL;

-- DropTable
DROP TABLE "KanbanCard";

-- DropTable
DROP TABLE "KanbanColumn";
