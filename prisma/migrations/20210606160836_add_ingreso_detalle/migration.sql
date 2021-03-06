-- CreateTable
CREATE TABLE "Ingresos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tipo_comprobante" TEXT,
    "serie_comprobante" TEXT,
    "num_comprobante" TEXT,
    "impuesto" INTEGER,
    "total" INTEGER NOT NULL,
    "estado" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "personaId" INTEGER NOT NULL,
    FOREIGN KEY ("userId") REFERENCES "Users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("personaId") REFERENCES "Personas" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DetalleIngeso" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "precio" INTEGER,
    "cantidad" INTEGER NOT NULL,
    "estado" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "articuloId" INTEGER NOT NULL,
    "ingresoId" INTEGER NOT NULL,
    FOREIGN KEY ("articuloId") REFERENCES "Articulos" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("ingresoId") REFERENCES "Ingresos" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
