-- CreateTable
CREATE TABLE `Mesas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `capacidad` INTEGER NOT NULL,
    `numero` INTEGER NOT NULL,
    `estado` BOOLEAN NOT NULL,
    `id_empleado` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Reservas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_cliente` INTEGER NOT NULL,
    `id_mesa` INTEGER NOT NULL,
    `fecha_hora` DATETIME(3) NOT NULL,
    `numero_personas` INTEGER NOT NULL,
    `confirmacion` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
