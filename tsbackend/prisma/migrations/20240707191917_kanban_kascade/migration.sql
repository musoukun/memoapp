-- DropForeignKey
ALTER TABLE "Kanban" DROP CONSTRAINT "Kanban_userId_fkey";

-- AddForeignKey
ALTER TABLE "Kanban" ADD CONSTRAINT "Kanban_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
