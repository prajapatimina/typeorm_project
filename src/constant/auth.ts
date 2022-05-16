import 'dotenv/config';


const SUCCESS_MESSAGE = {
    passwordVerified: 'Login data send',
    emailSuccess: 'Verification code sent to email.',
    loginSuccess: 'Login Successful',
};
const ERROR_MESSAGE = {
    invalidLogin: 'Invalid Email or Password',
    noToken:'No token provided',
    notFound:'User not found',
    notMatch: 'Invalid code'
};

const TOKEN_EXPIRY_DAYS ='1d' || process.env.TOKEN_EXPIRY_DAYS;

const EXPIRE_MESSAGE = {
    codeExpiry: ' Verification Code has been expired'
};
const EMAIL_CONTENT = {
    loginSubject:'Login Verification',
    html:''
};

const STATUS = {
    invalid: '400'
};

export {
    SUCCESS_MESSAGE,
    ERROR_MESSAGE,
    TOKEN_EXPIRY_DAYS,
    EXPIRE_MESSAGE,
    EMAIL_CONTENT,
    STATUS
};