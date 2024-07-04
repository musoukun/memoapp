-- AlterTable
ALTER TABLE "Memo" ADD COLUMN     "accessCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lastAccessedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "title" SET DEFAULT '';

-- CreateIndex
CREATE INDEX "index_memos_on_last_accessed_at" ON "Memo"("lastAccessedAt");
