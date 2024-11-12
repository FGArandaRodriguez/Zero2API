/*
  Warnings:

  - Added the required column `fecha` to the `Producto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_clientes` to the `Producto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_empleado` to the `Producto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_mesa` to the `Producto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipo_pedido` to the `Producto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total` to the `Producto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `producto` ADD COLUMN `fecha` DATETIME(3) NOT NULL,
    ADD COLUMN `id_clientes` INTEGER NOT NULL,
    ADD COLUMN `id_empleado` INTEGER NOT NULL,
    ADD COLUMN `id_mesa` INTEGER NOT NULL,
    ADD COLUMN `tipo_pedido` VARCHAR(191) NOT NULL,
    ADD COLUMN `total` DOUBLE NOT NULL;

-- CreateTable
CREATE TABLE `Ticket` (
    `id_ticket` INTEGER NOT NULL AUTO_INCREMENT,
    `id_pedido` INTEGER NOT NULL,
    `id_metodo_pago` INTEGER NOT NULL,
    `total` DOUBLE NOT NULL,

    PRIMARY KEY (`id_ticket`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DetallePedido` (
    `id_detalle_pedido` INTEGER NOT NULL AUTO_INCREMENT,
    `id_pedido` INTEGER NOT NULL,
    `id_menu` INTEGER NOT NULL,
    `cantidad` INTEGER NOT NULL,
    `subtotal` DOUBLE NOT NULL,

    PRIMARY KEY (`id_detalle_pedido`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pago` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_pedido` INTEGER NOT NULL,
    `id_metodo_pago` INTEGER NOT NULL,
    `monto_pago` DOUBLE NOT NULL,
    `fecha_pago` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `total` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Menu` (
    `id_menu` INTEGER NOT NULL AUTO_INCREMENT,

    PRIMARY KEY (`id_menu`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Metodo_Pago` (
    `id_metodo_pago` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NULL,
    `tipo` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_metodo_pago`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pedido` (
    `id_pedido` INTEGER NOT NULL AUTO_INCREMENT,
    `total` DOUBLE NOT NULL,

    PRIMARY KEY (`id_pedido`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ProductoToTicket` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_ProductoToTicket_AB_unique`(`A`, `B`),
    INDEX `_ProductoToTicket_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_DetallePedidoToProducto` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_DetallePedidoToProducto_AB_unique`(`A`, `B`),
    INDEX `_DetallePedidoToProducto_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_PagoToProducto` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_PagoToProducto_AB_unique`(`A`, `B`),
    INDEX `_PagoToProducto_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Ticket` ADD CONSTRAINT `Ticket_id_pedido_fkey` FOREIGN KEY (`id_pedido`) REFERENCES `Pedido`(`id_pedido`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ticket` ADD CONSTRAINT `Ticket_id_metodo_pago_fkey` FOREIGN KEY (`id_metodo_pago`) REFERENCES `Metodo_Pago`(`id_metodo_pago`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetallePedido` ADD CONSTRAINT `DetallePedido_id_pedido_fkey` FOREIGN KEY (`id_pedido`) REFERENCES `Pedido`(`id_pedido`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetallePedido` ADD CONSTRAINT `DetallePedido_id_menu_fkey` FOREIGN KEY (`id_menu`) REFERENCES `Menu`(`id_menu`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pago` ADD CONSTRAINT `Pago_id_pedido_fkey` FOREIGN KEY (`id_pedido`) REFERENCES `Pedido`(`id_pedido`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pago` ADD CONSTRAINT `Pago_id_metodo_pago_fkey` FOREIGN KEY (`id_metodo_pago`) REFERENCES `Metodo_Pago`(`id_metodo_pago`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProductoToTicket` ADD CONSTRAINT `_ProductoToTicket_A_fkey` FOREIGN KEY (`A`) REFERENCES `Producto`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProductoToTicket` ADD CONSTRAINT `_ProductoToTicket_B_fkey` FOREIGN KEY (`B`) REFERENCES `Ticket`(`id_ticket`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DetallePedidoToProducto` ADD CONSTRAINT `_DetallePedidoToProducto_A_fkey` FOREIGN KEY (`A`) REFERENCES `DetallePedido`(`id_detalle_pedido`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DetallePedidoToProducto` ADD CONSTRAINT `_DetallePedidoToProducto_B_fkey` FOREIGN KEY (`B`) REFERENCES `Producto`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PagoToProducto` ADD CONSTRAINT `_PagoToProducto_A_fkey` FOREIGN KEY (`A`) REFERENCES `Pago`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PagoToProducto` ADD CONSTRAINT `_PagoToProducto_B_fkey` FOREIGN KEY (`B`) REFERENCES `Producto`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
