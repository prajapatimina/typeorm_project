import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    JoinColumn,
    BeforeInsert,
} from 'typeorm';
import { LoginToken } from './LoginToken';
import * as bcrypt from 'bcryptjs';


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
        phoneNo: string;

    @Column()
        address: string;

    @Column()
        email: string;

    @Column()
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

    @BeforeInsert()
        async hashPassword() {
            this.password = await bcrypt.hash(this.password, 10);
    }

}