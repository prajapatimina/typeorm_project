import { Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "./Role";
import { User } from "./User";

@Entity()
export class UserRoles{
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => User,  (user) => user.id,{
        onDelete:"CASCADE"
    })
    @JoinColumn()
        user: User;

    @ManyToOne(() => Role,  (role) => role.id,{
        onDelete:"CASCADE"
    })
    @JoinColumn()
        role: Role;
}
