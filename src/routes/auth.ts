import * as express from 'express';
import * as passport from 'passport';
import '../config/passport';
import authController from '../controller/authController';
const authRoutes = express.Router();

authRoutes.post('/login',
    // passport.authenticate('local'),
    authController.login);
authRoutes.post('/verify',authController.verifyLogin);

export default authRoutes;
