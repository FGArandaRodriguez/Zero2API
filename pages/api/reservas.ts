import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function Reservas(
    req: NextApiRequest,
    res: NextApiResponse
) {
       // Configurar encabezados de CORS
       res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
       res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS');
       res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
   
       // Manejar la solicitud OPTIONS (preflight)
       if (req.method === 'OPTIONS') {
           return res.status(200).end();
       }
    if (req.method === 'GET'){
        try{
            const Reservas = await prisma.reservas.findMany();
           
            res.status(200).json({Reservas})
        }catch(error){
            res.status(500).json({message:'Error al obtener las Reservas', error});
        }
    } else if (req.method === 'POST'){
        const { id_cliente, id_mesa, fecha_hora, numero_persona_reservas, confirmacion } = req.body;
        if (!id_cliente || !id_mesa || !fecha_hora || !numero_persona_reservas || !confirmacion){
            return res.status(400).json({message: 'Faltan campos requeridos'})
        }

        try{
            const newReserva = await prisma.reservas.create({
                data: {
                    id_cliente: parseInt(id_cliente),
                    id_mesa: parseInt(id_mesa),
                    fecha_hora: new Date(fecha_hora),
                    numero_personas_reserva: parseInt(numero_persona_reservas),
                    confirmacion: confirmacion

                },
            });
            res.status(201).json(newReserva);
        }catch(error){
            res.status(500).json({message: 'Error al crear la mesa', error});
        }
    }else if (req.method === 'PATCH') {
        const { id_reservas, fecha_hora, confirmacion } = req.body;
    
        if (!id_reservas) {
            return res.status(400).json({ message: 'El id_reservas es requerido' });
        }
    
        // Crear un objeto para almacenar los datos que se van a actualizar
        const dataToUpdate: any = {};
    
        // Validar y asignar valores al objeto dataToUpdate
        if (fecha_hora) {
            const nuevaFechaHora = new Date(fecha_hora);
    
            // Validar si hay mesas disponibles para la nueva fecha y hora
            try {
                const reservasExistentes = await prisma.reservas.findMany({
                    where: { fecha_hora: nuevaFechaHora },
                });
    
                const mesasReservadas = reservasExistentes.map(
                    (reserva) => reserva.id_mesa
                );
    
                const mesasDisponibles = await prisma.mesas.findMany({
                    where: {
                        id: {
                            notIn: mesasReservadas,
                        },
                    },
                });
    
                if (mesasDisponibles.length === 0) {
                    return res
                        .status(400)
                        .json({ message: 'No hay mesas disponibles para esa fecha y hora' });
                }
    
                dataToUpdate.fecha_hora = nuevaFechaHora;
            } catch (error) {
                return res
                    .status(500)
                    .json({ message: 'Error al validar disponibilidad', error});
            }
        }
    
        if (typeof confirmacion !== 'undefined') {
            dataToUpdate.confirmacion = confirmacion;
        }
    
        // Verificar que hay datos para actualizar
        if (Object.keys(dataToUpdate).length === 0) {
            return res.status(400).json({ message: 'No hay datos para actualizar' });
        }
    
        try {
            // Actualizar la reserva con los datos proporcionados
            const updatedReserva = await prisma.reservas.update({
                where: { id_reservas: parseInt(id_reservas) },
                data: dataToUpdate,
            });
    
            return res.status(200).json({
                message: 'Reserva actualizada con éxito',
                updatedReserva,
            });
        } catch (error) {
            return res
                .status(500)
                .json({ message: 'Error al actualizar la reserva', error });
        }
    }

     else if(req.method === 'DELETE'){
        const {id_reservas} = req.query;

        if (!id_reservas){
            return res.status(400).json({message: 'El id de reserva es requerido'});
        }

        try{
            //esto me va a servir para eliminar el producto por ID
            const deleteReserva = await prisma.reservas.delete({
                where: {id_reservas: parseInt(id_reservas as string)},
            });
            res.status(200).json(deleteReserva);
        }catch (error){
            res.status(500).json({message: 'Error al eliminar la Reserva', error});
        }
    } else {
        res.status(405).json({message: 'Método no permitido'});
    }
}
