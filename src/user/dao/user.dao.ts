import { validate } from "class-validator";
import { Request, Response } from "express";
import { AppDataSource } from "../../data-source";
import { UserDto } from "../dto/users.model";
import { User } from "../../entity/User";
const bcrypt = require('bcryptjs')

class UserDao{
    private static instance: UserDao;

    static getInstance():UserDao{
        if(!UserDao.instance){
            UserDao.instance = new UserDao()
        }
        return UserDao.instance;
    }

    async getUsers(){
        try {
            return await AppDataSource.getRepository(User).find();            
        } catch (error) {
            console.log(error.message)
        }
    }

    async addUser(user:UserDto){
    const {email} =user
        const userEmail = await AppDataSource.getRepository(User).findOne({where: { email: email }})
            if(userEmail) return ('Email already exists.')

        const userData = await AppDataSource.getRepository(User).create(user)
        const errors = await validate(userData)
        if(errors.length>0){
            console.log(errors[0].constraints)
            return (errors[0].constraints)
        }
        else{
            const hashPassword = await bcrypt.hash(userData.password,bcrypt.genSaltSync())
            const result = await AppDataSource.getRepository(User).save({
                name:userData.name,
                phoneNo:userData.phoneNo,
                address:userData.address,
                email:userData.email,
                password:hashPassword,
                status:userData.status
            })
            return (result)
        }
    }

    async getUserById(userId:number){
        try {
            const user = await AppDataSource.getRepository(User).findOneBy({id:userId})
            if(!user) return ("No user found")
            return user; 
        } catch (error) {
           console.log(error.message) 
        }
    }

    async updateUserById(userId,user:UserDto){
        try {
            const userIdd = await AppDataSource.getRepository(User).findOneBy({id:user.id})
            AppDataSource.getRepository(User).merge(userIdd, user)
            const results = await AppDataSource.getRepository(User).save(userIdd)
            return results  
        } catch (error) {
            console.log(error.message)
        }
       
    }

    async deleteUser(userId:number){
        try {
            const user = await AppDataSource.getRepository(User).delete({id:userId})
            return user
        } catch (error) {
            console.log(error.message)
        }
  
    }
}
export default UserDao.getInstance();