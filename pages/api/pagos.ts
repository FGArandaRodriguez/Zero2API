import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type PagoRequest = {
    id_pedido: number;
    id_metodo_pago: number;
    monto_pago: number;
    fecha_pago?: string;
};

type ApiResponse = {
    success: boolean;
    message: string;
    data?: any;
};

async function handlePago(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
    if (req.method === 'POST') {
        const { id_pedido, id_metodo_pago, monto_pago, fecha_pago }: PagoRequest = req.body;

        if (!id_pedido || !id_metodo_pago || !monto_pago) {
            return res.status(400).json({
                success: false,
                message: 'Faltan datos requeridos',
            });
        }

        if (monto_pago <= 0) {
            return res.status(400).json({
                success: false,
                message: 'El monto del pago debe ser mayor a 0',
            });
        }

        try {
            const pagos = await prisma.pago.findMany({
                where: { id_pedido }
            });

            const totalPagado = pagos.reduce((sum, pago) => sum + pago.monto_pago, 0);
            const nuevoTotalPagado = totalPagado + monto_pago;

            const pedido = await prisma.pedido.findUnique({
                where: { id_pedido: id_pedido },
            });

            if (!pedido) {
                return res.status(404).json({
                    success: false,
                    message: 'Pedido no encontrado',
                });
            }

            if (nuevoTotalPagado > pedido.total) {
                return res.status(400).json({
                    success: false,
                    message: 'El monto total ya ha sido alcanzado.',
                });
            }

            const nuevoPago = await prisma.pago.create({
                data: {
                    pedido: { connect: { id_pedido: id_pedido } },
                    metodo_pago: { connect: { id_metodo_pago: id_metodo_pago } },
                    monto_pago,
                    fecha_pago: fecha_pago ? new Date(fecha_pago) : new Date(),
                    total: pedido.total,
                },
            });

            const montoFaltante = pedido.total - nuevoTotalPagado;

            return res.status(200).json({
                success: true,
                message: 'Pago registrado exitosamente',
                data: {
                    nuevoPago,
                    totalPagado: nuevoTotalPagado,
                    montoFaltante,
                },
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Error al registrar el pago',
                data: (error as Error).message,
            });
        }
    } else if (req.method === 'GET') {
        const { id_pedido } = req.query;
        if (!id_pedido) {
            return res.status(400).json({
                success: false,
                message: 'id_pedido es requerido en la consulta',
            });
        }

        try {
            const pagos = await prisma.pago.findMany({
                where: { id_pedido: Number(id_pedido) },
                include: {
                    metodo_pago: true,
                },
            });

            const totalPagado = pagos.reduce((sum, pago) => sum + pago.monto_pago, 0);
            const pedido = await prisma.pedido.findUnique({
                where: { id_pedido: Number(id_pedido) },
            });

            if (!pedido) {
                return res.status(404).json({
                    success: false,
                    message: 'Pedido no encontrado',
                });
            }

            const montoFaltante = pedido.total - totalPagado;
            const pagadoCompleto = totalPagado >= pedido.total;

            return res.status(200).json({
                success: true,
                message: 'Pagos obtenidos exitosamente',
                data: {
                    pagos,
                    totalPagado,
                    montoFaltante,
                    pagadoCompleto,
                },
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Error al obtener los pagos',
                data: (error as Error).message,
            });
        }
    } else {
        res.setHeader('Allow', ['POST', 'GET']);
        res.status(405).end('Método ${req.method} no permitido');
    }
}

export default handlePago;