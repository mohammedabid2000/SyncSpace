import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() body: any) {
    return this.usersService.createUser(body);
  }

  @Get()
  async findAll() {
    return this.usersService.findAllUsers();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findUserById(id);
  }

  @Delete()
  async removeAll() {
    return this.usersService.removeAllUsers();
  }

  @Delete(':id')
  async removeOne(@Param('id') id: string) {
    return this.usersService.removeUserById(id);
  }
}
