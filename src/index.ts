import { AppDataSource } from './data-source';
import * as express from 'express';
import helmet from 'helmet';
import * as session from 'express-session';
import * as passport from 'passport';
import * as expressPinoLogger from 'express-pino-logger';
import logger from './logger/logger';
import * as cookieParser from 'cookie-parser';

const port = 3000;

const app = express();
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(
    session({
        secret: 'session',
        resave: false,
        saveUninitialized: true,
    })
);

app.use(passport.initialize());
app.use(passport.session());

const loggerMidlleware = expressPinoLogger({
    logger: logger,
    autoLogging: true,
});
app.use(loggerMidlleware);

AppDataSource.initialize()
    .then(() => {
        logger.info('Data source has been initialized');
        app.listen(port, () => {
            console.log(`Server is runnig on http://localhost:${port}`);
        });
    })
    .catch((error) => logger.error(error.message));

import route from'./routes/index';
route(app);



