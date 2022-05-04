const bcrypt = require('bcryptjs')

import userDao from "../dao/user.dao";
import { CRUD } from "../../interface/crud.interface";
import { UserDto } from "../dto/users.model";


class UserService implements CRUD{
    private static instance:UserService;

    static getInstance(): UserService {
        if (!UserService.instance) {
            UserService.instance = new UserService();
        }
        return UserService.instance;
    } 

    async list(){
        return await userDao.getUsers();
    }

    async create(resource:UserDto){
        return await userDao.addUser(resource);
    }

    async readById(resourceId:number){
        return await userDao.getUserById(resourceId);
    }

    async updateById(resourceId:number,resource:UserDto){
        return await userDao.updateUserById(resourceId,resource);
    }

    async deleteById(resourceId:number){
        return await userDao.deleteUser(resourceId);
    }
}

export default UserService.getInstance();




