import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { setTimeout } from "timers/promises";

const prisma = new PrismaClient();

// Middleware de CORS
const allowCors = (fn: Function) => async (req: NextApiRequest, res: NextApiResponse) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001"); // Cambiado a http://localhost:3001
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods","GET,POST,PUT,DELETE,OPTIONS,PATCH");
    res.setHeader("Access-Control-Allow-Headers","Content-Type, Authorization");

    // Respuesta inmediata para el método OPTIONS (preflight)
    if (req.method === "OPTIONS") {
      res.status(200).end();
      return;
    }

    return await fn(req, res);
  }; 

// Handler principal
async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001"); // Cambiado a http://localhost:3001
    res.setHeader("Access-Control-Allow-Methods","GET,POST,PUT,DELETE,OPTIONS,PATCH");
    switch (req.method) {
      case "GET":
        return getOrders(req, res);
      case "POST":
        return createOrder(req, res);
      case "PUT":
        return updateOrder(req, res);
      case "DELETE":
        return deleteOrder(req, res);
      case "PATCH":
        return updateStatusOrder(req, res);
      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE", "PATCH"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("Error en el handler principal:", error);
    res.status(500).json({ message: "Error interno del servidor", error });
  }
}

// Actualización de estado de órdenes
async function updateStatusOrder(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const { estado } = req.body;

  if (!id) {
    return res.status(400).json({ message: "El id de la orden es requerido" });
  }

  if (!estado) {
    return res
      .status(400)
      .json({ message: "El estado de la orden es requerido" });
  }

  try {
    const updatedOrder = await prisma.ordenes_cocina.update({
      where: { id_ordenes_cocina: parseInt(id as string) },
      data: { estado },
    });

    if (estado === "listo") {
      await setTimeout(30000); // 30 segundos
      await prisma.ordenes_cocina.delete({
        where: { id_ordenes_cocina: parseInt(id as string) },
      });

      return res
        .status(200)
        .json({
          message:
            "La orden fue eliminada automáticamente después de estar lista.",
        });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error al actualizar el estado de la orden:", error);
    res
      .status(500)
      .json({ message: "Error al actualizar el estado de la orden", error });
  }
}

// Obtener órdenes
    async function getOrders(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Consulta SQL directa
    const orders = await prisma.$queryRaw`
      SELECT 
        p.tipo_pedido, 
        me.numero_mesa, 
        m.nombre AS nombre_menu, 
        oc.cantidad, 
        oc.estado
      FROM ordenes_cocina AS oc
      LEFT JOIN pedidos AS p ON oc.id_pedidos = p.id
      LEFT JOIN mesas AS me ON p.id_mesa = me.id
      LEFT JOIN menu AS m ON oc.id_menu = m.id
      WHERE oc.estado <> 2`;

    // Enviar respuesta
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error al obtener las órdenes:", error);
    res.status(500).json({ message: "Error al obtener las órdenes", error });
  }
}


// Crear nueva orden
async function createOrder(req: NextApiRequest, res: NextApiResponse) {
  const { id_pedidos, id_menu, cantidad, estado } = req.body;

  if (!id_pedidos || !id_menu || !cantidad || !estado) {
    return res.status(400).json({ message: "Faltan campos requeridos" });
  }

  try {
    const newOrder = await prisma.ordenes_cocina.create({
      data: {
        id_pedidos: parseInt(id_pedidos),
        id_menu: parseInt(id_menu),
        cantidad: parseInt(cantidad),
        estado,
      },
    });
    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Error al crear la orden:", error);
    res.status(500).json({ message: "Error al crear la orden", error });
  }
}

// Actualizar orden existente
async function updateOrder(req: NextApiRequest, res: NextApiResponse) {
  
  const { id_ordenes_cocina, estado } = req.body;

  if (!id_ordenes_cocina) {
    return res.status(400).json({ message: "El id de la orden es requerido" });
  }

  try {
    const updatedOrder = await prisma.ordenes_cocina.update({
      where: { id_ordenes_cocina: Number(id_ordenes_cocina) },
      data: {
        ...(estado && { estado }),
      },
    });
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error al actualizar la orden:", error);
    res.status(500).json({ message: "Error al actualizar la orden", error });
  }
}

// Eliminar una orden
async function deleteOrder(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: "El id de la orden es requerido" });
  }

  try {
    const deletedOrder = await prisma.ordenes_cocina.delete({
      where: { id_ordenes_cocina: parseInt(id as string) },
    });
    res.status(200).json(deletedOrder);
  } catch (error) {
    console.error("Error al eliminar la orden:", error);
    res.status(500).json({ message: "Error al eliminar la orden", error });
  }
}



export default allowCors(handler);
