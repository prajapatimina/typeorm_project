import 'dotenv/config';
import logger from '../logger/logger';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { AuthDto } from '../controller/user/dto/auth.model';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User';
import sendEmail from '../mail';
import * as crypto from 'crypto';
import { LoginToken } from '../entity/loginToken';
import { EMAIL_CONTENT, ERROR_MESSAGE, EXPIRE_MESSAGE, STATUS, SUCCESS_MESSAGE, TOKEN_EXPIRY_DAYS } from '../constant/auth';
import CustomError from '../errors/customError';

class AuthService {
    private static instance: AuthService;

    static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }
    async passwordMatch(authPassword,userPassword){
        return await bcrypt.compare(
            authPassword,
            userPassword
        );
    }
    async login(auth: AuthDto) {
        const userRepository = await AppDataSource.getRepository(User);
        const userEmail = await userRepository.findOne({
            where: { email: auth.email },relations:{loginToken_id:true}
        });

        if(!userEmail) throw new CustomError(STATUS.invalid,ERROR_MESSAGE.invalidLogin);

        const isPasswordMatching = await this.passwordMatch(auth.password,userEmail.password);
        console.log(isPasswordMatching,'match');
        if(!isPasswordMatching) throw new CustomError(STATUS.invalid,ERROR_MESSAGE.invalidLogin);

        if(userEmail.loginToken_id.codeStatus == false){
            await this.verificationCodeEmail(userEmail);
            return {
                message:SUCCESS_MESSAGE.emailSuccess,
            };
        }
        const token = jwt.sign(
            { userId: userEmail.id, username: userEmail.email },
            process.env.JWT_SECRET,
            { expiresIn: TOKEN_EXPIRY_DAYS }
        );
        return{
            message:SUCCESS_MESSAGE.loginSuccess,
            auth: auth.email,
            token,
        };
    }

    async verificationCodeEmail(auth) {
        const codeGenerated =crypto.randomInt(1000,10000);
        const subject = EMAIL_CONTENT.loginSubject;
        const text = `Your code is ${codeGenerated}`;
        const html = EMAIL_CONTENT.html;

        await sendEmail(auth.email, subject, text, html);
        const date = new Date();
        const expireDate = date.setDate(date.getDate() + 3);

        const {loginToken_id,email} = auth;
        const user = await AppDataSource.getRepository(LoginToken);
        const userId =await user.findOne({where:{id:loginToken_id.id}});

        if(userId){
            await user.update({id:userId.id},{
                code: codeGenerated,
                user_email:email,
                createdAt:date,
                expiredAt:new Date(expireDate),
                user_id:auth.id
            });
        }
    }


    async loginVerify(email,num){
        const userRepository = await AppDataSource.getRepository(User);
        const userEmail= await userRepository.findOne({where:{email:email}});
        if(!userEmail) throw new CustomError(STATUS.invalid,ERROR_MESSAGE.notFound);
        const token = jwt.sign(
            { userId: userEmail.id, username: userEmail.email },
            process.env.JWT_SECRET,
            { expiresIn: TOKEN_EXPIRY_DAYS }
        );
        const user = await AppDataSource.getRepository(LoginToken).findOne({where:{user_email:userEmail.email}});
        const {code,expiredAt}= user;
        const expire = expiredAt.getTime();
        const date = Date.now();

        console.log(code,'code');
        const givenCode = num;
        if((expire < date)) throw new CustomError(STATUS.invalid, EXPIRE_MESSAGE.codeExpiry);
        if(givenCode !== code) throw new CustomError(STATUS.invalid, ERROR_MESSAGE.notMatch);

        if(givenCode === code){
            user.codeStatus = true;
            userEmail.status =1;
            await userRepository.save(userEmail);
            await AppDataSource.getRepository(LoginToken).save(user);
            return {
                user,
                token
            };
        }
    }
}

export default AuthService.getInstance();
