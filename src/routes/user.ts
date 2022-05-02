import * as express from 'express';

const router = express.Router();

const controller = require('../controller/user')

router.get('/', controller.getUser)
router.post('/create',controller.createUser)
router.get("/user/:id", controller.getUserById)
router.put("/user/:id", controller.updateUser)
router.delete("/user/:id", controller.deleteUser)

module.exports = router;