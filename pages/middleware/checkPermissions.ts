import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const checkPermission = async (req: NextApiRequest, res: NextApiResponse, next: Function, requiredPermission: string) => {
    const authorization = req.headers.authorization;

    if (!authorization) {
        return res.status(401).json({ error: 'Sin Autorización' });
    }

    try {
        const token = authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: number; username: string };

        (req as any).user = decoded;

        // Verificar permisos en la base de datos
        const hasPermission = await prisma.permisosEmpleados.findFirst({
            where: {
                id_empleado: decoded.userId,
                permiso: {
                    nombre: requiredPermission,
                },
            },
        });

        if (!hasPermission) {
            return res.status(403).json({ error: 'No tienes permiso para realizar esta acción' });
        }

        // Procede a la siguiente función si tiene permiso
        next();
    } catch (err) {
        return res.status(401).json({ error: 'TOKEN INVALIDO LOGUEATE DE NUEVO!!!' });
    }
};
