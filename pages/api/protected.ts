import type {  NextApiRequest, NextApiResponse } from "next";
import jwt from 'jsonwebtoken';
import { error } from "console";
import { userAgent } from "next/server";

interface AuthenticatedRequest extends NextApiRequest {
    user?: {
        userId: number;
        userName: string;
    };
}

export default function handler(
    req: AuthenticatedRequest,
    res: NextApiResponse
){
    const { authorization } = req.headers;

    if (!authorization){
        return res.status(401).json({error: 'Sin Autorización'})
    }

    try {
        const token = authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

        //Decodificamos el token y lo almacenamos en un request para su uso futuro
        req.user = decoded as {userId: number; userName: string};

        return res.status(200).json({message: 'La ruta está protegida para este usuario', user: req.user})

    }catch(err){
        return res.status(401).json({ error: 'TOKEN INVALIDO LOGUEATE DE NUEVO!!!'})
    }
}