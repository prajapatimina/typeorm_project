import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    JoinColumn
} from 'typeorm';
import { IsEmail, Matches } from 'class-validator';
import { LoginToken } from './loginToken';
const phoneRegex = /^98[0-9]{8}$/;
const pwdRegex = /((.d*)(?=.*[!@#$%]).{5,})/;
const emailRegex = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;

enum Status {
    INACTIVE,
    ACTIVE,
    BLOCKED
  }

@Entity()
export class User {
  @PrimaryGeneratedColumn()
      id: number;

  @Column()
      name: string;

  @Column()
  @Matches(phoneRegex, {
      message: `Invalid phone number`,
  })
      phoneNo: string;

  @Column()
      address: string;

  @Column()
  @IsEmail()
  @Matches(emailRegex, {
      message: `Invalid email`,
  })
      email: string;

  @Column()
  @Matches(pwdRegex, {
      message: `Password must be atleast 6 character and most contain atleast one special character.`,
  })
      password: string;

  @Column({default: Status.INACTIVE })
      status: Status;

  @CreateDateColumn()
      createdAt: Date;

  @UpdateDateColumn()
      updatedAt: Date;

@Column({nullable:true})
    resetPasswordToken:string;

@Column({nullable:true})
    resetPasswordTokenExpireDate:Date;

    @OneToOne(() => LoginToken,  (login) => login.user_id)
    @JoinColumn()
        loginToken_id: LoginToken;

}
