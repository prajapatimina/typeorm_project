import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { LoginToken } from './entity/loginToken';
import { User } from './entity/User';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'admin',
    database: 'User',
    synchronize: true,
    logging: false,
    entities: [User,LoginToken],
    migrations: ['./migration/*.ts/'],
    subscribers: [],
});
