import { IsEmail, IsString, Matches } from "class-validator";
import { EMAIL_REGEX, PHONE_REGEX, PWD_REGEX } from "../../constant/regex";

const phoneRegex = PHONE_REGEX.phone;
const pwdRegex = PWD_REGEX.pwd;
const emailRegex = EMAIL_REGEX.email;

export class UserDto {
  id: number;

  name?: string;
  @Matches(phoneRegex, {
    message: `Invalid phone number`,
  })
  phoneNo: string;

  @IsString()
  address?: string;

  @IsEmail()
  @Matches(emailRegex, {
      message: `Invalid email`,
  })
  email: string;

  @Matches(pwdRegex, {
    message: `Password must be atleast 6 character and most contain atleast one special character.`,
  })
  password: string;

  status: number;

}
