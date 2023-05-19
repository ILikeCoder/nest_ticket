import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  findAll() {
    return this.orderRepository.find();
  }

  async createOrUpdate(order: Order): Promise<Order> {
    const { phone, count } = order;
    const existingOrder = await this.orderRepository.findOne({
      where: { phone },
    });
    if (existingOrder) {
      existingOrder.count += count;
      await this.orderRepository.save(existingOrder);
      return existingOrder;
    } else {
      return this.orderRepository.save(order);
    }
  }

  async update(order: Order): Promise<Order> {
    const { phone, count } = order;
    const existingOrder = await this.orderRepository.findOne({
      where: { phone },
    });
    if (!existingOrder) {
      throw new NotFoundException(`Order not found`);
    }
    existingOrder.count -= count;
    if (existingOrder.count <= 0) {
      await this.orderRepository.remove(existingOrder);
    } else {
      await this.orderRepository.save(existingOrder);
    }
    return existingOrder;
  }
  remove(order: Order) {
    return this.orderRepository.remove(order);
  }
}
