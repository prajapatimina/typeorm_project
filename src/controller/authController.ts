import { validate } from 'class-validator';
import { Request, Response } from 'express';
import { AuthDto } from '../dto/user/auth.model';
import authService from '../service/authService';
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
            const loginData = new AuthDto();
            loginData.email = req.body.email;
            loginData.password = req.body.password;

            const validationError = await validate(loginData);
            if(validationError.length > 0){
               return res.send(validationError[0].constraints);
            }

            const auth = await authService.login(loginData);
            return res.send(auth);
        } catch (error) {
            return res.status(error.status || 400).json({
                code: error.status,
                msg: error.errorMessage
            });
        }
    }

    async verifyLogin(req: Request, res: Response){
        try {
            const auth = await authService.loginVerify(req.body.email,req.body.code);
            return res.send(auth);
        } catch (error) {
            return res.status(error.statusCode).json({
                code: error.statusCode,
                msg: error.errorMessage
            });
        }
    }
}

export default AuthController.getInstance();
