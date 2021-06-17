/*
  Warnings:

  - You are about to drop the column `ingresoId` on the `DetalleVenta` table. All the data in the column will be lost.
  - Added the required column `descuento` to the `DetalleVenta` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ventaId` to the `DetalleVenta` table without a default value. This is not possible if the table is not empty.
  - Made the column `precio` on table `DetalleVenta` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DetalleVenta" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "precio" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "descuento" INTEGER NOT NULL,
    "estado" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "articuloId" INTEGER NOT NULL,
    "ventaId" INTEGER NOT NULL,
    FOREIGN KEY ("articuloId") REFERENCES "Articulos" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("ventaId") REFERENCES "Ventas" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_DetalleVenta" ("articuloId", "cantidad", "createdAt", "estado", "id", "precio", "updatedAt") SELECT "articuloId", "cantidad", "createdAt", "estado", "id", "precio", "updatedAt" FROM "DetalleVenta";
DROP TABLE "DetalleVenta";
ALTER TABLE "new_DetalleVenta" RENAME TO "DetalleVenta";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
