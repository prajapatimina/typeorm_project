import { AppDataSource } from "./data-source"
import { User } from "./entity/User"
import * as express from "express";
import { Request, Response } from "express"
// import { createConnection } from "typeorm";
const bcrypt = require('bcryptjs')


const port = 3000 

const userController = require('./controller/user')


AppDataSource.initialize()
    .then(() => {
        console.log('Data source has been initialized')

    })
    .catch(error => console.log(error))


    const app = express() 
    app.use(express.json())
 
    
    app.post('/users',userController.createUser)
    
    
    
    app.get("/users", userController.getUser )
    
    app.get("/users/:id", userController.getUserById)
    app.put("/users/:id", userController.updateUser)
    app.delete("/users/:id", userController.deleteUser)
    
    app.listen(port, () => {
        console.log(`Server is runnig on http://localhost:${port}`)
      })
    