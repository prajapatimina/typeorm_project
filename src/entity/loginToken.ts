import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    OneToOne,
    JoinColumn,
} from 'typeorm';
import { User } from './User';



@Entity()
export class LoginToken {
  @PrimaryGeneratedColumn()
      id: number;

  @Column({nullable:true})
      code: number;

  @Column({nullable:true})
      user_email: string;


  @Column({ default: false })
      codeStatus: boolean;

  @Column({nullable:true})
      createdAt: Date;

    @Column({nullable:true})
        expiredAt: Date;

    @OneToOne(() => User,  (user) => user.loginToken_id)
    @JoinColumn()
        user_id: User;


}
