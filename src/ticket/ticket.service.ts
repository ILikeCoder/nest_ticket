import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Ticket } from './entities/ticket.entity';
import { getToken, User } from '../utils/getToken';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketService: Repository<Ticket>,
  ) {}

  // 创建
  create(createTicketDto: CreateTicketDto) {
    const ticket = new Ticket();
    ticket.phone = createTicketDto.phone;
    ticket.remark = createTicketDto.remark;
    return this.ticketService.save(ticket);
  }

  // 查询所有
  findAll() {
    return this.ticketService.find({
      order: {
        id: 'DESC',
      },
    });
  }

  findPasswordTicket() {
    return this.ticketService.find({
      where: {
        remark: Like('%-有密%'),
      },
    });
  }
  async findToken(data: User) {
    return await getToken(data);
  }
  // 根据一个模糊的手机号来查询
  findOne(phone: string) {
    return this.ticketService.find({
      where: {
        phone: Like(`%${phone}%`),
      },
    });
  }

  // 更新
  update(updateTicketDto: UpdateTicketDto) {
    console.log(updateTicketDto);
    return this.ticketService.update(updateTicketDto.id, updateTicketDto);
  }

  // 删除
  remove(id: string) {
    return this.ticketService.delete(id);
  }
}
