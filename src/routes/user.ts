import * as express from 'express';
import apiLimiter from '../config/rateLimiter';
const userRoutes = express.Router();

import UserController from '../controller/user.controller';
import auth from '../middleware/auth';

userRoutes.get('/', apiLimiter, UserController.listUser);
userRoutes.post('/create', UserController.createUser);
userRoutes.get('/user/profile', auth, UserController.profile);

userRoutes.get('/user/:userId',auth, UserController.getUserById);
userRoutes.put('/user/:userId', UserController.updateUser);
userRoutes.delete('/user/:userId', UserController.deleteUser);
userRoutes.post('/reset',UserController.resetPassword);
userRoutes.post('/reset/verify', UserController.verifyResetPasswordToken);
userRoutes.post('/changePassword',UserController.changePassword);

// module.exports = userRoutes;
export default userRoutes;
