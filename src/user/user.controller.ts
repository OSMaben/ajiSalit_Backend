import { Controller, Get, Post, Body, Patch, Param, Delete,ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/Logindto/login-user.dto';
 

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  
  // createUser(@Body() createUserDto: CreateUserDto) {
  //   return this.userService.create(createUserDto);
  // }

  @Post('register')
  async register(@Body(ValidationPipe) CreateUserDto: CreateUserDto) {
    return this.userService.register(CreateUserDto);
  }

  @Post('verify')
  async verifyOTP(
    @Body('phoneNumber') phoneNumber: string,
    @Body('otp') otp: string,
  ) {
    return this.userService.verifyOTP(phoneNumber, otp);
  }


  @Post('login')
  async login(@Body(ValidationPipe) LoginUserDto: LoginUserDto) {
    return this.userService.login(LoginUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
