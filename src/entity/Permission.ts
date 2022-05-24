import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";

enum Status {
  INACTIVE,
  ACTIVE
}
@Entity()
export class Permission{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    slug:string;

    @Column({nullable:true})
    description:string;

    @Column({default: Status.INACTIVE })
    status: Status;

    @CreateDateColumn()
      createdAt: Date;

    @UpdateDateColumn()
      updatedAt: Date;
}