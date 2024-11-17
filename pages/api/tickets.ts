import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function name(
    req: NextApiRequest,
    res: NextApiResponse
) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,DELETE');
    if (req.method === 'GET') {
        //encontrar un solo ticket
        const { id } = req.query;

        if (id) { 
            if (Array.isArray(id)) {
                return res.status(400).json({ message: 'ID de ticket inválido' });
            }

            try {
                const ticket = await prisma.ticket.findUnique({
                    where: { id_ticket: Number(id) },
                    include: {
                        pedido: {
                            select: {
                                fecha: true,
                                Pago: { 
                                    select: {
                                      total: true,
                                      fecha_pago: true
                                      
                                    }
                                },
                                DetallePedido: {
                                    select: {
                                        cantidad: true,
                                        subtotal: true,
                                        Menu: {
                                            select: {
                                                nombre: true, 
                                                precio: true
                                            }
                                        }
                                    }
                                }
                            },
                        },
                        metodo_pago: {
                            select: {
                                nombre: true,            
                                cargo_adicional: true,
                            }
                        }
                    }
                });

                if (!ticket) {
                    return res.status(404).json({ message: 'Ticket no encontrado' });
                }

                res.status(200).json(ticket);
            } catch (error) {
                res.status(500).json({ message: 'Error al obtener el ticket', error });
            }
        }
        else {
            //varios tickets
            try {
                const tickets = await prisma.ticket.findMany();
                res.status(200).json(tickets)
            } catch (error) {
                res.status(500).json({ message: 'Error al obtener los tickets', error });
            }
        }
    } else if (req.method === 'POST') {
        const { id_pedido, id_metodo_pago } = req.body;
        if (!id_pedido || !id_metodo_pago) {
            return res.status(400).json({ message: 'Faltan campos requeridos' });
        }
    
        try {
            const totalSum = await prisma.pago.aggregate({
                where: { id_pedido: Number(id_pedido) },
                _sum: {
                    total: true,
                },
            });
            const total = totalSum._sum.total || 0;

            const newTicket = await prisma.ticket.create({
                data: {
                    id_pedido: parseInt(id_pedido),
                    id_metodo_pago: parseInt(id_metodo_pago),
                    total: total,
                },
            });
            
            res.status(201).json(newTicket);
        } catch (error) {
            res.status(500).json({ message: 'Error al crear el ticket', error });
        }
    } else if (req.method === 'PUT') {
        const { id, id_pedido, id_metodo_pago} = req.body;
        if (!id_pedido || !id_metodo_pago) {
            return res.status(400).json({ message: 'Faltan campos requeridos' })
        }

        try {
            const totalSum = await prisma.pago.aggregate({
                where: { id_pedido: Number(id_pedido) },
                _sum: {
                    total: true,
                },
            });
            const total = totalSum._sum.total || 0;

            const updateProduct = await prisma.ticket.update({
                where: { id_ticket: parseInt(id) },
                data: {
                    id_pedido: parseInt(id_pedido),
                    id_metodo_pago: parseInt(id_metodo_pago),
                    total: total,
                },
            });
            res.status(201).json(updateProduct);
        } catch (error) {
            res.status(500).json({ message: 'Error al modificar el ticket', error });
        }

    } else if (req.method === 'DELETE') {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ message: 'El id del ticket es requerido' });
        }

        try {
            //esto me va a servir para eliminar el producto por ID
            const deleteProduct = await prisma.ticket.delete({
                where: { id_ticket: parseInt(id as string) },
            });
            res.status(200).json(deleteProduct);
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar el ticket', error });
        }
    } else {
        res.status(405).json({ message: 'Método no permitido' });
    }

}