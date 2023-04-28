import { Module } from '@nestjs/common';
import { TicketModule } from './ticket/ticket.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root', // 数据库用户名
      password: 'root', // 数据库密码
      database: 'ticket',
      retryDelay: 500,
      retryAttempts: 5,
      synchronize: true,
      autoLoadEntities: true,
    }),
    TicketModule,
  ],
})
export class AppModule {}
