import { validate } from 'class-validator';
import { UserDto } from '../dto/user/users.model';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User';
import * as bcrypt from 'bcryptjs';
import logger from '../logger/logger';
import sendEmail from '../Utils/mail';
import 'dotenv/config';
import { LoginToken } from '../entity/LoginToken';
import * as crypto from 'crypto';
import {
    CODE_EXPIRY_TIME,
    EMAIL_CONTENT,
    ERROR_MESSAGE,
    EXPIRE_MESSAGE,
    STATUS,
    SUCCESS_MESSAGE
} from '../constant/user';
import { ChangePasswordDto } from '../dto/user/changePassword.model';
import CustomError from '../errors/customError';
import { ResetPasswordDto } from '../dto/user/resetPassword.model';
import { UserRoles } from '../entity/UserRoles';
import { Role } from '../entity/Role';


const UserModel = AppDataSource.getRepository(User);
const LoginTokenModel =AppDataSource.getRepository(LoginToken);
const UserRolesModel =AppDataSource.getRepository(UserRoles);
const RoleModel = AppDataSource.getRepository(Role);
class UserService {
    private static instance: UserService;

    static getInstance(): UserService {
        if (!UserService.instance) {
            UserService.instance = new UserService();
        }
        return UserService.instance;
    }

    async list() {
        const user = await UserModel.find({
            select: ['id', 'name', 'email', 'address', 'status']
        });
        return user;
    }

    async create(data: UserDto,role) {
        const newUser = new UserDto();
        Object.keys(data).map((k)=>{
            newUser[k] = data[k];
        });
        const errors = await validate(newUser);
        if (errors.length > 0) {
            logger.error(errors[0].constraints);
            return errors[0].constraints;
        }

        const user = await UserModel.findOneBy({
            email:data.email
        });
        if (user) throw new CustomError(STATUS.invalid,ERROR_MESSAGE.alreadyExists);

        const loginData = await LoginTokenModel.save({});

            const userData = await UserModel.create({...data,loginToken_id:loginData});

            await UserModel.save(userData);

            const roleData = await RoleModel.findOne({where:{id:role}});
            if(!roleData) return "Role doesnot exists";
            const userRole = await UserRolesModel.create({user:userData,role:roleData});
            await UserRolesModel.save(userRole);

            const result ={
                id: userData.id,
                name: userData.name,
                phoneNo: userData.phoneNo,
                address: userData.address,
                email:  userData.email,
            };
            return result;

    }

    async readById(userId: number) {
        const user = await UserModel.findOne({
            where:{id: userId}
        });
        if (!user) throw new CustomError(STATUS.notFound,ERROR_MESSAGE.notFound);
        return user;
    }

    async updateById(userId: number, user:UserDto) {
        const userIdd = await UserModel.findOneBy({
            id: userId,
        });
        UserModel.merge(userIdd, user);
        const results = await UserModel.save(userIdd);
        return results;

    }

    async deleteById(userId: number) {
        const user = await UserModel.delete({
            id: userId,
        });
        if (!user) throw new CustomError(STATUS.invalid,ERROR_MESSAGE.notFound);
        return user;
    }

    async resetPasswordToken(email:string){
        const isUser =await UserModel.findOne({where:{email:email}});
        if(!isUser) throw new CustomError(STATUS.invalid, ERROR_MESSAGE.notFound);

        const expireDate = new Date();
        expireDate.setHours(expireDate.getHours() + CODE_EXPIRY_TIME);
        const codeGenerated =crypto.randomUUID();
        console.log(codeGenerated,'Reset Password Token');

        const subject = EMAIL_CONTENT.resetSubject;
        const text = `Your code is ${codeGenerated}`;
        const html = EMAIL_CONTENT.html;
        await sendEmail(email, subject, text, html);

        await UserModel.update({id:isUser.id},{
            resetPasswordToken:codeGenerated,
            resetPasswordTokenExpireDate:expireDate
        });
        return SUCCESS_MESSAGE.emailSuccess;

    }

    async resetPassword(resetPassword:ResetPasswordDto){
        const {email,token,newPassword} = resetPassword;
        const userEmail = await UserModel.findOne({where:{email:email}});
        const verifyToken = await userEmail.resetPasswordToken;
        const verifyExpiry = await userEmail.resetPasswordTokenExpireDate;
        const currentdate = new Date();

        const resetPwd = new ResetPasswordDto();
        Object.keys(resetPassword).map((k)=>{
            resetPwd[k] = resetPassword[k];
        });

        const validation = await validate(resetPwd);
        if(validation.length>0){
            logger.info(validation[0].constraints);
            return validation[0].constraints;

        }

        /**verify resetToken with req.body.token */
        if(verifyToken !== token) return ERROR_MESSAGE.invalidToken;

        /**check if expiry date is less or greater than current time */
        if(verifyExpiry < currentdate ) return EXPIRE_MESSAGE.tokenExpiry;


        logger.info(SUCCESS_MESSAGE.tokenVerify);

        /** Update user password if token matches and expiry date is greater than  current time */
        const hashPassword =await bcrypt.hash(newPassword,bcrypt.genSaltSync());
        await UserModel.update(userEmail.id,{password:hashPassword});
        return SUCCESS_MESSAGE.resetPasswordSuccess;

    }

    async changePassword(id,changePwd:ChangePasswordDto){
        const userModel = await AppDataSource.getRepository(User);
        const user = await userModel.findOne({where:{id:id}});
        if(!user) return ERROR_MESSAGE.notFound;

        const newUser = new ChangePasswordDto();
        Object.keys(changePwd).map((k)=>{
            newUser[k] = changePwd[k];
        });

        const validation = await validate(newUser);
        if(validation.length>0){
            logger.info(validation[0].constraints);
            return validation[0].constraints;

        }
            const {newPassword,currentPassword} = changePwd;
            const matchPassword =await bcrypt.compare(currentPassword,user.password);
            if(!matchPassword) throw new CustomError(STATUS.invalid, ERROR_MESSAGE.invalidCurrentPassoword);

            const hashPassword =await bcrypt.hash(newPassword,bcrypt.genSaltSync());
            await userModel.update(user.id,{password:hashPassword});
            return SUCCESS_MESSAGE.changePasswordSuccess;

    }

    async profile(id){
        const user = await AppDataSource.getRepository(User);
        const findUser = await user.findOne({where:{id}});
        return findUser;
    }

}

export default UserService.getInstance();
