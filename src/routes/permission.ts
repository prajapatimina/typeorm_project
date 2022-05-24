import * as express from 'express';
import permissionController from '../controller/permissionController';
const permissionRoutes = express.Router();

permissionRoutes.post('/create', permissionController.create);
permissionRoutes.get('/',permissionController.getAll);
permissionRoutes.get('/:id',permissionController.getById);
permissionRoutes.put('/edit/:id',permissionController.updatePermission);

export default permissionRoutes;
