import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function Mesas(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // Configurar encabezados de CORS
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Manejar la solicitud OPTIONS (preflight)
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

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
                    console.log('Mesa ${mesaTemporal.id} eliminada automáticamente');
                }, 1000 * 60 * 60); // 1 hora

                res.status(201).json(mesaTemporal);
            } catch (error) {
                res.status(500).json({ message: 'Error al crear la mesa temporal', error });
            }
        } else {
            if (!capacidad_mesa || !numero_mesa || !estado_mesa || !id_empleado) {
                return res.status(400).json({ message: 'Faltan campos requeridos' });
            }

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
        const { id, capacidad_mesa, numero_mesa, estado_mesa, id_empleado } = req.body;

        if (!capacidad_mesa || !numero_mesa || !estado_mesa || !id_empleado) {
            return res.status(400).json({ message: 'Faltan campos requeridos' });
        }

        try {
            const updatedMesa = await prisma.mesas.update({
                where: { id: parseInt(id) },
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
        const { id, estado_mesa } = req.body;

        if (!id || estado_mesa === undefined) {
            return res.status(400).json({ message: 'Faltan campos requeridos' });
        }

        try {
            const updatedMesaState = await prisma.mesas.update({
                where: { id: parseInt(id) },
                data: { estado_mesa: parseInt(estado_mesa) },
            });
            res.status(200).json(updatedMesaState);
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar el estado de la mesa', error });
        }
    } else if (req.method === 'DELETE') {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ message: 'El id de la mesa es requerido' });
        }

        try {
            const deleteMesa = await prisma.mesas.delete({
                where: { id: parseInt(id as string) },
            });
            res.status(200).json(deleteMesa);
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar la mesa', error });
        }
    } else {
        res.status(405).json({ message: 'Método no permitido' });
    }
}