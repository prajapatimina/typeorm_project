import 'dotenv/config';


const SUCCESS_MESSAGE = {
    tokenVerify: 'Token verified successfuly.',
    emailSuccess: 'Reset password code sent to email.',
    resetPasswordSuccess:'Password has been successfully reset.',
    updateSuccess:'Updated Successfully',
    deleteSuccess:'Delete Success',
    changePasswordSuccess:'Password has been changed successfully.'
};
const ERROR_MESSAGE = {
    invalidUser: 'Invalid User',
    invalidToken: 'Invalid token',
    notFound:'User not found',
    invalidCurrentPassoword: 'Ivalid current password',
    invalidNewPassword: 'New password doesnot match with confirm password',
    invalidPassword: 'Password must contain atleast six character, one uppercase & one special character'

};

const EMAIL_CONTENT = {
    resetSubject: 'Reset Password Token',
    registerSubject:'Account Verification Link',
    html:''
};

const TOKEN_EXPIRY_DAYS ='3d' || process.env.TOKEN_EXPIRY_DAYS;

const EXPIRE_MESSAGE = {
    tokenExpiry: 'Token expired'
};

const PWD_REGEX = {
    pwdRegex:/((.d*)(?=.*[A-Z])(?=.*[!@#$%]).{5,})/
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
    STATUS,
    PWD_REGEX
};