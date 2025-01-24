import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Put,
  Delete,
  BadRequestException, 
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  
  @Get('/isUserId/:userId')
  async isUserId(@Param('userId') userId: string) {
    const user = await this.userService.isUserId(userId);
    //console.log("user:",user);
    return { available: !user };
  } 
  
  @Get('/isEmail/:email')
  async isEmail(@Param('email') email: string) {
    const user = await this.userService.isEmail(email);
    //console.log("user:",user);
    return { available: !user };
  }

  @Get('/getUser/:userId')
  async getUser(@Param('userId') userId: string) {
    
    //console.log("userid:",userId)
    const user = await this.userService.getUser(userId);
    //console.log("user:",user)
    return user;
  }

  @Post('/updateUser')
  async updateUser(@Body() user: CreateUserDto) {
    console.log('updatedto in u cont in upuser',user )
    return this.userService.updateUser(user);
  }
  

  @Delete('/delete/:id')
  async deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }

  @Post('findUsername')
  async findUsername(@Body('email') email: string) {
    if (!email) {
      throw new BadRequestException('이메일을 입력해주세요.');
    }

    // 1. 이메일을 통해 유저 정보를 조회
    const user = await this.userService.findByEmail(email); // UserService에서 이메일로 유저 조회

    if (!user) {
      throw new NotFoundException('등록된 이메일이 없습니다.');
    }

    // 2. 조회된 유저의 아이디 반환 (보안을 위해 이메일로 전송하는 것도 가능)
    return { username: user.userId, message: '아이디 찾기가 완료되었습니다.' };
  }
  
}
