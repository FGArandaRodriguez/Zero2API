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
            const categorias = await prisma.categorias.findMany();
            res.status(200).json(categorias)
        }catch(error){
            res.status(500).json({message:'Error al obtener los categorias', error});
        }
    } else if (req.method === 'POST'){
        const { nombre } = req.body;
        if (!nombre){
            return res.status(400).json({message: 'Faltan campos requeridos'})
        }

        try{
            const newCategoria = await prisma.categorias.create({
                data: {
                    nombre
                },
            });
            res.status(201).json(newCategoria);
        }catch(error){
            res.status(500).json({message: 'Error al actualizar la categoria', error});
        }
    }else if(req.method === 'PUT'){
        const { id, nombre } = req.body;
        if (!nombre){
            return res.status(400).json({message: 'Faltan campos requeridos'})
        }

        try{
            const updateCategoria = await prisma.categorias.update({
                where: {id: parseInt(id)},
                data: {
                    nombre
                },
            });
            res.status(201).json(updateCategoria);
        }catch(error){
            res.status(500).json({message: 'Error al crear la categoria', error});
        }

    } else if(req.method === 'DELETE'){
        const {id} = req.query;

        if (!id){
            return res.status(400).json({message: 'El id de la categoria es requerido'});
        }

        try{
            const deleteCategoria = await prisma.categorias.delete({
                where: {id: parseInt(id as string)},
            });
            res.status(200).json(deleteCategoria);
        }catch (error){
            res.status(500).json({message: 'Error al eliminar el categoria', error});
        }
    } else {
        res.status(405).json({message: 'Método no permitido'});
    }
    
}
