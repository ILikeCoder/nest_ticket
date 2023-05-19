import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketModule } from './ticket/ticket.module';
import { OrderModule } from './order/order.module';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '119.23.233.156',
      port: 3306,
      username: 'root', // 数据库用户名
      password: 'Aa123456@', // 数据库密码
      database: 'ticket',
      retryDelay: 100,
      retryAttempts: 1,
      synchronize: true,
      autoLoadEntities: true,
    }),
    TicketModule,
    OrderModule,
  ],
})
export class AppModule {}
