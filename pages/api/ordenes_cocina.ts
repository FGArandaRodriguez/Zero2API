import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// CORS middleware
const allowCors = (fn: Function) => async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  return await fn(req, res);
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getOrders(req, res);
    case 'POST':
      return createOrder(req, res);
    case 'PUT':
      return updateOrder(req, res);
    case 'DELETE':
      return deleteOrder(req, res);
    case 'PATCH':
      return updateStatusOrder(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`); 
  }
}

async function updateStatusOrder(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const { estado } = req.body;

  if (!id) {
    return res.status(400).json({ message: 'El id de la orden es requerido' });
  }

  if (!estado) {
    return res.status(400).json({ message: 'El estado de la orden es requerido' });
  }

  try {
    const updatedOrder = await prisma.ordenes_cocina.update({
      where: { id_ordenes_cocina: parseInt(id as string) },
      data: { estado: estado },
    });
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el estado de la orden', error });
  }
}

async function getOrders(req: NextApiRequest, res: NextApiResponse) {
  try {
    const orders = await prisma.ordenes_cocina.findMany();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las ordenes', error });
  }
}

async function createOrder(req: NextApiRequest, res: NextApiResponse) {
  const { id_pedidos, id_menu, cantidad, estado } = req.body;

  if (!id_pedidos || !id_menu || !cantidad || !estado) {
    return res.status(400).json({ message: 'Faltan campos requeridos' });
  }

  try {
    const newOrder = await prisma.ordenes_cocina.create({
      data: {
        id_pedidos: parseInt(id_pedidos),
        id_menu: parseInt(id_menu),
        cantidad: parseInt(cantidad),
        estado: estado
      },
    });
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la orden', error });
  }
}

async function updateOrder(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const { id_pedidos, id_menu, cantidad, estado } = req.body;

  if (!id) {
    return res.status(400).json({ message: 'El id de la orden es requerido' });
  }

  if (!id_pedidos && !id_menu && !cantidad && !estado) {
    return res.status(400).json({ message: 'Se requiere al menos un campo para actualizar' });
  }

  try {
    const updatedOrder = await prisma.ordenes_cocina.update({
      where: { id_ordenes_cocina: Number(id) },
      data: {
        ...(id_pedidos && { id_pedidos: parseInt(id_pedidos) }),
        ...(id_menu && { id_menu: parseInt(id_menu) }),
        ...(cantidad && { cantidad: parseInt(cantidad) }),
        ...(estado && { estado: estado })
      },
    });
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la orden', error });
  }
}

async function deleteOrder(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: 'El id de la orden es requerido' });
  }

  try {
    const deletedOrder = await prisma.ordenes_cocina.delete({
      where: { id_ordenes_cocina: parseInt(id as string) },
    });
    res.status(200).json(deletedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la orden', error });
  }
}

export default allowCors(handler);