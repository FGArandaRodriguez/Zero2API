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
            const products = await prisma.producto.findMany();
            res.status(200).json(products)
        }catch(error){
            res.status(500).json({message:'Error al obtener los productos', error});
        }
    } else if (req.method === 'POST'){
        const { nombre, descripcion, precio, stock } = req.body;
        if (!nombre || !precio || !descripcion || !stock){
            return res.status(400).json({message: 'Faltan campos requeridos'})
        }

        try{
            const newProduct = await prisma.producto.create({
                data: {
                    nombre,
                    precio: parseFloat(precio),
                    stock: parseInt(stock),
                    descripcion
                },
            });
            res.status(201).json(newProduct);
        }catch(error){
            res.status(500).json({message: 'Error al actualizar el producto', error});
        }
    }else if(req.method === 'PUT'){
        const { id, nombre, descripcion, precio, stock } = req.body;
        if (!nombre || !precio || !descripcion || !stock){
            return res.status(400).json({message: 'Faltan campos requeridos'})
        }

        try{
            const updateProduct = await prisma.producto.update({
                where: {id: parseInt(id)},
                data: {
                    nombre,
                    precio: parseFloat(precio),
                    stock: parseInt(stock),
                    descripcion
                },
            });
            res.status(201).json(updateProduct);
        }catch(error){
            res.status(500).json({message: 'Error al crear el producto', error});
        }

    } else if(req.method === 'DELETE'){
        const {id} = req.query;

        if (!id){
            return res.status(400).json({message: 'El id del producto es requerido'});
        }

        try{
            //esto me va a servir para eliminar el producto por ID
            const deleteProduct = await prisma.producto.delete({
                where: {id: parseInt(id as string)},
            });
            res.status(200).json(deleteProduct);
        }catch (error){
            res.status(500).json({message: 'Error al eliminar el producto', error});
        }
    } else {
        res.status(405).json({message: 'Método no permitido'});
    }
    
}
