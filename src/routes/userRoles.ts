import * as express from 'express';
import userRolesController from '../controller/userRolesController';
const userRolesRoutes = express.Router();

userRolesRoutes.get('/',userRolesController.getAll);
userRolesRoutes.get('/:id',userRolesController.getById);
userRolesRoutes.put('/edit/:id',userRolesController.update);

export default userRolesRoutes;