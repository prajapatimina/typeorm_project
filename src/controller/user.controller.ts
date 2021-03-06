import { Request, Response } from 'express';
import { ERROR_MESSAGE, STATUS, SUCCESS_MESSAGE } from '../constant/user';
import userService from '../service/userService';
import CustomError from '../errors/customError';
import logger from '../logger/logger';
import * as excel from 'exceljs';

class UserController {
    private static instance: UserController;

    static getInstance(): UserController {
        if (!UserController.instance) {
            UserController.instance = new UserController();
        }
        return UserController.instance;
    }

    async listUser(req: Request, res: Response) {
        try {
            const users = await userService.list(req);
            if (users.length === 0) throw new CustomError(STATUS.notFound,ERROR_MESSAGE.notFound);
            res.send(users);
        } catch (error) {
            return res.status(error.statusCode).json({
                code: error.statusCode,
                msg: error.errorMessage
            });
        }
    }

    async createUser(req: Request, res: Response) {
        try {
            const user = await userService.create(req.body,req.body.role);
            res.send(user);
        } catch (error) {
            logger.error(error.message);
            return res.status(error.status || 404).json({
                code: error.status,
                msg: error.message
            });
        }

    }
    async getUserById(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.userId);
            const user = await userService.readById(id);
            res.send(user);
        } catch (error) {
            return res.status(error.status).json({
                code: error.status,
                msg: error.message
            });
        }
    }

    async updateUser(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.userId);
            const user = await userService.updateById(id, req.body);
            res.send({
                message: SUCCESS_MESSAGE.updateSuccess,
                user,
            });
        } catch (error) {
            return res.status(error.status).json({
                code: error.status,
                msg: error.message
            });
        }
    }

    async deleteUser(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.userId);
            await userService.deleteById(id);
            res.send({
                message: SUCCESS_MESSAGE.deleteSuccess,
            });
        } catch (error) {
            return res.status(error.status).json({
                code: error.status,
                msg: error.message
            });
        }
    }

    async resetPassword(req: Request, res: Response){
        try {
            const reset = await userService.resetPasswordToken(req.body.email);
            res.send(reset);
        } catch (error) {
            return res.status(error.status).json({
                code: error.status,
                msg: error.message
            });
        }
    }

    async verifyResetPasswordToken(req: Request, res: Response){
        try {
            const resetToken = await userService.resetPassword(req.body);
            res.send(resetToken);
        } catch (error) {
            return res.status(error.status).json({
                code: error.status,
                msg: error.message
            });
        }
    }

    async changePassword(req: Request, res: Response){
        try {
            const user = await userService.changePassword(req['user'].userId,req.body);
            res.send(user);
        } catch (error) {
            return res.status(error.status ||500).json({
                code: error.status,
                msg: error.message
            });
        }
    }

    async profile(req: Request, res: Response){
        try {
            const user = await userService.profile(req['user'].userId);
            res.send(user);
        } catch (error) {
            return res.status(error.status).json({
                code: error.status,
                msg: error.message
            });
        }
    }

    async downloadSample(req, res, fn) {
        try {
            const userData = await userService.list(req);
            const workbook = new excel.Workbook();
            const worksheet = workbook.addWorksheet('user');
            worksheet.columns = [
                {header: 'Name', key: 'name'},
                {header: 'Email', key: 'email'},
                {header: 'Address', key: 'address'}
            ];
            worksheet.addRows(userData);

            // (await userData).forEach((e, index) => {
            //     // row 1 is the header.
            //     const rowIndex = index + 2

            //     // By using destructuring we can easily dump all of the data into the row without doing much
            //     // We can add formulas pretty easily by providing the formula property.
            //     worksheet.addRow({
            //       ...e,
            //     })
            //   })




    
            // res.attachment("language-translation.xlsx");
            return workbook.xlsx.write(res).then(function () {
                res.end();
            });
        } catch (e) {
            fn(e);
            console.log(e);
        }
    }

}
export default UserController.getInstance();
