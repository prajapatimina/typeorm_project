import { validate } from "class-validator";
import { Request, Response } from "express";
import { ERROR_MESSAGE, STATUS } from "../constant/role";
import { RoleDto } from "../dto/role/role.model";
import CustomError from "../errors/customError";
import roleService from "../service/roleService";

class RoleController{
    private static instance: RoleController;

    static getInstance(): RoleController{
        if(!RoleController.instance){
            RoleController.instance = new RoleController;
        }
        return RoleController.instance;
    }

    async create(req:Request,res:Response){
        try {
            const {permission} = req.body;
            const roleData = new RoleDto();
            roleData.name = req.body.name;
            roleData.permission = permission;


            const RoleValidation = await validate(roleData);

            if (RoleValidation.length > 0) {
                return res.send (RoleValidation[0].constraints);
            }

            const role = await roleService.create(roleData);
            return res.send(role);
        } catch (error) {
            return res.status(error.status || 400).json({
                code: error.status,
                msg: error.message
            });
        }
    }

    async getAll(req: Request,res:Response){
        try {
            const roles = await roleService.getAll();
            if (roles.length == 0) throw new CustomError(STATUS.notFound,ERROR_MESSAGE.notFound);
            return  res.send(roles);
        } catch (error) {
            return res.status(error.statusCode).json({
                code:error.status,
                msg:error.message
            });
        }
    }

    async getById(req:Request,res:Response){
        try {
            const role = await roleService.getById(req.params.id);
            return  res.send(role);
        } catch (error) {
            return res.status(error.status).json({
                code:error.status,
                msg:error.message
            });
        }
    }

    async update(req:Request,res:Response) {
        try {
            const id = parseInt(req.params.id);
            const role = await roleService.updateRole(id,req.body.name);
            return res.send(role);
        } catch (error) {
            return res.status(error.statusCode || 400).json({
                code: error.statusCode,
                msg:error.message
            });
        }
    }

    async deleteRole(req:Request,res:Response){
        try {
            const role = await roleService.deleteRole(parseInt(req.params.id));
            return  res.status(200).json({
                message:"Role deleted successfully.",
                role
            });
        } catch (error) {
            return res.status(error.status||404).json({
                code:error.statusCode,
                msg:error.message
            });
        }
    }
}

export default RoleController.getInstance();