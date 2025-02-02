import { Injectable, OnModuleInit, OnModuleDestroy, Global } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    // Initialize Prisma Client first
    const prisma = new PrismaClient();
    // Extend with Accelerate
    const extendedPrisma = prisma.$extends(withAccelerate());
    super(); // Call parent constructor

    // Manually copy properties from extended Prisma
    Object.assign(this, extendedPrisma);
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
