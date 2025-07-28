import { Inject, Injectable } from '@nestjs/common';
import { KnowledgeBaseDto } from './dto/knowledge-base.dto';
import { PrismaService } from '@app/prisma';

@Injectable()
export class KnowledgeBaseService {
  @Inject(PrismaService)
  private prismaService: PrismaService;

  async createKnowledgeBase(
    knowledgeBase: KnowledgeBaseDto,
    userId: number,
  ): Promise<string> {
    await this.prismaService.knowledgeBase.create({
      data: {
        ...knowledgeBase,
        creator: {
          connect: {
            id: userId,
          },
        },
      },
    });
    return 'Knowledge Base Created!';
  }

  async knowledgeBaseList(userId: number) {
    console.log(userId);
    return this.prismaService.knowledgeBase.findMany({
      where: {
        creatorId: userId,
      },
    });
  }
}
