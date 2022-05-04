import * as express from 'express';
const router = express.Router();

import userController from '../controller/user.controller';


router.get('/',userController.listUser);
router.post('/create', userController.createUser);
router.get('/user/:userId', userController.getUserById);
router.put("/user/:userId", userController.updateUser);
router.delete("/user/:userId", userController.deleteUser);

module.exports = router;