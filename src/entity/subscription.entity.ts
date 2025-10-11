import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Vacancy } from './vacancy.entity';
import { BaseEntity } from 'src/common/database/BaseEntity';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

@Entity('subscription')
export class Subscription extends BaseEntity{

  @Column({ length: 255 })
  fullName: string;

  @Column({ length: 255 })
  age: string;

  @Column({
    type: 'enum',
    enum: Gender,
  })
  gender: Gender;

  @Column({ length: 255 })
  resume_file: string;

  @Column({ length: 255 })
  phone: string;

  @Column({ length: 255 })
  email: string;

  @Column({ length: 255 })
  major: string;

  @ManyToOne(() => Vacancy, (vacancy) => vacancy.subscriptions, { onDelete: 'CASCADE' })
  vacancy: Vacancy;
}