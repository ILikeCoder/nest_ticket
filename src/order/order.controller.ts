import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { Order } from './entities/order.entity';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // 查询所有
  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @Post()
  createOrUpdateOrder(@Body() order: Order): Promise<Order> {
    return this.orderService.createOrUpdate(order);
  }

  @Put()
  updateOrder(@Body() order: Order): Promise<Order> {
    return this.orderService.update(order);
  }
  @Delete(':phone')
  deleteOrder(@Param() phone: string) {
    return this.orderService.delete(phone);
  }
}
