import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  key: number;

  @Column()
  phone: string;

  @Column()
  count: number;
}
