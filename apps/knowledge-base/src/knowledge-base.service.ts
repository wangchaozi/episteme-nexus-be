import { Inject, Injectable } from '@nestjs/common';
import { KnowledgeBaseDto } from './dto/knowledge-base.dto';
import { PrismaService } from '@app/prisma';

@Injectable()
export class KnowledgeBaseService {
  @Inject(PrismaService)
  private prismaService: PrismaService;

  async createKnowledgeBase(knowledgeBase: KnowledgeBaseDto, userId: number) {
    return this.prismaService.knowledgeBase.create({
      data: {
        ...knowledgeBase,
        creator: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async knowledgeBaseList(userId: number) {
    return this.prismaService.knowledgeBase.findMany({
      where: {
        creatorId: userId,
      },
    });
  }
}
