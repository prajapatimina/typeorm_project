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
        const permission = await RolePermissionModel.find({relations:{role:true}});
        return permission;
    }

    async create(data){

        const newPermission = await RolePermissionModel.create(data);
        logger.info(newPermission,'Permission created');
        await RolePermissionModel.save(newPermission);
        return newPermission;
    }

    async getById(id){
        const rolePermission = await RolePermissionModel.findOne({where:{id:id},
            relations:{role:true}});
        if(!rolePermission) return "No role permission found";
        return rolePermission;
    }

    async update(id,data){
        const rolePermission = await RolePermissionModel.findOneBy({ id: id });
        if (!rolePermission) throw new CustomError(STATUS.notFound, ERROR_MESSAGE.notFound);

        const updatedRole = await RolePermissionModel.merge(rolePermission, data);
        const update = await RolePermissionModel.save(updatedRole);
        return update;
    }

    async delete(id) {
        const rolePermission = await RolePermissionModel.findOneBy({ id: id });
        logger.info(rolePermission);
        if (!rolePermission) throw new CustomError('404', ERROR_MESSAGE.notFound);

        await RolePermissionModel.remove(rolePermission);
        return rolePermission;
    }

}

export default RolePermissionService.getInstance();