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
            const empleados = await prisma.empleados.findMany();
            res.status(200).json(empleados)
        }catch(error){
            res.status(500).json({message:'Error al obtener los empleados', error});
        }
    } else if (req.method === 'POST'){
        const { nombre, puesto, salario } = req.body;
        if (!nombre || !puesto || !salario ){
            return res.status(400).json({message: 'Faltan campos requeridos'})
        }

        try{
            const newEmpleado = await prisma.empleados.create({
                data: {
                    nombre: nombre,
                    puesto: puesto,
                    salario: parseFloat(salario)
                },
            });
            res.status(201).json(newEmpleado);
        }catch(error){
            res.status(500).json({message: 'Error al actualizar el empleado', error});
        }
    }else if(req.method === 'PUT'){
        const { id, nombre, puesto, salario } = req.body;
        if (!nombre || !puesto || !salario){
            return res.status(400).json({message: 'Faltan campos requeridos'})
        }

        try{
            const updateEmpleado = await prisma.empleados.update({
                where: {id_empleado: parseInt(id)},
                data: {
                    nombre: nombre,
                    puesto: puesto,
                    salario: parseFloat(salario)
                },
            });
            res.status(201).json(updateEmpleado);
        }catch(error){
            res.status(500).json({message: 'Error al crear el empleado', error});
        }

    } else if(req.method === 'DELETE'){
        const {id} = req.query;

        if (!id){
            return res.status(400).json({message: 'El id del empleado es requerido'});
        }

        try{
            //esto me va a servir para eliminar el empleado por ID
            const deleteEmpleado = await prisma.empleados.delete({
                where: {id_empleado: parseInt(id as string)},
            });
            res.status(200).json(deleteEmpleado);
        }catch (error){
            res.status(500).json({message: 'Error al eliminar el empleado', error});
        }
    } else {
        res.status(405).json({message: 'Método no permitido'});
    }
    
}