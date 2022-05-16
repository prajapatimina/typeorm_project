import { validate } from 'class-validator';
import { UserDto } from '../controller/user/dto/users.model';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User';
import * as bcrypt from 'bcryptjs';
import logger from '../logger/logger';
import sendEmail from '../mail';
import 'dotenv/config';
import * as jwt from 'jsonwebtoken';
import { LoginToken } from '../entity/loginToken';
import * as crypto from 'crypto';
import { EMAIL_CONTENT, ERROR_MESSAGE, EXPIRE_MESSAGE, PWD_REGEX, STATUS, SUCCESS_MESSAGE } from '../constant/user';
import { ChangePasswordDto } from '../controller/user/dto/changePassword.model';
import CustomError from '../errors/customError';
import * as RandExp from 'randexp';


class UserService {
    private static instance: UserService;

    static getInstance(): UserService {
        if (!UserService.instance) {
            UserService.instance = new UserService();
        }
        return UserService.instance;
    }

    async list() {
        const userRepository = await AppDataSource.getRepository(User);
        const user = await userRepository.find({
            select: ['id', 'name', 'email', 'address', 'status'],
        });
        return user;
    }

    async create(user: UserDto) {
        const { email } = user;
        const userEmail = await AppDataSource.getRepository(User).findOne({
            where: { email: email },
        });
        if (userEmail) return 'Email already exists.';
        const loginData = await AppDataSource.getRepository(LoginToken).save({});
        const newUser = new User();
        Object.keys(user).map((k)=>{
            newUser[k] = user[k];
        });
        const errors = await validate(newUser);


        if (errors.length > 0) {
            console.log(errors[0].constraints);
            return errors[0].constraints;
        } else {
            const userData = await AppDataSource.getRepository(User).create({...user,loginToken_id:loginData});

            const hashPassword = await bcrypt.hash(
                userData.password,
                bcrypt.genSaltSync()
            );
            const result = await AppDataSource.getRepository(User).save({
                name: userData.name,
                phoneNo: userData.phoneNo,
                address: userData.address,
                email: userData.email,
                password: hashPassword,
                status: userData.status,
                loginToken_id:loginData
            });
            logger.info('User data saved');

            // await this.verificationEmail(user);
            return result;
        }
    }

    async readById(userId: number) {
        const user = await AppDataSource.getRepository(User).findOneBy({
            id: userId,
        });
        if (!user) throw new CustomError(STATUS.invalid,ERROR_MESSAGE.notFound);
        return user;
    }

    async updateById(userId: number, user:UserDto) {
        const userIdd = await AppDataSource.getRepository(User).findOneBy({
            id: userId,
        });
        AppDataSource.getRepository(User).merge(userIdd, user);
        const results = await AppDataSource.getRepository(User).save(userIdd);
        return results;

    }

    async deleteById(userId: number) {
        const user = await AppDataSource.getRepository(User).delete({
            id: userId,
        });
        if (!user) throw new CustomError(STATUS.invalid,ERROR_MESSAGE.notFound);
        return user;
    }

    async resetPasswordToken(email){
        const user = await AppDataSource.getRepository(User);
        const isUser =await user.findOne({where:{email:email}});
        if(!isUser) throw new CustomError(STATUS.invalid, ERROR_MESSAGE.notFound);

        const expireDate = new Date();
        expireDate.setHours(expireDate.getHours() + 2);
        const codeGenerated =crypto.randomUUID();
        console.log(codeGenerated,'code');

        const subject = EMAIL_CONTENT.resetSubject;
        const text = `Your code is ${codeGenerated}`;
        const html = EMAIL_CONTENT.html;
        await sendEmail(email, subject, text, html);

        await user.update({id:isUser.id},{
            resetPasswordToken:codeGenerated,
            resetPasswordTokenExpireDate:expireDate
        });
        return SUCCESS_MESSAGE.emailSuccess;

    }

    async resetPassword(email,token,password){
        const user = await AppDataSource.getRepository(User);
        const userEmail = await user.findOne({where:{email:email}});
        const verifyToken = await userEmail.resetPasswordToken;
        const verifyExpiry = await userEmail.resetPasswordTokenExpireDate;
        const currentdate = new Date();

        if(verifyExpiry < currentdate ) return EXPIRE_MESSAGE.tokenExpiry;

        if(verifyToken !== token) return ERROR_MESSAGE.invalidToken;
        else{
            logger.info(SUCCESS_MESSAGE.tokenVerify);
            await this.validatePwd(password);
            const hashPassword =await bcrypt.hash(password,bcrypt.genSaltSync());
            await user.update(userEmail.id,{password:hashPassword});
            return SUCCESS_MESSAGE.resetPasswordSuccess;
        }
    }

    async validatePwd(password){
        const pwdRegex = PWD_REGEX.pwdRegex;
        const validate= pwdRegex.test(password);
        if(validate === false) throw new CustomError(STATUS.invalid,ERROR_MESSAGE.invalidPassword);
        else return true;
    }

    async changePassword(changePwd:ChangePasswordDto){
        const user = await AppDataSource.getRepository(User);
        const userEmail = await user.findOne({where:{email:changePwd.email}});
        if(!userEmail) return ERROR_MESSAGE.notFound;

        const {password} =userEmail;
        const {newPassword,currentPassword} = changePwd;
        const matchPassword =await bcrypt.compare(currentPassword,password);
        if(!matchPassword) throw new CustomError(STATUS.invalid, ERROR_MESSAGE.invalidCurrentPassoword);

        const conform = await this.confirmPassword(changePwd);

        if(conform === true){
            const hashPassword =await bcrypt.hash(newPassword,bcrypt.genSaltSync());
            await user.update(userEmail.id,{password:hashPassword});
            return SUCCESS_MESSAGE.changePasswordSuccess;
        }
    }

    async confirmPassword(changePwd){
        const {newPassword,confirmPassword}= changePwd;
        const pwdRegex = PWD_REGEX.pwdRegex;
        const validatePwd= pwdRegex.test(newPassword);
        if(validatePwd === false) throw new CustomError(STATUS.invalid,ERROR_MESSAGE.invalidPassword);
        if(newPassword === confirmPassword) return true;
        else throw new CustomError(STATUS.invalid, ERROR_MESSAGE.invalidNewPassword);
    }

    async profile(token){
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        const {userId}= decoded;
        const user = await AppDataSource.getRepository(User);
        const findUser = await user.findOne({where:{id:userId}});
        return findUser;
    }

}

export default UserService.getInstance();
