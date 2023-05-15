import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketModule } from './ticket/ticket.module';
import { LoggerMiddleware } from './middleware/logger.middleware';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '47.98.106.195',
      port: 3306,
      username: 'root', // 数据库用户名
      password: 'Aa123456@', // 数据库密码
      database: 'ticket',
      retryDelay: 500,
      retryAttempts: 5,
      synchronize: true,
      autoLoadEntities: true,
    }),
    TicketModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('ticket');
  }
}
