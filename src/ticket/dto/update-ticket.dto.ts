import { PartialType } from '@nestjs/mapped-types';
import { UserInfo } from '../entities/ticket.entity';
import { CreateTicketDto } from './create-ticket.dto';

export class UpdateTicketDto extends PartialType(CreateTicketDto) {
  id: number;
  userInfos: UserInfo[];
}
