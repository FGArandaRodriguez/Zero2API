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

            const mesa = await prisma.mesas.findMany();
            res.status(200).json(mesa);
        }catch(error){
            res.status(500).json({message:'Error al obtener la  Mesa', error});
        }
    } else if (req.method === 'POST'){
        const { capacidad_mesa, numero_mesa, estado_mesa, idEmpleado } = req.body;
        if (!capacidad_mesa || !numero_mesa || !idEmpleado){
            return res.status(400).json({message: `Faltan campos requeridos`})
        }

        try{

            const newMesa = await prisma.mesas.create({
                data: {
                    capacidad_mesa,
                    numero_mesa,
                    estado_mesa,
                    id_empleado:idEmpleado
                },
            });
            res.status(201).json(newMesa);
        }catch(error){
            res.status(500).json({message: 'Error al actualizar la Mesa', error});
        }
    }else if(req.method === 'PUT'){
        const { id, capacidad_mesa, numero_mesa, estado_mesa, idEmpleado } = req.body;
        if (!capacidad_mesa || !numero_mesa || !idEmpleado){
            return res.status(400).json({message: 'Faltan campos requeridos'})
        }

        try{
            const updatemesas = await prisma.mesas.update({
                where: {id: parseInt(id)},
                data: {
                    capacidad_mesa,
                    numero_mesa,
                    estado_mesa,
                    id_empleado:idEmpleado
                },
            });
            res.status(201).json(updatemesas);
        }catch(error){
            res.status(500).json({message: 'Error al actualizar la mesa', error});
        }

    } else if(req.method === 'DELETE'){
        const {id} = req.query;

        if (!id){
            return res.status(400).json({message: 'El id de la mesa es requerido'});
        }

        try{
            //esto me va a servir para eliminar la Mesa por ID
            const deletemesas = await prisma.mesas.delete({
                where: {id: parseInt(id as string)},
            });
            res.status(200).json(deletemesas);
        }catch (error){
            res.status(500).json({message: 'Error al eliminar la mesa', error});
        }
    } else {
        res.status(405).json({message: 'Método no permitido'});
    }
    
}