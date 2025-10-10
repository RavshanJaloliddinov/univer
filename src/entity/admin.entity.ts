import { BaseEntity } from 'src/common/database/BaseEntity';
import { AdminRoles } from 'src/common/database/Enum';
import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class Admin extends BaseEntity {

  @PrimaryColumn({unique: true})
  email: string;

  @Column({ nullable: true })
  name?: string;

  @Column()
  password: string;

  @Column({type: 'enum', enum: AdminRoles, default: AdminRoles.ADMIN})
  role: AdminRoles;

}