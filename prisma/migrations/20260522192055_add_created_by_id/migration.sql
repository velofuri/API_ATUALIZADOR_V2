/*
  Warnings:

  - Added the required column `createdById` to the `system_version` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_system_version" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "acronym" TEXT NOT NULL,
    "name" TEXT,
    "version" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDENTE',
    "note" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdById" TEXT NOT NULL,
    CONSTRAINT "system_version_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_system_version" ("acronym", "createdAt", "id", "name", "note", "status", "updatedAt", "version") SELECT "acronym", "createdAt", "id", "name", "note", "status", "updatedAt", "version" FROM "system_version";
DROP TABLE "system_version";
ALTER TABLE "new_system_version" RENAME TO "system_version";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
