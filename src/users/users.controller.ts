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
    const findPhone = await this.usersService.findOne(phone);
    const res = await getToken({
      phone: findPhone.phone,
    });
    const token = 'Bearer ' + res.token;
    await this.usersService.update(findPhone.id, { token });
    const data = await this.usersService.findOne(phone);
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

    if (l) {
      const data = orders.data.data.orderDetailsList.slice(
        constans[c],
        l,
      ) as any[];
      for (const [index] of data.entries()) {
        data[index].userName = result.hackInfos[index].userName;
        data[index].documentNum = result.hackInfos[index].documentNum;
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
