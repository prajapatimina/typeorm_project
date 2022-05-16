import 'dotenv/config';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

const auth =(req:Request, res:Response,next)=>{
    try {

        const token = req.headers.authorization;
        if (!token) res.send("No token provided");
        const user = jwt.verify(token,process.env.JWT_SECRET);
        console.log(user,'form middleware1123');
        next();
    }
    catch (error) {
        console.log(error.message);
        res.send('Access denied');
    }


};

export default auth;