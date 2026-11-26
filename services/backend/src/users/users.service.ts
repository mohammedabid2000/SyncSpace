import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: any) {
    return this.prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        passwordHash: data.passwordHash,
        displayName: data.displayName,
      },
    });
  }

  async findAllUsers() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findUserById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async removeAllUsers() {
    return this.prisma.user.deleteMany({});
  }

  async removeUserById(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
