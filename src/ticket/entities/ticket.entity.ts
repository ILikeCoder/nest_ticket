import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
export interface UserInfo {
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

  @Column()
  phone: string;

  @Column({ type: 'json', nullable: true })
  userInfos: UserInfo[];

  @CreateDateColumn()
  time: Date;
}
