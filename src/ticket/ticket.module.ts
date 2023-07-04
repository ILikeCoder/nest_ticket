import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { Ticket } from './entities/ticket.entity';
import { LoggerService } from '../logger/logger.service';
@Module({
  imports: [TypeOrmModule.forFeature([Ticket]), ScheduleModule.forRoot()],
  controllers: [TicketController],
  providers: [TicketService, LoggerService],
  exports: [TicketService],
})
export class TicketModule {}
