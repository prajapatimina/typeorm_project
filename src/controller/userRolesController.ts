import { Request, Response } from "express";
import { ERROR_MESSAGE, STATUS } from "../constant/role";
import CustomError from "../errors/customError";
import userRolesService from "../service/userRolesService";

class UserRolesController{
    private static instance: UserRolesController;

    static getInstance(): UserRolesController{
        if(!UserRolesController.instance){
            UserRolesController.instance = new UserRolesController;
        }
        return UserRolesController.instance;
    }

    async getAll(req: Request,res:Response){
        try {
            const roles = await userRolesService.getAll();
            if (roles.length == 0) throw new CustomError(STATUS.notFound,ERROR_MESSAGE.notFound);
            res.send(roles);
        } catch (error) {
            return res.status(error.statusCode).json({
                code:error.status,
                msg:error.message
            });
        }
    }

    async getById(req:Request,res:Response){
        try {
            const userRole = await userRolesService.getById(parseInt(req.params.id));
            return res.send(userRole);
        } catch (error) {
            return res.status(error.statusCode || 400).json({
                code:error.status,
                msg:error.message
            });
        }
    }

    async update(req:Request,res:Response){
        try {
            const id = parseInt(req.params.id);
            const userRole = await userRolesService.update(id,req.body);
            res.send(userRole);
        } catch (error) {
            return res.status(error.statusCode || 400).json({
                code: error.statusCode,
                msg:error.message
            });
        }
    }
}
export default UserRolesController.getInstance();