import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
export interface UserInfo {
  id: string;
  name: string;
  identityCode: string;
  identityCodeType: '0';
  identityCodeTypeName: '身份证';
  imgPath: '';
  telephone: '';
}
@Entity()
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  remark: string;

  @Column({ unique: true })
  phone: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  token: string;

  @Column({ nullable: true })
  count: number;

  @Column({ nullable: true })
  weekDay: string;

  @Column({ type: 'json', nullable: true })
  userInfos: UserInfo[];

  @Column({ nullable: true })
  sb: string;

  @Column('json', { nullable: true })
  hackInfos: { userName: string; documentNum: string }[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updateAt: Date;
}
