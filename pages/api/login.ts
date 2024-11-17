import type {  NextApiRequest, NextApiResponse } from "next";
import jwt from 'jsonwebtoken';
import { PrismaClient } from "@prisma/client";
import bcypt from 'bcrypt';

const prisma = new PrismaClient();

interface LoginResponse{
    token?: string;
    error?: string;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<LoginResponse>
) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const {method} = req;

    if (method == 'POST'){
        const { username, password } = req.body;


        const user = await prisma.user.findUnique({
            where: {username},
        });
        console.log(user)

        if (!user){
            
            return res.status(401).json({error:'Usuario no encontrado'});
        }

        const isPasswordValid = await bcypt.compare(password, user.password);

        if (!isPasswordValid){
            return res.status(401).json({error:'Contraseña incorrecta'});
        }

        //Generamos el token JWT
        const token = jwt.sign(
            {userId: user.id, username: user.username, password: password},
            process.env.JWT_SECRET as string,
            {expiresIn: '1h'}
        );

        return res.status(200).json({token});
    }

    if (method != 'POST'){
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Método ${method} no permitido`);
    }


}