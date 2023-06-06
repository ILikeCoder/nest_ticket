import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sb: string;

  @Column()
  url: string;

  @Column()
  pwd: string;

  @Column()
  token: string;

  @Column()
  phone: string;

  @Column('json', { nullable: true })
  hackInfos: { userName: string; documentNum: string }[];
}
