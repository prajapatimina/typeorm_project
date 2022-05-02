import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import {Contains, IsInt, Length, IsEmail, Matches, Min, Max} from "class-validator";
const phoneRegex = /^98[0-9]{8}$/
const pwdRegex = /((d*)(?=.*[!@#$%]).{6,})/

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    @Min(10)
    @Max(10)
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
    @Matches(phoneRegex,{
      message:`Password must be atleast 6 character and most contain atleast one special character.`
    })
    password: string

    @Column({default:false})
    status: boolean

  

}
