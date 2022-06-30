import { ERROR_MESSAGE, STATUS } from "../constant/permission";
import { AppDataSource } from "../data-source";
import { RolePermission } from "../entity/RolesPermission";
import CustomError from "../errors/customError";
import logger from "../logger/logger";

const RolePermissionModel = AppDataSource.getRepository(RolePermission);

class RolePermissionService{
    static instance:RolePermissionService;

    static getInstance(): RolePermissionService {
        if (!RolePermissionService.instance) {
            RolePermissionService.instance = new RolePermissionService();
        }
        return RolePermissionService.instance;
    }

    async getAll(){
        try {
            const permission = await RolePermissionModel.find({relations:{role:true}});
        if(permission.length === 0) throw new CustomError(STATUS.invalid, ERROR_MESSAGE.notFound);
        return permission;
        } catch (error) {
            throw new CustomError(error.statusCode || error.status, error.errorMessage || error.message);
        }
    }


    async getById(id){
        try {
            const rolePermission = await RolePermissionModel.findOne({where:{id:id},
                relations:{role:true}});
            if(!rolePermission) throw new CustomError(STATUS.notFound, ERROR_MESSAGE.notFound);
            return rolePermission;
        } catch (error) {
            throw new CustomError(error.statusCode || error.status, error.errorMessage || error.message);
        }
    }

    async update(id,data){
        try {
            const rolePermission = await RolePermissionModel.findOneBy({ id: id });
            if (!rolePermission) throw new CustomError(STATUS.notFound, ERROR_MESSAGE.notFound);

            const updatedRole = await RolePermissionModel.merge(rolePermission, data);
            const update = await RolePermissionModel.save(updatedRole);
            return update;
        } catch (error) {
            throw new CustomError(error.statusCode || error.status, error.errorMessage || error.message);
        }
    }

    async delete(id) {
        try {
            const rolePermission = await RolePermissionModel.findOneBy({ id: id });
            logger.info(rolePermission);
            if (!rolePermission) throw new CustomError('404', ERROR_MESSAGE.notFound);

            await RolePermissionModel.remove(rolePermission);
            return rolePermission;
        } catch (error) {
            throw new CustomError(error.statusCode || error.status, error.errorMessage || error.message);
        }
    }

}

export default RolePermissionService.getInstance();