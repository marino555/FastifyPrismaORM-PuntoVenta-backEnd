/*
  Warnings:

  - You are about to drop the column `parentId` on the `Categorias` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Categorias" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "estado" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "categoriasId" INTEGER,
    FOREIGN KEY ("userId") REFERENCES "Users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("categoriasId") REFERENCES "Categorias" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Categorias" ("categoriasId", "createdAt", "descripcion", "estado", "id", "nombre", "updatedAt", "userId") SELECT "categoriasId", "createdAt", "descripcion", "estado", "id", "nombre", "updatedAt", "userId" FROM "Categorias";
DROP TABLE "Categorias";
ALTER TABLE "new_Categorias" RENAME TO "Categorias";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
