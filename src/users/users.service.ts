import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cron } from '@nestjs/schedule';
import { User } from './entities/user.entity';
import { getToken } from 'src/utils/getToken';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userService: Repository<User>,
  ) {}
  create(createUserDto: CreateUserDto) {
    return this.userService.save(createUserDto);
  }

  findAll() {
    return this.userService.find();
  }

  findOne(sb: string) {
    return this.userService.findOne({
      where: {
        sb,
      },
    });
  }
  findPhoneOne(phone: string) {
    return this.userService.findOne({
      where: {
        phone,
      },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
  @Cron('0 0 */6 * * *')
  async handleCron() {
    const findAll = await this.findAll();
    for (const item of findAll) {
      const res = await getToken({
        phone: item.phone,
      });
      const token = 'Bearer ' + res.token;
      await this.update(item.id, { token });
      console.log(
        `${
          item.phone
        }更新 token 完成，当前时间：${new Date().toLocaleString()}`,
      );
      await new Promise((resolve) => setTimeout(resolve, 30 * 1000)); // 延迟 30秒 分钟
    }
    console.log('更新所有token完成了', findAll);
  }
}
