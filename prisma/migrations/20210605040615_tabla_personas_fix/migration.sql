-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Personas" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "estado" INTEGER NOT NULL DEFAULT 1,
    "tipo_persona" TEXT NOT NULL DEFAULT 'CLIENTE',
    "tipo_documento" TEXT NOT NULL DEFAULT 'CEDULA',
    "num_documento" TEXT,
    "direccion" TEXT,
    "telefono" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    FOREIGN KEY ("userId") REFERENCES "Users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Personas" ("createdAt", "direccion", "email", "estado", "id", "nombre", "num_documento", "telefono", "tipo_documento", "tipo_persona", "updatedAt", "userId") SELECT "createdAt", "direccion", "email", "estado", "id", "nombre", "num_documento", "telefono", "tipo_documento", "tipo_persona", "updatedAt", "userId" FROM "Personas";
DROP TABLE "Personas";
ALTER TABLE "new_Personas" RENAME TO "Personas";
CREATE UNIQUE INDEX "Personas.email_unique" ON "Personas"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
