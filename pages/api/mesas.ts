import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function Mesas(
    req: NextApiRequest,
    res: NextApiResponse
) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS');

    if (req.method === 'GET'){
        try {
            const mesas = await prisma.mesas.findMany();
            res.status(200).json(mesas);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener las mesas', error });
        }
    } else if (req.method === 'POST') {
        const { numero, is_temp, capacidad_mesa, numero_mesa, estado_mesa, id_empleado } = req.body;

        if (is_temp) {
            // Crear mesa temporal
            try {
                const mesaTemporal = await prisma.mesas.create({
                    data: {
                        numero_mesa: numero,
                        estado_mesa: 2  // Estado específico para mesa temporal
                    },
                });

                // Eliminar mesa automáticamente después de 1 hora (3600 segundos)
                setTimeout(async () => {
                    await prisma.mesas.delete({
                        where: { id: mesaTemporal.id },
                    });
                    console.log(`Mesa ${mesaTemporal.id} eliminada automáticamente`);
                }, 1000 * 60 * 60); // 1 hora

                res.status(201).json(mesaTemporal);
            } catch (error) {
                res.status(500).json({ message: 'Error al crear la mesa temporal', error });
            }
        } else {
            // Validar campos requeridos
            if (!capacidad_mesa || !numero_mesa || !estado_mesa || !id_empleado) {
                return res.status(400).json({ message: 'Faltan campos requeridos' });
            }

            // Crear mesa regular
            try {
                const newMesa = await prisma.mesas.create({
                    data: {
                        capacidad_mesa: parseInt(capacidad_mesa),
                        numero_mesa: parseInt(numero_mesa),
                        estado_mesa: parseInt(estado_mesa),
                        id_empleado: parseInt(id_empleado)
                    },
                });
                res.status(201).json(newMesa);
            } catch (error) {
                res.status(500).json({ message: 'Error al crear la mesa', error });
            }
        }
    } else if (req.method === 'PUT') {
        const { id_mesa, capacidad_mesa, numero_mesa, estado_mesa, id_empleado } = req.body;

        if (!capacidad_mesa || !numero_mesa || !estado_mesa || !id_empleado) {
            return res.status(400).json({ message: 'Faltan campos requeridos' });
        }

        try {
            const updatedMesa = await prisma.mesas.update({
                where: { id_mesa: parseInt(id_mesa) },
                data: {
                    capacidad_mesa: parseInt(capacidad_mesa),
                    numero_mesa: parseInt(numero_mesa),
                    estado_mesa: parseInt(estado_mesa),
                    id_empleado: parseInt(id_empleado)
                },
            });
            res.status(200).json(updatedMesa);
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar la mesa', error });
        }
    } else if (req.method === 'PATCH') {
        const { id_mesa, estado_mesa } = req.body;

        if (!id_mesa || estado_mesa === undefined) {
            return res.status(400).json({ message: 'Faltan campos requeridos' });
        }

        try {
            const updatedMesaState = await prisma.mesas.update({
                where: { id_mesa: parseInt(id_mesa) },
                data: { estado_mesa: parseInt(estado_mesa) },
            });
            res.status(200).json(updatedMesaState);
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar el estado de la mesa', error });
        }
    } else if (req.method === 'DELETE') {
        const { id_mesa } = req.query;

        if (!id_mesa) {
            return res.status(400).json({ message: 'El id de la mesa es requerido' });
        }

        try {
            const deleteMesa = await prisma.mesas.delete({
                where: { id_mesa: parseInt(id_mesa as string) },
            });
            res.status(200).json(deleteMesa);
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar la mesa', error });
        }
    } else {
        res.status(405).json({ message: 'Método no permitido' });
    }
}
