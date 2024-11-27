import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { action, nombre, descripcion, activo, cargo_adicional } = req.body;

        try {
            if (action === 'create') {
                // Crear un nuevo método de pago
                const metodoPago = await prisma.metodo_Pago.create({
                    data: {
                        nombre,
                        descripcion,
                        activo: activo ?? true,
                        cargo_adicional: cargo_adicional ?? 0.0,
                    },
                });
                return res.status(201).json({
                    success: true,
                    message: 'Método de pago creado exitosamente',
                    data: metodoPago,
                });
            } else if (action === 'update') {
                const { id, nombre, descripcion, activo, cargo_adicional } = req.body;

                // Actualizar un método de pago existente
                const metodoPago = await prisma.metodo_Pago.update({
                    where: { id },
                    data: {
                        nombre,
                        descripcion,
                        activo,
                        cargo_adicional,
                        ultima_actualizacion: new Date(),
                    },
                });
                return res.status(200).json({
                    success: true,
                    message: 'Método de pago actualizado exitosamente',
                    data: metodoPago,
                });
            } else if (action === 'delete') {
                const { id } = req.body;

                // Eliminar un método de pago
                await prisma.metodo_Pago.delete({
                    where: { id },
                });
                return res.status(200).json({
                    success: true,
                    message: 'Método de pago eliminado exitosamente',
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: 'Acción no válida. Use "create", "update" o "delete".',
                });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: 'Error al procesar la solicitud',
                error: (error as Error).message,
            });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Método ${req.method} no permitido`);
    }
}