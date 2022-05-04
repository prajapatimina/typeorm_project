import { AppDataSource } from "./data-source"
import * as express from "express";
import helmet from "helmet";


const port = 3000 

const app = express() 
app.use(express.json())
app.use(helmet());

AppDataSource.initialize()
    .then(() => {
        console.log('Data source has been initialized')
        app.listen(port, () => {
            console.log(`Server is runnig on http://localhost:${port}`)
          })

    })
    .catch(error => console.log(error))


   

    const user = require('../src/user/routes/user')
    
    app.use('/api/users',user)
    
    
    
    