
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const IVA_Rate = 16;
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,PUT,DELETE');

  if (req.method === 'GET') {
    try {
      const detallesPedidos = await prisma.detallePedido.findMany();
      res.status(200).json(detallesPedidos);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener los detalles del pedido', error });
    }
  } else if (req.method === 'POST') {
    const { id_pedido, id_menu, cantidad } = req.body;

    if (!id_pedido || !id_menu || !cantidad) {
      return res.status(400).json({ message: 'Faltan campos requeridos' });
    }

    try {
      const pedido = await prisma.pedidos.findUnique({ where: { id: parseInt(id_pedido) } });
      const menu = await prisma.menu.findUnique({ where: { id: parseInt(id_menu) } });

      if (!pedido) {
        return res.status(404).json({ message: 'Pedido no encontrado' });
      }

      if (!menu) {
        return res.status(404).json({ message: 'Elemento de menú no encontrado' });
      }

      const subtotalSinIva = menu.precio * parseInt(cantidad);

      const iva = subtotalSinIva * IVA_Rate;
      const subtotalConIva = subtotalSinIva + iva;
      const newDetallePedido = await prisma.detallePedido.create({
        data: {
          id_pedido: parseInt(id_pedido),
          id_menu: parseInt(id_menu),
          cantidad: parseInt(cantidad),
          subtotal: subtotalConIva, 
        },
      });
      res.status(201).json(newDetallePedido);
    } catch (error) {
      res.status(500).json({ message: 'Error al crear el detalle del pedido', error });
    }
  } else if (req.method === 'PUT') {
    const { id_detalle_pedido, id_pedido, id_menu, cantidad, subtotal } = req.body;

    if (!id_detalle_pedido || !id_pedido || !id_menu || !cantidad || !subtotal) {
      return res.status(400).json({ message: 'Faltan campos requeridos' });
    }

    try {
      const updateDetallePedido = await prisma.detallePedido.update({
        where: { id_detalle_pedido: parseInt(id_detalle_pedido) },
        data: {
          id_pedido: parseInt(id_pedido),
          id_menu: parseInt(id_menu),
          cantidad: parseInt(cantidad),
          subtotal: parseFloat(subtotal),
        },
      });
      res.status(200).json(updateDetallePedido);
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar el detalle del pedido', error });
    }
  } else if (req.method === 'DELETE') {
    const { id_detalle_pedido } = req.query;

    if (!id_detalle_pedido) {
      return res.status(400).json({ message: 'El id del detalle del pedido es requerido' });
    }

    try {
      const deleteDetallePedido = await prisma.detallePedido.delete({
        where: { id_detalle_pedido: parseInt(id_detalle_pedido as string) },
      });
      res.status(200).json(deleteDetallePedido);
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar el detalle del pedido', error });
    }
  } else {
    res.status(405).json({ message: 'Método no permitido' });
  }
}