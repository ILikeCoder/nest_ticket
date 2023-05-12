import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  // 创建
  @Post()
  create(@Body() createTicketDto: CreateTicketDto) {
    return this.ticketService.create(createTicketDto);
  }
  // 查询所有
  @Get()
  async findAll() {
    return this.ticketService.findAll();
  }

  // 根据一个模糊的手机号来查询
  @Get(':phone')
  findOne(@Param('phone') phone: string) {
    return this.ticketService.findOne(phone);
  }

  // 更新
  @Put()
  update(@Body() updateTicketDto: UpdateTicketDto) {
    return this.ticketService.update(updateTicketDto);
  }

  // 删除
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketService.remove(id);
  }
}
