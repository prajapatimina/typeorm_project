import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { LoginToken } from './entity/LoginToken';
import { Permission } from './entity/Permission';
import { Role } from './entity/Role';
import { RolePermission } from './entity/RolesPermission';
import { User } from './entity/User';
import { UserRoles } from './entity/UserRoles';
import { roles1652682173026 } from './migration/1652682173026-roles';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'admin',
    database: 'User',
    synchronize: true,
    logging: true,
    entities: [User,LoginToken,Role,Permission,RolePermission,UserRoles],
    // migrations: ["./migration/*.ts"],
    migrations: [roles1652682173026],

    migrationsTableName:"migration",
    subscribers: [],

});
