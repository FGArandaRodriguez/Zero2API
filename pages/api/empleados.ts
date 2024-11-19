import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // Configuración de CORS
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Manejo de la solicitud OPTIONS para CORS
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method === 'GET'){
        try {
            const empleados = await prisma.empleados.findMany();
            res.status(200).json(empleados);
        } catch(error) {
            res.status(500).json({message:'Error al obtener los empleados', error});
        }
    } else if (req.method === 'POST'){
        const { nombre, puesto, salario } = req.body;
        if (!nombre || !puesto || !salario ){
            return res.status(400).json({message: 'Faltan campos requeridos'});
        }

        try {
            // Obtener el último ID
            const lastEmpleado = await prisma.empleados.findFirst({
                orderBy: {
                    id: 'desc'
                }
            });

            const nextId = lastEmpleado ? lastEmpleado.id + 1 : 1;

            const newEmpleado = await prisma.empleados.create({
                data: {
                    id: nextId,
                    nombre,
                    puesto,
                    salario: parseFloat(salario)
                },
            });
            res.status(201).json(newEmpleado);
        } catch(error) {
            res.status(500).json({message: 'Error al crear el empleado', error});
        }
    } else if(req.method === 'PUT'){
        const { id, nombre, puesto, salario } = req.body;
        if (!id || !nombre || !puesto || !salario){
            return res.status(400).json({message: 'Faltan campos requeridos'});
        }

        try {
            const updateEmpleado = await prisma.empleados.update({
                where: { id: parseInt(id) },
                data: {
                    nombre,
                    puesto,
                    salario: parseFloat(salario)
                },
            });
            res.status(200).json(updateEmpleado);
        } catch(error) {
            res.status(500).json({message: 'Error al actualizar el empleado', error});
        }

    } else if(req.method === 'DELETE'){
        const { id } = req.query;

        if (!id){
            return res.status(400).json({message: 'El id del empleado es requerido'});
        }

        try {
            const deleteEmpleado = await prisma.empleados.delete({
                where: { id: parseInt(id as string) },
            });

            // Verificar si quedan empleados
            const remainingEmpleados = await prisma.empleados.count();

            // Si no quedan empleados, reiniciar la secuencia de ID
            if (remainingEmpleados === 0) {
                await prisma.$executeRaw`ALTER TABLE Empleados AUTO_INCREMENT = 1;`;
            }

            res.status(200).json(deleteEmpleado);
        } catch (error) {
            res.status(500).json({message: 'Error al eliminar el empleado', error});
        }
    } else {
        res.status(405).json({message: 'Método no permitido'});
    }
}