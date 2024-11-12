import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      return await createMetodoPago(req, res);
    case 'GET':
      return await getMetodosPago(req, res);
    default:
      return res.status(405).end('Method ${req.method} Not Allowed');
  }
}

async function createMetodoPago(req: NextApiRequest, res: NextApiResponse) {
  const { nombre, tipo } = req.body;

  try {
    const metodoPago = await prisma.metodo_Pago.create({
      data: {
        nombre,
        tipo,
      },
    });
    return res.status(201).json(metodoPago);
  } catch (error) {
    return res.status(500).json({ error: 'Error creating Metodo_Pago' });
  }
}

async function getMetodosPago(req: NextApiRequest, res: NextApiResponse) {
  try {
    const metodosPago = await prisma.metodo_Pago.findMany();
    return res.status(200).json(metodosPago);
  } catch (error) {
    return res.status(500).json({ error: 'Error retrieving Metodo_Pago' });
  }
}