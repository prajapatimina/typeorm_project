import { Matches } from "class-validator";
import { EMAIL_REGEX, PWD_REGEX, VALIDATION_ERROR_MESSAGE } from "../../constant/regex";

export class AuthDto {
  id: number;

  @Matches(EMAIL_REGEX.email,{
    message:VALIDATION_ERROR_MESSAGE.invalidEmail
  })
  email: string;

  @Matches(PWD_REGEX.pwd,{
    message:VALIDATION_ERROR_MESSAGE.invalidPassword
  })
  password: string;
}
