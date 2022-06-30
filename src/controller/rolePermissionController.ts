import { Request, Response } from "express";
import { ERROR_MESSAGE, STATUS } from "../constant/permission";
import { DELETE_MESSAGE } from "../constant/role";
import CustomError from "../errors/customError";
import rolePermissionService from "../service/rolePermissionService";

class RolePermissionController{
    private static instance: RolePermissionController;

    static getInstance(): RolePermissionController{
        if(!RolePermissionController.instance){
            RolePermissionController.instance = new RolePermissionController;
        }
        return RolePermissionController.instance;
    }

    async getAll(req:Request,res:Response){
        try {
            const rolePermission = await rolePermissionService.getAll();
            return res.send(rolePermission);
        } catch (error) {
            return res.status(error.status||400).json({
                code:error.status,
                msg:error.message
            });
        }
    }

    async getById(req:Request,res:Response){
        try {
            const rolePermission = await rolePermissionService.getById(parseInt(req.params.id));
            return res.send(rolePermission);
        } catch (error) {
            return res.status(error.status||400).json({
                code:error.status,
                msg:error.message
            });
        }
    }

    async update(req:Request,res:Response) {
        try {
            const id = parseInt(req.params.id);
            const role = await rolePermissionService.update(id,req.body);
            res.send(role);
        } catch (error) {
            return res.status(error.statusCode || 400).json({
                code: error.statusCode,
                msg:error.message
            });
        }
    }

    async delete(req:Request,res:Response){
        try {
            const role = await rolePermissionService.delete(parseInt(req.params.id));
            res.status(200).json({
                message:DELETE_MESSAGE,
                permission:role
            });
        } catch (error) {
            return res.status(error.status||404).json({
                code:error.statusCode,
                msg:error.message
            });
        }
    }

}

export default RolePermissionController.getInstance();
