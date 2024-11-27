import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function Reservas(
    req: NextApiRequest,
    res: NextApiResponse
) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,DELETE');
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
    }else if(req.method === 'PATCH'){
        const {id_reservas, id_cliente, id_mesa, fecha_hora, numero_persona_reservas, confirmacion } = req.body;
        if (!id_cliente || !id_mesa || !fecha_hora || !numero_persona_reservas || !confirmacion){
            return res.status(400).json({message: 'Faltan campos requeridos'})
        }

        

        if (fecha_hora){
            try {
                // Convertir la fecha recibida a objeto Date
                const nuevaFechaHora = new Date(fecha_hora);
                
                // Obtener todas las reservas que coinciden con la fecha y hora especificada
                const reservasExistentes = await prisma.reservas.findMany({
                    where: {
                        fecha_hora: nuevaFechaHora
                    }
                });

                // Obtener todas las mesas ya reservadas para esa fecha y hora
                const mesasReservadas = reservasExistentes.map(reserva => reserva.id_mesa);

                // Consultar todas las mesas disponibles que no están reservadas para esa fecha
                const mesasDisponibles = await prisma.mesas.findMany({
                    where: {
                        id: {
                            notIn: mesasReservadas
                        }
                    }
                });

               
                if (mesasDisponibles.length === 0) {
                    return res.status(400).json({ message: 'No hay mesas disponibles para esa fecha y hora' });
                }

                // Actualizar la reserva con la nueva fecha
                const updateReserva = await prisma.reservas.update({
                    where: { id_reservas: parseInt(id_reservas) },
                    data: {
                        fecha_hora: nuevaFechaHora
                    },
                });

                return res.status(200).json({ message: 'Reserva reagendada con éxito', mesasDisponibles, updateReserva });

            } catch (error) {
                return res.status(500).json({ message: 'Error al reagendar la reserva', error });
            }
        }

        if (confirmacion){
            const dataToUpdate:any = {};
            if (req.body.confirmacion) dataToUpdate.confirmacion = req.body.confirmacion;

            try {
                const updateReserva = await prisma.reservas.update({
                    where: { id_reservas: parseInt(id_reservas) },
                    data: dataToUpdate,
                });
                res.status(200).json(updateReserva);
            } catch (error) {
                res.status(500).json({ message: 'Error al confirmar la reserva', error });
            }
        }

    } else if(req.method === 'DELETE'){
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