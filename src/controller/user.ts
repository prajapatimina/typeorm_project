import { validate } from "class-validator"
import { Request, Response } from "express"
import { AppDataSource } from "../data-source"
import { User } from "../entity/User"
const bcrypt = require('bcryptjs')

exports.createUser = async function (req:Request, res: Response) {
    const {password, email} = req.body

    const userEmail = await AppDataSource.getRepository(User).findOne({where: { email: email }})
    if(userEmail) return res.send('Email already exists.')

    const hashPassword = await bcrypt.hash(password,bcrypt.genSaltSync())


    const user = await AppDataSource.getRepository(User).create(
        {
        name:req.body.name,
        phoneNo:req.body.phoneNo,
        address:req.body.address,
        email: req.body.email,
        password:hashPassword,
        status:req.body.status
    })
    // const errors = await validate(user);
    // if (errors.length > 0) {
    //     throw new Error(`Validation failed!`);
    // } else {
    //    const result = await AppDataSource.getRepository(User).save(user);
    // return res.send(result)

    // }
    
    const results = await AppDataSource.getRepository(User).save(user)
    return res.send(results)
}

exports.getUser = async function (req: Request, res: Response) {
    const users = await AppDataSource.getRepository(User).find()
    res.json(users)
}

exports.getUserById = async function (req: Request, res: Response) {
    const id = req.params.id
    const results = await AppDataSource.getRepository(User).findOne({where:{id:parseInt(id)}})
    return res.send(results)
}


exports.updateUser =  async function (req: Request, res: Response) {
    const id: any = req.params.id

    const user = await AppDataSource.getRepository(User).findOneBy({
        id : id,
    })
    AppDataSource.getRepository(User).merge(user, req.body)
    const results = await AppDataSource.getRepository(User).save(user)
    return res.json({
        message:"updated successfully",
        User:results})
}

exports.deleteUser = async(req:Request,res:Response)=>{
    const user=await AppDataSource.getRepository(User).delete(req.params.id)
    res.json({
        message:"User deleted successfully",
    })
}