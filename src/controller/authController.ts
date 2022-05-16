import { Request, Response } from 'express';
import authService from '../service/authService';
import CustomError from '../errors/customError';


class AuthController {
    private static instance: AuthController;

    static getInstance(): AuthController {
        if (!AuthController.instance) {
            AuthController.instance = new AuthController();
        }
        return AuthController.instance;
    }

    async login(req: Request, res: Response) {
        try {
            const auth = await authService.login(req.body);
            res.send(auth);
        } catch (error) {
            return res.status(error.status).json({
                code: error.status,
                msg: error.errorMessage
            });
        }
    }

    async verifyLogin(req: Request, res: Response){
        try {
            const auth = await authService.loginVerify(req.body.email,req.body.code);
            res.send(auth);
        } catch (error) {
            return res.status(error.statusCode).json({
                code: error.statusCode,
                msg: error.errorMessage
            });
        }
    }
}

export default AuthController.getInstance();
