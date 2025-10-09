import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Subscription } from './subscription.entity';
import { BaseEntity } from 'src/common/database/BaseEntity';

@Entity('vacansy')
export class Vacancy extends BaseEntity{

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ length: 255 })
  location: string;

  @Column({ length: 255 })
  image: string;

  @Column({ length: 255 })
  experience: string;

  @Column({ length: 255 })
  requirement: string;

  @OneToMany(() => Subscription, (subscription) => subscription.vacancy)
  subscriptions: Subscription[];
}
