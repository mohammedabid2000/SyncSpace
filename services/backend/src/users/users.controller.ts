import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/create_user.dto.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  async findAll() {
    return this.usersService.findAllUsers();
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.usersService.findUserById(id);
  }

  @Delete()
  async removeAll() {
    return this.usersService.removeAllUsers();
  }

  @Delete(':id')
  async removeOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.usersService.removeUserById(id);
  }
}
