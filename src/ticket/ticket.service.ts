import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cron } from '@nestjs/schedule';
import { In, Repository } from 'typeorm';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Ticket } from './entities/ticket.entity';
import { LoggerService } from '../logger/logger.service';
import {
  getRandomIdentityCard,
  encryptString,
  getToken,
  del_radom_mima,
} from '../utils';
import { TicketIndex } from '../utils/constans';
import {
  insertPersonApi,
  getPersonDataListApi,
  deletePersonApi,
} from '../utils/apis';
import * as dayjs from 'dayjs';
@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    private readonly loggerService: LoggerService,
  ) {}

  // 创建
  async create(createTicketDto: CreateTicketDto) {
    const sb = encryptString(createTicketDto.phone);
    const res = await getToken({
      remark: createTicketDto.remark,
      phone: createTicketDto.phone,
      password: createTicketDto.password,
    });
    const token = 'Bearer ' + res.token;
    const user = await this.ticketRepository.save({
      ...createTicketDto,
      sb,
      token,
    });
    const identityCardList = getRandomIdentityCard();

    for (const item of identityCardList) {
      await insertPersonApi(
        {
          identityCodeType: '0',
          identityCodeTypeName: '身份证',
          imgPath: '',
          telephone: '',
          name: item.name,
          identityCode: item.card,
        },
        token,
      );
    }
    const result = await getPersonDataListApi(token);
    await this.update({
      id: user.id,
      userInfos: result.data.data,
    });
    return {
      code: 200,
      message: '添加账号成功',
      data: user,
    };
  }

  // 删除
  async remove(id: number) {
    const res = await this.ticketRepository.findOne({
      where: {
        id,
      },
    });
    for (const item of res.userInfos) {
      await deletePersonApi(item.id, res.token);
    }
    return this.ticketRepository.delete(id);
  }

  // 更新
  update(updateTicketDto: UpdateTicketDto) {
    if (updateTicketDto.phone) {
      if (updateTicketDto.count === 1) {
        return this.ticketRepository.update(
          { phone: updateTicketDto.phone },
          {
            count: null,
            weekDay: null,
          },
        );
      }
      return this.ticketRepository.update(
        { phone: updateTicketDto.phone },
        {
          count: updateTicketDto.count,
          weekDay: updateTicketDto.weekDay,
        },
      );
    }
    return this.ticketRepository.update(updateTicketDto.id, updateTicketDto);
  }

  // 查找单个sb
  findSbOne(sb: string) {
    return this.ticketRepository.findOne({
      where: {
        sb,
      },
    });
  }

  // 查询数据
  async findAll(params: {
    page: string;
    pageSize: string;
    weekDay?: string[];
  }) {
    const { page = 1, pageSize = 10, weekDay } = params;
    let where = {};
    let order = {};
    if (weekDay && weekDay.length > 0) {
      where = {
        weekDay: In(weekDay),
      };
      order = {
        weekDay: 'ASC',
      };
    } else {
      order = {
        id: 'DESC',
      };
    }
    const [items, total] = await Promise.all([
      this.ticketRepository.find({
        order,
        take: Number(pageSize),
        skip: (Number(page) - 1) * Number(pageSize),
        where,
      }),
      this.ticketRepository.count({
        where,
      }),
    ]);
    items.forEach((item: any) => {
      item.updateAt = dayjs(item.updateAt).format('MM-DD HH:mm:ss');
    });
    return {
      code: 200,
      data: {
        items,
        total,
      },
    };
  }

  // 查订单二维码
  async findOrderDetail(m, d, c, l) {
    const sb = del_radom_mima(m);
    c = del_radom_mima(c);
    const result = await this.findSbOne(sb);
    const orders = await axios.post(
      'https://ticket.sdstm.cn/backend/operate/wx/orderDetails',
      {
        orderId: d,
      },
      {
        headers: {
          Authorization: result.token,
        },
      },
    );

    if (l) {
      const data = orders.data.data.orderDetailsList.slice(
        TicketIndex[c],
        l,
      ) as any[];
      for (const [index] of data.entries()) {
        data[index].userName =
          result.hackInfos[index + TicketIndex[c]].userName;
        data[index].documentNum =
          result.hackInfos[index + TicketIndex[c]].documentNum;
      }
      return data;
    }
    orders.data.data.orderDetailsList[TicketIndex[c]].userName =
      result.hackInfos[TicketIndex[c]].userName;
    orders.data.data.orderDetailsList[TicketIndex[c]].documentNum =
      result.hackInfos[TicketIndex[c]].documentNum;
    return [orders.data.data.orderDetailsList[TicketIndex[c]]];
  }

  //根据手机号查找
  findPhoneOne(phone: string) {
    return this.ticketRepository.findOne({
      where: {
        phone,
      },
    });
  }

  // 更新某一个账号 token
  async updateOneToken(body) {
    const { phone } = body;
    const findOne = await this.findPhoneOne(phone);
    const res = await getToken({
      remark: findOne.remark,
      phone: findOne.phone,
      password: findOne.password,
    });
    const token = 'Bearer ' + res.token;
    await this.update({ id: findOne.id, token });
    const data = await this.findPhoneOne(phone);
    return {
      data,
      code: 200,
      message: '更新Token成功',
    };
  }

  // 获取已有的票数信息
  getFilterDate() {
    // const statement = `SELECT weekDay,SUM(count) AS total FROM ticket WHERE weekDay IS NOT NULL GROUP BY weekDay ORDER BY weekDay;`;
    // return this.ticketRepository.query(statement);
    return this.ticketRepository
      .createQueryBuilder('ticket')
      .select('ticket.weekDay', 'weekDay')
      .addSelect('SUM(ticket.count)', 'total')
      .where('ticket.weekDay IS NOT NULL')
      .groupBy('ticket.weekDay')
      .orderBy('ticket.weekDay')
      .getRawMany();
  }

  async handleUpdateToken() {
    const maxRetries = 8; // 最大重试次数
    try {
      const result = await this.ticketRepository.find();
      for (const item of result.filter((item) => item.weekDay)) {
        let retries = 0;
        let success = false;
        while (retries < maxRetries && !success) {
          try {
            const res = await getToken({
              remark: item.remark,
              phone: item.phone,
              password: item.password,
            });
            const token = 'Bearer ' + res.token;
            await this.update({ id: item.id, token });
            success = true; // 更新成功标志
          } catch (error) {
            retries++; // 递增重试次数
            this.loggerService.ticket(
              `${item.remark} 更新token失败,重试次数:${retries}`,
            );
            await new Promise((resolve) => setTimeout(resolve, 15 * 1000)); // 延迟 15 秒钟
          }
        }
        if (success) {
          this.loggerService.ticket(
            `${
              item.remark
            } 更新 token 完成，当前时间：${new Date().toLocaleString()}`,
          );
        } else {
          this.loggerService.ticket(`更新 token 失败，达到最大重试次数`);
        }
      }
    } catch (error) {
      this.loggerService.ticket(`获取数据失败：${error.message}`);
    }
  }

  // 定时任务 星期二-星期5 早上6点执行
  @Cron('0 6 * * 2-5')
  async handleWeekDayCron() {
    this.loggerService.ticket(
      `定时任务开始执行了 当前时间:${new Date().toLocaleString()}`,
    );
    await this.handleUpdateToken();
    this.loggerService.ticket(
      `更新周内有票的token完成了 当前时间:${new Date().toLocaleString()}`,
    );
  }
  // 定时任务 星期六-星期日 早上6点和9点执行
  @Cron('0 6,9 * * 6,0')
  async handleWeekEndCron() {
    this.loggerService.ticket(
      `定时任务开始执行了 当前时间:${new Date().toLocaleString()}`,
    );
    await this.handleUpdateToken();
    this.loggerService.ticket(
      `更新周末有票的token完成了 当前时间:${new Date().toLocaleString()}`,
    );
  }
}
