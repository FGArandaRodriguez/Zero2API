import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function (
    req: NextApiRequest,
    res: NextApiResponse
) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,DELETE');
    if (req.method === 'GET'){
        try{

            const menu = await prisma.menu.findMany();
            res.status(200).json(menu);
        }catch(error){
            res.status(500).json({message:'Error al crear el  Menu', error});
        }
    } else if (req.method === 'POST'){
        const { nombre, descripcion, precio, imagen, idCategoria } = req.body;
        if (!nombre || !precio || !descripcion || !imagen || !idCategoria){
            return res.status(400).json({message: 'Faltan campos requeridos '})
        }

        try{

            const newMenu = await prisma.menu.create({
                data: {
                    nombre,
                    descripcion,
                    precio: parseFloat(precio),
                    imagen,
                    id_categoria: idCategoria
                },
            });
            res.status(201).json(newMenu);
        }catch(error){
            res.status(500).json({message: 'Error al crear el Menu', error});
        }
    }else if(req.method === 'PUT'){
        const { id, nombre, descripcion, precio, imagen, idCategoria } = req.body;
        if ( !id || !nombre || !precio || !descripcion || !imagen || !idCategoria){
            return res.status(400).json({message: 'Faltan campos requeridos'})
        }

        try{
            const updateMenu = await prisma.menu.update({
                where: {id: parseInt(id)},
                data: {
                    nombre,
                    descripcion,
                    precio: parseFloat(precio),
                    imagen,
                    id_categoria: idCategoria
                },
            });
            res.status(201).json(updateMenu);
        }catch(error){
            res.status(500).json({message: 'Error al actualizar el Menu', error});
        }

    } else if(req.method === 'DELETE'){
        const {id} = req.query;

        if (!id){
            return res.status(400).json({message: 'El id del Menú es requerido'});
        }

        try{
            //esto me va a servir para eliminar el Menú por ID
            const deleteMenu = await prisma.menu.delete({
                where: {id: parseInt(id as string)},
            });
            res.status(200).json(deleteMenu);
        }catch (error){
            res.status(500).json({message: 'Error al eliminar el Menu', error});
        }
    } else {
        res.status(405).json({message: 'Método no permitido'});
    }
    
}