import 'dotenv/config';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import logger from '../logger/logger';

const auth =(req:Request, res:Response,next)=>{
    try {

        const token = req.headers.authorization.split(" ")[1];
        if (!token) res.send("No token provided");
        const user = jwt.verify(token,process.env.JWT_SECRET);
        req['user'] = user;
        logger.info(req['user']);
        next();
    }
    catch (error) {
        logger.error(error.message);
        res.send('Access denied');
    }


};

export default auth;
