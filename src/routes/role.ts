import * as express from 'express';
import roleController from '../controller/roleController';
const roleRoutes = express.Router();

roleRoutes.get('/',roleController.getAll);
roleRoutes.post('/create', roleController.create);
roleRoutes.get('/:id',roleController.getById);
roleRoutes.put('/edit/:id',roleController.update);
roleRoutes.delete('/remove/:id', roleController.deleteRole);

export default roleRoutes;