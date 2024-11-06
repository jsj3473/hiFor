import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/create')
  createUser(@Body() user: CreateUserDto) {
    return this.userService.createUser(user);
  }  
  
  @Get('/isUserId/:userId')
  async isUserId(@Param('userId') userId: string) {
    const user = await this.userService.isUserId(userId);
    console.log("user:",user);
    return { available: !user };
  } 
  
  @Get('/isEmail/:email')
  async isEmail(@Param('email') email: string) {
    const user = await this.userService.isEmail(email);
    console.log("user:",user);
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
  

  @Delete('/delete/:email')
  deleteUser(@Param('email') email: string) {
    return this.userService.deleteUser(email);
  }
}
