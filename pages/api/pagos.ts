import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Pago } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;

    switch (method) {
        case 'POST':
            try {
                const { id_pedido, id_metodo_pago, total } = req.body as {
                    id_pedido: number;
                    id_metodo_pago: number;
                    total: number;
                };

                // Validación básica
                if (!id_pedido || !id_metodo_pago || total === undefined) {
                    return res.status(400).json({ error: "Por favor, provee id_pedido, id_metodo_pago, y total" });
                }

                // Crear el pago en la base de datos
                const pago: Pago = await prisma.pago.create({
                    data: {
                        id_pedido,
                        id_metodo_pago,
                        total,
                    },
                });

                res.status(201).json(pago);
            } catch (error) {
                res.status(500).json({ error: "Error al crear el pago" });
            }
            break;

        case 'GET':
            try {
                const pagos = await prisma.pago.findMany({
                    include: {
                        pedido: true,
                        metodo_pago: true,
                    },
                });
                res.status(200).json(pagos);
            } catch (error) {
                res.status(500).json({ error: "Error al obtener los pagos" });
            }
            break;

        default:
            res.setHeader('Allow', ['POST', 'GET']);
            res.status(405).end(`Método ${method} no permitido`);
    }
}