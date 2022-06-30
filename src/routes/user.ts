import * as express from 'express';
import apiLimiter from '../config/rateLimiter';
const userRoutes = express.Router();

import UserController from '../controller/user.controller';
import auth from '../middleware/auth';
import checkPermission from '../middleware/permission';

userRoutes.get('/', apiLimiter, UserController.listUser);
userRoutes.post('/create',auth,[checkPermission('user.create')], UserController.createUser);
userRoutes.get('/user/profile', auth, UserController.profile);

userRoutes.get('/user/:userId', UserController.getUserById);
userRoutes.put('/user/:userId',auth,[checkPermission('user.edit')], UserController.updateUser);
userRoutes.delete('/user/:userId', UserController.deleteUser);
userRoutes.post('/reset',UserController.resetPassword);
userRoutes.post('/reset/verify', UserController.verifyResetPasswordToken);
userRoutes.post('/changePassword',[auth],UserController.changePassword);

userRoutes.get('/user/download',UserController.downloadSample);

export default userRoutes;
