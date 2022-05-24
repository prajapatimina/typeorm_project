export const PWD_REGEX = {
    pwd:/((.d*)(?=.*[A-Z])(?=.*[!@#$%]).{5,})/
};

export const PHONE_REGEX = {
    phone:/^98[0-9]{8}$/
};

export const EMAIL_REGEX = {
    email:/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/
};
export const VALIDATION_ERROR_MESSAGE = {
    invalidPassword:`Password must be atleast 6 character and most contain atleast one special character.`,
    notMatch:'COnfirm password doesnot match with New Password',
    invalidEmail:"Invalid Email format",
    invalidPhone: "Invalid [hoe number.Phone number must be 10 digit."

};

