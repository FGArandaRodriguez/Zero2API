import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

interface UserResponse {
  username?: string;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UserResponse>
) {
  const { method } = req;

  if (method === "POST") {
    const { username, password, nombre, cargo, isEmpleado = false, permisos = [] } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          username,
          password: hashedPassword,
          empleado: isEmpleado
            ? {
                create: {
                  nombre,
                  cargo,
                  permisos: {
                    create: permisos.map((permisoId: number) => ({
                      id_permiso: permisoId,
                    })),
                  },
                },
              }
            : undefined,
        },
      });

      console.log("Usuario creado:", user);
      return res.status(200).json({ username });
    } catch (error) {
      console.error("Error al crear usuario:", error);
      return res.status(500).json({ error: "Error al crear el usuario" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Método ${method} no permitido`);
  }
}
