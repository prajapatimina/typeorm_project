import { ERROR_MESSAGE } from "../constant/uerRole";
import { AppDataSource } from "../data-source";
import { RolePermission } from "../entity/RolesPermission";
import { UserRoles } from "../entity/UserRoles";
import CustomError from "../errors/customError";

const UserRolesModel = AppDataSource.getRepository(UserRoles);
const RolePermissionModel  = AppDataSource.getRepository(RolePermission);

class UserRolesService{
    private static instance: UserRolesService;

    static getInstance(): UserRolesService {
        if (!UserRolesService.instance) {
            UserRolesService.instance = new UserRolesService();
        }
        return UserRolesService.instance;
    }

    async getAll(){
        const UserRoles = await UserRolesModel.find({relations:{user:true,role:true}});
        return UserRoles;
    }

    async getById(id){
        const user = await UserRolesModel.findOne({where:{id:id},relations:{user:true, role:true}});

        const role = await RolePermissionModel.createQueryBuilder("rolePermission")
            .where("rolePermission.roleId = :roleId", { roleId: user.role.id })
            .getOne();

        const result = {
            user:{
                id:user.user.id,
                name:user.user.name,
                email:user.user.email
            },
            role:user?.role.name,
            permission:role?.permission
        };
        return result;
    }

    async update(id,data){
        const user = await UserRolesModel.findOneBy({id:id});
        if(!user) return ERROR_MESSAGE.notFound;

        const updatedUserRole = await UserRolesModel.merge(user, data);
        const update = await UserRolesModel.save(updatedUserRole);
        return update;
    }

    async delete(id) {
        const role = await UserRolesModel.findOneBy({ id: id });
        if (!role) throw new CustomError('404', ERROR_MESSAGE.notFound);

        await UserRolesModel.remove(role);
        return role;
    }
}

export default UserRolesService.getInstance();