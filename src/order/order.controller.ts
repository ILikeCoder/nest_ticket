import { Controller, Get, Post, Put, Body } from '@nestjs/common';
import { Order } from './entities/order.entity';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // 查询所有
  @Get()
  async findAll() {
    return this.orderService.findAll();
  }

  @Post()
  async createOrUpdateOrder(@Body() order: Order): Promise<Order> {
    return this.orderService.createOrUpdate(order);
  }

  @Put()
  async updateOrder(@Body() order: Order): Promise<Order> {
    return this.orderService.update(order);
  }
}
