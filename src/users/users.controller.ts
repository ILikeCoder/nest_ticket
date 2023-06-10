import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { getToken } from 'src/utils/getToken';
import axios from 'axios';
import { del_radom_mima, constans } from '../utils/getToken';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('/updateToken')
  async updateToken(@Body() body) {
    const { phone } = body;
    const findPhone = await this.usersService.findPhoneOne(phone);
    const res = await getToken({
      phone: findPhone.phone,
    });
    const token = 'Bearer ' + res.token;
    await this.usersService.update(findPhone.id, { token });
    const data = await this.usersService.findPhoneOne(phone);
    return {
      data,
      code: 200,
      message: '更新Token成功',
    };
  }

  @Get('/order')
  async findOrder(@Query() query) {
    const { m, c: c1, l, d } = query;
    const sb = del_radom_mima(m);
    const c = del_radom_mima(c1);
    const result = await this.usersService.findOne(sb);

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

    if (d === '1665888204395515904') {
      result.hackInfos = [
        {
          userName: '周天剩余5',
          documentNum: '371402199312090325',
        },
        {
          userName: '周天剩余5',
          documentNum: '371428199312293513',
        },
        {
          userName: '周天剩余5',
          documentNum: '371402201604072612',
        },
        {
          userName: '周天剩余5',
          documentNum: '371402201905292635',
        },
        {
          userName: '周天剩余5',
          documentNum: '371402201905292635',
        },
      ];
    }
    if (l) {
      const data = orders.data.data.orderDetailsList.slice(
        constans[c],
        l,
      ) as any[];
      for (const [index] of data.entries()) {
        data[index].userName = result.hackInfos[index + constans[c]].userName;
        data[index].documentNum =
          result.hackInfos[index + constans[c]].documentNum;
      }
      return data;
    } else {
      orders.data.data.orderDetailsList[constans[c]].userName =
        result.hackInfos[constans[c]].userName;
      orders.data.data.orderDetailsList[constans[c]].documentNum =
        result.hackInfos[constans[c]].documentNum;
      return [orders.data.data.orderDetailsList[constans[c]]];
    }
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Post(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Get('/auto')
  async autoUpdate() {
    await this.usersService.autoUpdate();
  }
}
