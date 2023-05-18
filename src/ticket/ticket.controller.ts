import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import type { User } from '../utils/getToken';
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
  async findAll(@Query() query: any) {
    if (!!query.password) {
      return this.ticketService.findPasswordTicket();
    }
    return this.ticketService.findAll();
  }

  // 根据一个模糊的手机号来查询
  @Post('/getToken')
  findOne(@Body() body: User) {
    return this.ticketService.findToken(body);
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
