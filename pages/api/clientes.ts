import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    
    if (req.method === 'GET') {
        const { id_clientes } = req.query;

        try {
            if (id_clientes) {
                // Obtener un cliente por ID
                const cliente = await prisma.clientes.findUnique({
                    where: { id_cliente: parseInt(id_clientes as string) }
                });
                if (!cliente) return res.status(404).json({ message: 'Cliente no encontrado' });
                res.status(200).json(cliente);
            } else {
                // Obtener todos los clientes
                const clientes = await prisma.clientes.findMany();
                res.status(200).json(clientes);
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener los clientes', error });
        }
        
    } else if (req.method === 'POST') {
        const { nombre, telefono, email, id_reserva } = req.body;
        if (!nombre || !telefono || !email || !id_reserva) {
            return res.status(400).json({ message: 'Faltan campos requeridos' });
        }

        try {
            const newCliente = await prisma.clientes.create({
                data: {
                    nombre,
                    telefono,
                    email,
                    id_reserva: parseInt(id_reserva),
                },
            });
            res.status(201).json(newCliente);
        } catch (error) {
            res.status(500).json({ message: 'Error al crear el cliente', error });
        }
        
    } else if (req.method === 'PUT') {
        const { id_clientes, nombre, telefono, email, id_reserva } = req.body;
        if (!id_clientes || !nombre || !telefono || !email || !id_reserva) {
            return res.status(400).json({ message: 'Faltan campos requeridos' });
        }

        try {
            const updateCliente = await prisma.clientes.update({
                where: { id_cliente: parseInt(id_clientes) },
                data: {
                    nombre,
                    telefono,
                    email,
                    id_reserva: parseInt(id_reserva),
                },
            });
            res.status(200).json(updateCliente);
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar el cliente', error });
        }
        
    } else if (req.method === 'DELETE') {
        const { id_cliente } = req.query;

        if (!id_cliente) {
            return res.status(400).json({ message: 'El id del cliente es requerido' });
        }

        try {
            const deleteCliente = await prisma.clientes.delete({
                where: { id_cliente: parseInt(id_cliente as string) },
            });
            res.status(200).json(deleteCliente);
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar el cliente', error });
        }
        
    } else {
        res.status(405).json({ message: 'Método no permitido' });
    }
}
