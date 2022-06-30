import { ERROR_MESSAGE, STATUS } from "../constant/role";
import { RoleDto } from "../dto/role/role.model";
import { AppDataSource } from "../data-source";
import { Role } from "../entity/Role";
import CustomError from "../errors/customError";
import { RolePermission } from "../entity/RolesPermission";
import logger from "../logger/logger";
const RoleModel = AppDataSource.getRepository(Role);
const RolePermissionModel = AppDataSource.getRepository(RolePermission);

class RoleService {
    private static instance: RoleService;

    static getInstance(): RoleService {
        if (!RoleService.instance) {
            RoleService.instance = new RoleService();
        }
        return RoleService.instance;
    }

    async create(data: RoleDto) {
        const role = await RoleModel.findOneBy({ name: data.name });
        if (role) throw new CustomError(STATUS.invalid, ERROR_MESSAGE.alreadyExists);

        const queryRunner = AppDataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const newRole = await RoleModel.create(data);
            await queryRunner.manager.save(newRole);

            const newRolepermission = await RolePermissionModel.create({ role: newRole, permission: data.permission });
            await queryRunner.manager.save(newRolepermission);

            await queryRunner.commitTransaction();
            return newRolepermission;
        } catch (err) {
            await queryRunner.rollbackTransaction();
            logger.info('Transaction Rollback');
        } finally {
            await queryRunner.release();
        }

    }

    async getAll() {
        try {
            const roles = await RoleModel.find();
            if (roles.length === 0) throw new CustomError(STATUS.notFound,ERROR_MESSAGE.notFound);
            return roles;
        } catch (error) {
            throw new CustomError(error.statusCode || error.status, error.errorMessage || error.message);
        }
    }

    async getById(id) {
        try {
            const role = await RoleModel.findOneBy({ id: id });
            if (!role) throw new CustomError(STATUS.notFound, ERROR_MESSAGE.notFound);
            return role;
        } catch (error) {
            throw  new CustomError(error.statusCode || error.status, error.errorMessage || error.message);
        }

    }
    async updateRole(id, data) {
        try {
            const role = await RoleModel.findOneBy({ id: id });
            if (!role) throw new CustomError(STATUS.notFound, ERROR_MESSAGE.notFound);

            const updatedRole = await RoleModel.merge(role, data);
            const update = await RoleModel.save(updatedRole);
            return update;
        } catch (error) {
            throw  new CustomError(error.statusCode || error.status, error.errorMessage || error.message);
        }
    }

    async deleteRole(id) {
        try {
            const role = await RoleModel.findOneBy({ id: id });
        logger.info(role);
        if (!role) throw new CustomError(STATUS.notFound, ERROR_MESSAGE.notFound);

        await RoleModel.remove(role);
        return role;
        } catch (error) {
            throw  new CustomError(error.statusCode || error.status, error.errorMessage || error.message);
        }
    }
}
export default RoleService.getInstance();
