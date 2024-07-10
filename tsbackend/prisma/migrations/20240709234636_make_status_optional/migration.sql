/*
  Warnings:

  - You are about to drop the column `assignee` on the `KanbanCard` table. All the data in the column will be lost.
  - You are about to drop the column `dueDate` on the `KanbanCard` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `KanbanCard` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `KanbanCard` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `KanbanColumn` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "KanbanCard" DROP COLUMN "assignee",
DROP COLUMN "dueDate",
DROP COLUMN "notes",
DROP COLUMN "order",
ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "KanbanColumn" DROP COLUMN "order";
