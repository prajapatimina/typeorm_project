import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { Role } from "./Role";

@Entity()
export class RolePermission{
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Role,  (role) => role.id,{
      onDelete:"CASCADE"
    })
    @JoinColumn()
        role: Role;

    @Column('text',{array:true,default: []})
    permission: string[];

    @CreateDateColumn()
      createdAt: Date;

    @UpdateDateColumn()
      updatedAt: Date;
}