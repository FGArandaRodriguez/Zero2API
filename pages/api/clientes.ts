import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function name(
    req: NextApiRequest,
    res: NextApiResponse
) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,DELETE');
    if (req.method === 'GET'){
        try{
            const clientes = await prisma.clientes.findMany();
            res.status(200).json(clientes)
        }catch(error){
            res.status(500).json({message:'Error al obtener los clientes', error});
        }
    } else if (req.method === 'POST'){
        const { nombre, telefono, email } = req.body;
        if (!nombre || !telefono || !email){
            return res.status(400).json({message: 'Faltan campos requeridos'})
        }

        try{
            const newCliente = await prisma.clientes.create({
                data: {
                    nombre,
                    telefono,
                    email
                },
            });
            res.status(201).json(newCliente);
        }catch(error){
            res.status(500).json({message: 'Error al actualizar el cliente', error});
        }
    }else if(req.method === 'PUT'){

        const { id, nombre, telefono, email } = req.body;

        if (!nombre || !telefono || !email){
            return res.status(400).json({message: 'Faltan campos requeridos'})
        }

        try{
            const updateCliente = await prisma.clientes.update({
                where: {id: parseInt(id)},
                data: {
                    nombre,
                    telefono,
                    email
                },
            });
            res.status(201).json(updateCliente);
        }catch(error){
            res.status(500).json({message: 'Error al crear el cliente', error});
        }

    } else if(req.method === 'DELETE'){
        const {id} = req.query;

        if (!id){
            return res.status(400).json({message: 'El id del cliente es requerido'});
        }

        try{
            //esto me va a servir para eliminar el cliente por ID
            const deleteCliente = await prisma.clientes.delete({
                where: {id: parseInt(id as string)},
            });
            res.status(200).json(deleteCliente);
        }catch (error){
            res.status(500).json({message: 'Error al eliminar el cliente', error});
        }
    } else {
        res.status(405).json({message: 'Método no permitido'});
    }
    
}
