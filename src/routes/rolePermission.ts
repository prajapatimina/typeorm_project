import * as express from 'express';
import rolePermissionController from '../controller/rolePermissionController';
const rolePermissionRoutes = express.Router();

rolePermissionRoutes.get('/', rolePermissionController.getAll);
rolePermissionRoutes.get('/:id', rolePermissionController.getById);
rolePermissionRoutes.put('/edit/:id',rolePermissionController.update);
rolePermissionRoutes.delete('/delete/:id',rolePermissionController.delete);


export default rolePermissionRoutes;
