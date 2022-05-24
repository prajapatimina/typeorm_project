import { NextFunction, Request, Response } from "express";
import { ERROR_MESSAGE } from "../constant/permission";
import { AppDataSource } from "../data-source";
import { RolePermission } from "../entity/RolesPermission";
import { UserRoles } from "../entity/UserRoles";
import logger from "../logger/logger";
const UserRoleModel = AppDataSource.getRepository(UserRoles);
const RolePermissionModel = AppDataSource.getRepository(RolePermission);

function checkPermission(getPermission){
    return async function(req:Request, res:Response, next:NextFunction) {

    const user = req['user'];
    const loggegIn = await UserRoleModel.findOne({where:{user:user.userId},relations:{user:true, role:true}});

        const role = await RolePermissionModel.createQueryBuilder("rolePermission")
            .where("rolePermission.roleId = :roleId", { roleId: loggegIn.role.id })
            .getOne();

        const result = {
            permission:role.permission
        };

        const results = result.permission.find(obj => {
            return obj === getPermission;
          });
          logger.info(results);
          if(results !== undefined || null)
            return next();
          return res.send(ERROR_MESSAGE.noPermission);
};
}
export default checkPermission;







