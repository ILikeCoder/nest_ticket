import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { ScheduleModule } from '@nestjs/schedule';
import { Ticket } from './entities/ticket.entity';
import { LoggerService } from '../logger/logger.service';
@Module({
  // ScheduleModule.forRoot()
  imports: [TypeOrmModule.forFeature([Ticket])],
  controllers: [TicketController],
  providers: [TicketService, LoggerService],
  exports: [TicketService],
})
export class TicketModule {}
