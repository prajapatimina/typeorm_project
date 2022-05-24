import { Matches } from "class-validator";
import { PWD_REGEX, VALIDATION_ERROR_MESSAGE } from "../../constant/regex";
import { Match } from "../../decorator/match.decorator";

export class ChangePasswordDto{
    id: number;

    @Matches(PWD_REGEX.pwd,{
      message:VALIDATION_ERROR_MESSAGE.invalidPassword
    })
    currentPassword: string;

    @Matches(PWD_REGEX.pwd,{
      message:VALIDATION_ERROR_MESSAGE.invalidPassword
    })
    newPassword: string;

    @Match('newPassword')
    confirmPassword: string;
  }

