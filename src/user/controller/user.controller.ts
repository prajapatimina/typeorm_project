import { Request, Response } from "express";
import userService from "../service/userService";

class UserController{
    private static instance: UserController;

    static getInstance(): UserController {
        if (!UserController.instance) {
            UserController.instance = new UserController();
        }
        return UserController.instance;
    }

    async listUser(req:Request, res:Response){
        const users = await userService.list();
        res.send(users);
    }

    async createUser(req:Request,res:Response){
        const user = await userService.create(req.body)
        res.send(user);

    }
    async getUserById(req:Request,res:Response){
        const id = parseInt(req.params.userId);
        const user = await userService.readById(id);
        res.send(user);
    }

    async updateUser(req:Request,res:Response){
        const id = parseInt(req.params.userId);
        const user = await userService.updateById(id,req.body)
        res.send({
            message:"updated Successfully",
            user
        });

    }

    async deleteUser(req:Request, res:Response){
        const id = parseInt(req.params.userId);
        const user = await userService.deleteById(id)
        res.send({
            message: "User deleted Successfully"
        });
    }

}
export default UserController.getInstance();