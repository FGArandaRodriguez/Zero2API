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
            const Pedidos = await prisma.pedidos.findMany();
            res.status(200).json(Pedidos)
        }catch(error){
            res.status(500).json({message:'Error al obtener los Pedidos', error});
        }
    } else if (req.method === 'POST'){
        const { id_mesa,id_cliente,id_empleado, tipo_pedido} = req.body;
        if (!id_mesa || !id_cliente || !id_empleado || !tipo_pedido){
            return res.status(400).json({message: 'Faltan campos requeridos'})
        }

        try{
            const newPedido = await prisma.pedidos.create({
                data: {
                    fecha: new Date(),
                    id_mesa,
                    id_cliente,
                    id_empleado,
                    tipo_pedido
                },
            });
            res.status(201).json(newPedido);
        }catch(error){
            res.status(500).json({message: 'Error al crear el Pedido', error});
        }
    }else if(req.method === 'PUT'){
        const { id, id_mesa, id_cliente, id_empleado, tipo_pedido } = req.body;
        if (!id_mesa || !id_cliente || !id_empleado || !tipo_pedido){
            return res.status(400).json({message: 'Faltan campos requeridos'})
        }

        try{
            const updatePedido = await prisma.pedidos.update({
                where: {id: parseInt(id)},
                data: {
                    id_mesa,
                    id_cliente,
                    id_empleado,
                    tipo_pedido
                },
            });
            res.status(201).json(updatePedido);
        }catch(error){
            res.status(500).json({message: 'Error al crear el Pedido', error});
        }

    } else if(req.method === 'DELETE'){
        const {id} = req.query;

        if (!id){
            return res.status(400).json({message: 'El id del Pedido es requerido'});
        }

        try{
            //esto me va a servir para eliminar el Pedido por ID
            const deletePedido = await prisma.pedidos.delete({
                where: {id: parseInt(id as string)},
            });
            res.status(200).json(deletePedido);
        }catch (error){
            res.status(500).json({message: 'Error al eliminar el Pedido', error});
        }
    } else {
        res.status(405).json({message: 'Método no permitido'});
    }
    
}