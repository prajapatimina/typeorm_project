import 'dotenv/config';


export const SUCCESS_MESSAGE = {
    passwordVerified: 'Login data send',
    emailSuccess: 'Verification code sent to email.',
    loginSuccess: 'Login Successful',
    loginVerified: 'Login verified'
};

export const ERROR_MESSAGE = {
    invalidLogin: 'Invalid Email or Password',
    noToken:'No token provided',
    notFound:'User not found',
    notMatch: 'Invalid code'
};

export const TOKEN_EXPIRY_DAYS ='1d' || process.env.TOKEN_EXPIRY_DAYS;

export const EXPIRE_MESSAGE = {
    codeExpiry: ' Verification Code has been expired'
};
export const EMAIL_CONTENT = {
    loginSubject:'Login Verification',
    html:''
};

export const STATUS = {
    invalid: '400'
};
