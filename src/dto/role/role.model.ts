import { IsString, IsNotEmpty, IsArray, ArrayNotEmpty } from "class-validator";
export class RoleDto {
    id: number;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsArray()
    @IsString({each:true})
    @ArrayNotEmpty()
    permission: string[];
  }
