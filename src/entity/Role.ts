import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";

import { UserRoles } from "./UserRoles";

enum Status {
  INACTIVE,
  ACTIVE
}
@Entity()
export class Role{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name:string;

    @Column({default: Status.INACTIVE })
    status: Status;

    @CreateDateColumn()
      createdAt: Date;

    @UpdateDateColumn()
      updatedAt: Date;

    @OneToMany(() => UserRoles,  (userRole) => userRole.role,{
        onDelete:"CASCADE"
    })
    @JoinColumn()
        userRole: UserRoles;
}