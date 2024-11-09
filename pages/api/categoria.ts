import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { checkPermission } from "../middleware/checkPermissions";

const prisma = new PrismaClient();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,PUT,DELETE');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method === 'GET') {
        try {
            const categories = await prisma.categoria.findMany();
            res.status(200).json(categories);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener las categorías', error });
        }
    } else if (req.method === 'POST') {
        const { nombre_categoria } = req.body;
        if (!nombre_categoria) {
            return res.status(400).json({ message: 'El nombre de la categoría es requerido' });
        }

        try {
            const newCategory = await prisma.categoria.create({
                data: { nombre_categoria },
            });
            res.status(201).json(newCategory);
        } catch (error) {
            res.status(500).json({ message: 'Error al crear la categoría', error });
        }
    } else if (req.method === 'PUT') {
        const { id_categoria, nombre_categoria } = req.body;
        if (!id_categoria || !nombre_categoria) {
            return res.status(400).json({ message: 'Faltan campos requeridos' });
        }

        try {
            const updatedCategory = await prisma.categoria.update({
                where: { id_categoria: parseInt(id_categoria) },
                data: { nombre_categoria },
            });
            res.status(200).json(updatedCategory);
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar la categoría', error });
        }
    } else if (req.method === 'DELETE') {
        const { id_categoria } = req.query;

        if (!id_categoria) {
            return res.status(400).json({ message: 'El id de la categoría es requerido' });
        }

        try {
            const deletedCategory = await prisma.categoria.delete({
                where: { id_categoria: parseInt(id_categoria as string) },
            });
            res.status(200).json(deletedCategory);
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar la categoría', error });
        }
    } else {
        res.status(405).json({ message: 'Método no permitido' });
    }
}
