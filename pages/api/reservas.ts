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
  
    if (req.method === 'GET') {
        const { crearReserva, fecha_hora } = req.query;
        

        try {
            const Reservas = await prisma.reservas.findMany({
                include: {
                    cliente: true, // Incluye la información del cliente
                    mesa: true
                },
            });
            res.status(200).json({ Reservas });
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener las Reservas', error });
        }
    } else if (req.method === 'POST') {
        const { id_cliente, id_mesa, fecha_hora, numero_personas_reserva, confirmacion } = req.body;
    
        if (!id_cliente || !id_mesa || !fecha_hora || !numero_personas_reserva || !confirmacion) {
            return res.status(400).json({ message: 'Faltan campos requeridos' });
        }
    
        const fechaHoraReserva = new Date(fecha_hora);
        const fechaHoraActual = new Date();
    
        // Validar que la fecha y hora de la reserva sea válida
        if (fechaHoraReserva < fechaHoraActual) {
            return res.status(400).json({ 
                message: 'No puedes realizar una reserva en una fecha y hora pasada.' 
            });
        }
    
        try {
            // Crear la reserva
            const newReserva = await prisma.reservas.create({
                data: {
                    id_cliente: parseInt(id_cliente),
                    id_mesa: parseInt(id_mesa),
                    fecha_hora: fechaHoraReserva,
                    numero_personas_reserva: parseInt(numero_personas_reserva),
                    confirmacion: confirmacion,
                },
            });
    
            // Actualizar el estado de la mesa a 'reservado' (suponiendo que 3 es el estado reservado)
            const updatedMesa = await prisma.mesas.update({
                where: { id: parseInt(id_mesa) },
                data: { estado_mesa: 3 }, // Actualiza el estado a 'reservado'
            });
    
            res.status(201).json({ newReserva, updatedMesa });
        } catch (error) {
            res.status(500).json({ 
                message: 'Error al crear la reserva o actualizar la mesa', 
                error 
            });
        }
    }else if (req.method === 'PATCH') {
        const { id_reservas, fecha_hora, confirmacion } = req.body;
    
        if (!id_reservas) {
            return res.status(400).json({ message: 'El id_reservas es requerido' });
        }
    
        const dataToUpdate: any = {};
    
        if (fecha_hora) {
            const nuevaFechaHora = new Date(fecha_hora);
            const fechaHoraActual = new Date();
    
            // Validar que la fecha y hora de la reserva no sea anterior o igual a la actual
            if (nuevaFechaHora <= fechaHoraActual) {
                return res.status(400).json({
                    message: 'No puedes actualizar la reserva a una fecha y hora pasada o actual.',
                });
            }
    
            try {
                const reservasExistentes = await prisma.reservas.findMany({
                    where: { fecha_hora: nuevaFechaHora },
                });
    
                const mesasReservadas = reservasExistentes.map((reserva) => reserva.id_mesa);
    
                const mesasDisponibles = await prisma.mesas.findMany({
                    where: {
                        id: {
                            notIn: mesasReservadas,
                        },
                    },
                });
    
                if (mesasDisponibles.length === 0) {
                    return res.status(400).json({ 
                        message: 'No hay mesas disponibles para esa fecha y hora.' 
                    });
                }
    
                dataToUpdate.fecha_hora = nuevaFechaHora;
            } catch (error) {
                return res.status(500).json({ 
                    message: 'Error al validar disponibilidad', 
                    error 
                });
            }
        }
    
        if (typeof confirmacion !== 'undefined') {
            dataToUpdate.confirmacion = confirmacion;
        }
    
        if (Object.keys(dataToUpdate).length === 0) {
            return res.status(400).json({ 
                message: 'No hay datos para actualizar' 
            });
        }
    
        try {
            const updatedReserva = await prisma.reservas.update({
                where: { id_reservas: parseInt(id_reservas) },
                data: dataToUpdate,
            });
    
            return res.status(200).json({
                message: 'Reserva actualizada con éxito',
                updatedReserva,
            });
        } catch (error) {
            return res.status(500).json({ 
                message: 'Error al actualizar la reserva', 
                error 
            });
        }
    } else if (req.method === 'DELETE') {
        const { id_reservas } = req.query;

        if (!id_reservas) {
            return res.status(400).json({ message: 'El id de reserva es requerido' });
        }

        try {
            const deleteReserva = await prisma.reservas.delete({
                where: { id_reservas: parseInt(id_reservas as string) },
            });
            res.status(200).json(deleteReserva);
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar la Reserva', error });
        }
    } else {
        res.status(405).json({ message: 'Método no permitido' });
    }
}
