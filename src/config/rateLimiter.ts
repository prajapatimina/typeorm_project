import { rateLimit } from 'express-rate-limit';

const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 2,
    message: 'You sent too many request.Please wait a while and try again.',
});

export default apiLimiter;
