import 'dotenv/config';
import logger from '../logger/logger';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { AuthDto } from '../dto/user/auth.model';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User';
import sendEmail from '../Utils/mail';
import * as crypto from 'crypto';
import { LoginToken } from '../entity/LoginToken';
import { EMAIL_CONTENT, ERROR_MESSAGE, EXPIRE_MESSAGE, STATUS, SUCCESS_MESSAGE, TOKEN_EXPIRY_DAYS } from '../constant/auth';
import CustomError from '../errors/customError';
import { CODE_EXPIRY_TIME } from '../constant/user';

const LoginTokenModel = AppDataSource.getRepository(LoginToken);

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
        try {
            const userModel = await AppDataSource.getRepository(User);
            const userEmail = await userModel.findOne({
                where: { email: auth.email },relations:{loginToken_id:true}
            });

            if(!userEmail) throw new CustomError(STATUS.invalid,ERROR_MESSAGE.invalidLogin);

            const isPasswordMatching = await this.passwordMatch(auth.password,userEmail.password);
            if(!isPasswordMatching) throw new CustomError(STATUS.invalid,ERROR_MESSAGE.invalidLogin);

            await this.verificationCodeEmail(userEmail);
            return {
                message:SUCCESS_MESSAGE.emailSuccess,
            };
        } catch (error) {
            throw new CustomError(error.statusCode || error.status, error.errorMessage || error.message);
        }
    }

    async verificationCodeEmail(auth) {
        const codeGenerated =crypto.randomInt(1000,10000);
        const subject = EMAIL_CONTENT.loginSubject;
        const text = `Your code is ${codeGenerated}`;
        const html = EMAIL_CONTENT.html;
        logger.info(codeGenerated);
        console.log('Login code: ',codeGenerated);

        await sendEmail(auth.email, subject, text, html);
        const date = new Date();
        const expireDate = date.setHours(date.getHours() + CODE_EXPIRY_TIME);

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
        const userExists= await userRepository.findOne({where:{email:email}});

        if(!userExists) throw new CustomError(STATUS.invalid,ERROR_MESSAGE.notFound);
        const token = jwt.sign(
            { userId: userExists.id, email: userExists.email },
            process.env.JWT_SECRET,
            { expiresIn: TOKEN_EXPIRY_DAYS }
        );

        const user = await LoginTokenModel.findOne({where:{user_email:userExists.email}});
        const {code,expiredAt}= user;
        const codeExpiryDate = expiredAt.getTime();
        const date = Date.now();
        const tokenExpiryDate = TOKEN_EXPIRY_DAYS;

        logger.info(code,'code');
        const givenCode = num;
        if((codeExpiryDate < date)) throw new CustomError(STATUS.invalid, EXPIRE_MESSAGE.codeExpiry);
        if(givenCode !== code) throw new CustomError(STATUS.invalid, ERROR_MESSAGE.notMatch);

        if(givenCode === code){
            // user.code = null;
            userExists.status =1;
            await userRepository.save(userExists);
            await LoginTokenModel.save(user);
            logger.info(SUCCESS_MESSAGE.loginVerified);
            return {
                token,
                tokenExpiryDate
            };
        }
    }
}

export default AuthService.getInstance();
