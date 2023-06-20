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
@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  // 创建
  @Post()
  create(@Body() createTicketDto: CreateTicketDto) {
    return this.ticketService.create(createTicketDto);
  }

  // 删除
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketService.remove(+id);
  }

  // 更新
  @Put()
  update(@Body() updateUserDto: UpdateTicketDto) {
    return this.ticketService.update(updateUserDto);
  }

  // 查询所有
  @Get()
  async findAll() {
    return this.ticketService.findAll();
  }

  // 更新一个token
  @Post('/updateToken')
  async updateOneToken(@Body() body) {
    return this.ticketService.updateOneToken(body);
  }

  // 查动态二维码
  @Get('/order')
  async findOrder(@Query() query) {
    const { m, d, c, l } = query;
    return this.ticketService.findOrderDetail(m, d, c, l);
  }
}
