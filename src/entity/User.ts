import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import {Contains, IsInt, Length, IsEmail, Matches, Min, Max, MinLength} from "class-validator";
const phoneRegex = /^98[0-9]{8}$/
const pwdRegex = /((.d*)(?=.*[!@#$%]).{5,})/
const emailRegex = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/

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

    @Column()
    @IsEmail()
    @Matches(emailRegex,{
      message:`Invalid email`
    })
    email:string

    @Column()
    @Matches(pwdRegex,{
      message:`Password must be atleast 6 character and most contain atleast one special character.`
    })
    password: string

    @Column()
    status: boolean

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    

  

}
