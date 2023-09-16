import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  // exports prisma service to work with db
  providers: [PrismaService],
  exports: [PrismaService]
})
export class PrismaModule { }
