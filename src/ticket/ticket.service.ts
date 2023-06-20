import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cron } from '@nestjs/schedule';
import { Repository } from 'typeorm';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Ticket } from './entities/ticket.entity';
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

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
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
    if (updateTicketDto.phone)
      return this.ticketRepository.update(
        { phone: updateTicketDto.phone },
        { count: updateTicketDto.count, weekDay: updateTicketDto.weekDay },
      );
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

  // 查询所有
  findAll() {
    return this.ticketRepository.find({
      order: {
        id: 'DESC',
      },
    });
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

  // 定时任务
  @Cron('0 0 */6 * * *')
  async handleCron() {
    const findAll = await this.findAll();
    for (const item of findAll) {
      const res = await getToken({
        remark: item.remark,
        phone: item.phone,
        password: item.password,
      });
      const token = 'Bearer ' + res.token;
      await this.update({ id: item.id, token });
      console.log(
        `${
          item.phone
        }更新 token 完成，当前时间：${new Date().toLocaleString()}`,
      );
      await new Promise((resolve) => setTimeout(resolve, 10 * 1000)); // 延迟 30秒 分钟
    }
    console.log('更新所有token完成了', findAll);
  }
}
