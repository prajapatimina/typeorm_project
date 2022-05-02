import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import {Contains, IsInt, Length, IsEmail, Matches, Min, Max, MinLength} from "class-validator";
const phoneRegex = /^98[0-9]{8}$/
const pwdRegex = /((.d*)(?=.*[!@#$%]).{5,})/

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    @Matches(phoneRegex,{
        message:`Invalid phone number`
      })
    phoneNo: string

    @Column()
    address: string

    @Column({ unique: true })
    @IsEmail()
    email:string

    @Column()
    @Matches(pwdRegex,{
      message:`Password must be atleast 6 character and most contain atleast one special character.`
    })
    password: string

    @Column()
    status: boolean

    

  

}
