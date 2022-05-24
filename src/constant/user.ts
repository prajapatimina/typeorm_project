import 'dotenv/config';


export const SUCCESS_MESSAGE = {
    tokenVerify: 'Token verified successfuly.',
    emailSuccess: 'Reset password code sent to email.',
    resetPasswordSuccess:'Password has been successfully reset.',
    updateSuccess:'Updated Successfully',
    deleteSuccess:'Delete Success',
    changePasswordSuccess:'Password has been changed successfully.'
};
export const ERROR_MESSAGE = {
    invalidUser: 'Invalid User',
    invalidToken: 'Invalid token',
    notFound:'User not found',
    invalidCurrentPassoword: 'Ivalid current password',
    invalidNewPassword: 'New password doesnot match with confirm password',
    invalidPassword: 'Password must contain atleast six character, one uppercase & one special character',
    alreadyExists: 'User already exists'

};

export const EMAIL_CONTENT = {
    resetSubject: 'Reset Password Token',
    registerSubject:'Account Verification Link',
    html:''
};

export const TOKEN_EXPIRY_DAYS ='3d' || process.env.TOKEN_EXPIRY_DAYS;

export const CODE_EXPIRY_TIME = 2;

export const EXPIRE_MESSAGE = {
    tokenExpiry: 'Token expired'
};


export const STATUS = {
    invalid: '400',
    notFound:'404'
};
