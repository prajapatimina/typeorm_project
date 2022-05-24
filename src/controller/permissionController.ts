import { Request, Response } from "express";
import permissionService from "../service/permissionService";

class PermissionController{
    private static instance: PermissionController;

    static getInstance(): PermissionController{
        if(!PermissionController.instance){
            PermissionController.instance = new PermissionController;
        }
        return PermissionController.instance;
    }

    async create(req:Request,res:Response){
        const permission = await permissionService.create(req.body);
        res.send(permission);
    }

    async getAll(req:Request,res:Response){
        try {
            const permission = await permissionService.getAll();
            res.status(200).json({permission});
        } catch (error) {
            return res.status(error.statusCode).json({
                code: error.statusCode,
                msg:error.message
            });
        }
    }

    async getById(req:Request,res:Response){
        try {
            const permission = await permissionService.getById(parseInt(req.params.id));
            res.status(200).json({permission});
        } catch (error) {
            return res.status(error.statusCode).json({
                code: error.statusCode,
                msg:error.message
            });
        }
    }

    async updatePermission(req:Request,res:Response){
        try {
            const permission = await permissionService.update(parseInt(req.params.id),req.body);
            res.status(200).json({
                message:"Permission updated successfully.",
                permission
            });
        } catch (error) {
            return res.status(error.statusCode).json({
                code: error.statusCode,
                msg:error.message
            });
        }
    }

    async deletePermission(req:Request,res:Response){
        try {
            const permission = await permissionService.delete(parseInt(req.params.id));
            res.status(200).json({
                message:"Permission deleted successfully.",
                permission
            });
        } catch (error) {
            return res.status(error.statusCode).json({
                code:error.statusCode,
                msg:error.message
            });
        }
    }
}

export default PermissionController.getInstance();
