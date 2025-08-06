import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { KnowledgeBaseDto } from './dto/knowledge-base.dto';
import { PrismaService } from '@app/prisma';

@Injectable()
export class KnowledgeBaseService {
  @Inject(PrismaService)
  private prismaService: PrismaService;

  // 创建知识库
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

  // 知识库列表
  async knowledgeBaseList(userId: number) {
    return this.prismaService.knowledgeBase.findMany({
      where: {
        creatorId: userId,
      },
    });
  }

  // 获取知识库详情
  async findOne(id: number) {
    return this.prismaService.knowledgeBase.findUnique({
      where: {
        id: id,
        isDeleted: 0,
      },
    });
  }

  // 删除知识库
  async remove(id: number, userId: number) {
    const isExist = await this.prismaService.knowledgeBase.findUnique({
      where: {
        id: id,
        isDeleted: 0,
      },
    });

    if (!isExist) {
      throw new HttpException('知识库不存在', HttpStatus.BAD_REQUEST);
    }
    if (isExist.creatorId !== userId) {
      throw new HttpException('无法删除', HttpStatus.BAD_REQUEST);
    }
    if (isExist.isDeleted === 1) {
      throw new HttpException('知识库已删除', HttpStatus.BAD_REQUEST);
    }
  }
}
