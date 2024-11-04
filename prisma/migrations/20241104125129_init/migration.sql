-- CreateTable
CREATE TABLE `Mesas` (
    `id_mesa` INTEGER NOT NULL AUTO_INCREMENT,
    `capacidad_mesa` INTEGER UNSIGNED NOT NULL,
    `numero_mesa` INTEGER NOT NULL,
    `estado_mesa` TINYINT NOT NULL,
    `id_empleado` INTEGER NOT NULL,

    UNIQUE INDEX `Mesas_numero_mesa_key`(`numero_mesa`),
    INDEX `Mesas_id_empleado_idx`(`id_empleado`),
    PRIMARY KEY (`id_mesa`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Reservas` (
    `id_reservas` INTEGER NOT NULL AUTO_INCREMENT,
    `id_cliente` INTEGER NOT NULL,
    `id_mesa` INTEGER NOT NULL,
    `fecha_hora` TIMESTAMP NOT NULL,
    `numero_personas_reserva` INTEGER UNSIGNED NOT NULL,
    `confirmacion` TINYINT NOT NULL,

    INDEX `Reservas_id_mesa_idx`(`id_mesa`),
    INDEX `Reservas_id_cliente_idx`(`id_cliente`),
    INDEX `Reservas_fecha_hora_idx`(`fecha_hora`),
    PRIMARY KEY (`id_reservas`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Empleados` (
    `id_empleados` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_empleado` VARCHAR(100) NOT NULL,
    `puesto_empleado` VARCHAR(50) NOT NULL,
    `salario_empleado` DECIMAL(10, 2) NOT NULL,

    PRIMARY KEY (`id_empleados`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cliente` (
    `id_clientes` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_cliente` VARCHAR(100) NOT NULL,
    `numero_telefono` VARCHAR(20) NOT NULL,
    `email_cliente` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Cliente_email_cliente_key`(`email_cliente`),
    PRIMARY KEY (`id_clientes`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Mesas` ADD CONSTRAINT `Mesas_id_empleado_fkey` FOREIGN KEY (`id_empleado`) REFERENCES `Empleados`(`id_empleados`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reservas` ADD CONSTRAINT `Reservas_id_mesa_fkey` FOREIGN KEY (`id_mesa`) REFERENCES `Mesas`(`id_mesa`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reservas` ADD CONSTRAINT `Reservas_id_cliente_fkey` FOREIGN KEY (`id_cliente`) REFERENCES `Cliente`(`id_clientes`) ON DELETE RESTRICT ON UPDATE CASCADE;
