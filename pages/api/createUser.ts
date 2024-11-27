import type {  NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

interface UserResponse{
    username?: string;
    password?: string;
    error?: string;
}



export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<UserResponse>
) {
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    const {method} = req;
    if (method == 'POST'){
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data:{
                username: username,
                password: hashedPassword
            },
        });
        console.log('Usuario creado', user);
        return res.status(200).json({username, password})
    }
   
}