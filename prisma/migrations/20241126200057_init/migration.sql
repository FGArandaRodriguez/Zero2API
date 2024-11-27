/*
  Warnings:

  - You are about to alter the column `estado` on the `ordenes_cocina` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `VarChar(191)`.
  - You are about to alter the column `fecha_hora` on the `reservas` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.

*/
-- AlterTable
ALTER TABLE `ordenes_cocina` MODIFY `estado` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `reservas` MODIFY `fecha_hora` TIMESTAMP NOT NULL;
