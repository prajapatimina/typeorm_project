import pino from 'pino';

const levels = {
    http: 10,
    debug: 20,
    info: 30,
    warn: 40,
    error: 50,
    fatal: 60,
};

const logger = pino(
    {
        transport: {
            target: 'pino-pretty',
            options: {
                colorize: true,
                translateTime: 'yyyy-dd-mm, h:MM:ss TT',
            },
        },
        customLevels: levels,
        useOnlyCustomLevels: true,
        level: 'http',
    },

    pino.destination(`${__dirname}/log/logger.log`)
    // pino.destination(__dirname +"/log/logger.log")
);

export default logger;
