import { ERROR_MESSAGE, STATUS } from "../constant/permission";
import { PermissionDto } from "../dto/permission/permission.model";
import { AppDataSource } from "../data-source";
import { Permission } from "../entity/Permission";
import CustomError from "../errors/customError";
import logger from "../logger/logger";

const PermissionModel = AppDataSource.getRepository(Permission);

class PermissionService{
    static instance:PermissionService;

    static getInstance(): PermissionService {
        if (!PermissionService.instance) {
            PermissionService.instance = new PermissionService();
        }
        return PermissionService.instance;
    }

    async getAll(){
        const permission = await PermissionModel.find();
        if(permission.length === 0) throw new CustomError(STATUS.invalid, ERROR_MESSAGE.notFound);
        return permission;
    }

    async create(data:PermissionDto){
        const permission =await PermissionModel.findOneBy({slug:data.slug});
        if(permission) throw new CustomError(STATUS.invalid,ERROR_MESSAGE.alreadyExists);


        const newPermission = await PermissionModel.create(data);
        logger.info(newPermission,'model');
        await PermissionModel.save(newPermission);
        return newPermission;
    }

    async getById(id){
        const permission = await PermissionModel.findOne({where:{id:id}});
        if(!permission) throw new CustomError(STATUS.notFound, ERROR_MESSAGE.notFound);
        return permission;
    }

    async update(id,data){
        const permission = await PermissionModel.findOneBy({id:id});
        if(!permission) throw new CustomError(STATUS.notFound, ERROR_MESSAGE.notFound);

        const updatedRole =await PermissionModel.merge(permission,data);
        const update = await PermissionModel.save(updatedRole);
        return update;
    }

    async delete(id){
        const permission = await PermissionModel.findOneBy({id:id});
        if(!permission) throw new CustomError(STATUS.notFound, ERROR_MESSAGE.notFound);

        await PermissionModel.delete(permission);
        return permission;
    }


}

export default PermissionService.getInstance();