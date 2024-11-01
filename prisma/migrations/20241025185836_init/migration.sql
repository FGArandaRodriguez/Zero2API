/*
  Warnings:

  - The primary key for the `mesas` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `capacidad` on the `mesas` table. All the data in the column will be lost.
  - You are about to drop the column `estado` on the `mesas` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `mesas` table. All the data in the column will be lost.
  - You are about to drop the column `numero` on the `mesas` table. All the data in the column will be lost.
  - The primary key for the `reservas` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `confirmacion` on the `reservas` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `reservas` table. All the data in the column will be lost.
  - You are about to drop the column `numero_personas` on the `reservas` table. All the data in the column will be lost.
  - Added the required column `capacidad_mesa` to the `Mesas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_estado_mesa` to the `Mesas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_mesa` to the `Mesas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numero_mesa` to the `Mesas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_confirmacion` to the `Reservas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_reservas` to the `Reservas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numero_personas_reserva` to the `Reservas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `mesas` DROP PRIMARY KEY,
    DROP COLUMN `capacidad`,
    DROP COLUMN `estado`,
    DROP COLUMN `id`,
    DROP COLUMN `numero`,
    ADD COLUMN `capacidad_mesa` INTEGER NOT NULL,
    ADD COLUMN `id_estado_mesa` INTEGER NOT NULL,
    ADD COLUMN `id_mesa` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `numero_mesa` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id_mesa`);

-- AlterTable
ALTER TABLE `reservas` DROP PRIMARY KEY,
    DROP COLUMN `confirmacion`,
    DROP COLUMN `id`,
    DROP COLUMN `numero_personas`,
    ADD COLUMN `id_confirmacion` VARCHAR(191) NOT NULL,
    ADD COLUMN `id_reservas` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `numero_personas_reserva` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id_reservas`);

-- CreateTable
CREATE TABLE `estado_mesa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `estado` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `confirmacion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `estado` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Empleados` (
    `id_empleados` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_empleado` VARCHAR(191) NOT NULL,
    `puesto_empleado` VARCHAR(191) NOT NULL,
    `salario_empelado` DOUBLE NOT NULL,

    PRIMARY KEY (`id_empleados`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cliente` (
    `id_clientes` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_cliente` VARCHAR(191) NOT NULL,
    `id_reservas` INTEGER NOT NULL,
    `numero_telefono` INTEGER NOT NULL,
    `email_cliente` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_clientes`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
