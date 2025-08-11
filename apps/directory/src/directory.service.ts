import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDirectoryDto } from './dto/create-directory.dto';
import { PrismaService } from '@app/prisma';
import { UpdateDirectoryDto } from './dto/update-directory.dto';

@Injectable()
export class DirectoryService {
  @Inject(PrismaService)
  private prismaService: PrismaService;

  // 创建目录
  async createDirectories(
    knowledgeBaseId: number,
    createDirectoryDto: CreateDirectoryDto,
    userId: number,
  ) {
    const kb = await this.prismaService.knowledgeBase.findUnique({
      where: { id: knowledgeBaseId, isDeleted: 0, creatorId: userId },
    });
    if (!kb) throw new ForbiddenException('无权限操作该知识库');

    return this.prismaService.directory.create({
      data: {
        ...createDirectoryDto,
        knowledgeBaseId,
      },
    });
  }

  // 递归构建目录树
  private async buildTree(directoryId: number | null, knowledgeBaseId: number) {
    const directories = await this.prismaService.directory.findMany({
      where: {
        parentId: directoryId,
        knowledgeBaseId,
        isDeleted: 0,
      },
      orderBy: { sortOrder: 'asc' },
    });

    // 递归获取子目录
    return Promise.all(
      directories.map(async (dir) => {
        const children = await this.buildTree(dir.id, knowledgeBaseId);
        // 统计目录下的文档数（含子目录）
        const documentCount = await this.prismaService.document.count({
          where: {
            directoryId: dir.id,
            isDeleted: 0,
          },
        });
        return { ...dir, children, documentCount };
      }),
    );
  }

  // 获取目录树
  directoriesList(knowledgeBaseId: number) {
    return this.buildTree(null, knowledgeBaseId);
  }

  // 更新目录
  async update(id: number, updateDto: UpdateDirectoryDto, userId: number) {
    // 验证目录存在且所属知识库属于当前用户
    const dir = await this.prismaService.directory.findUnique({
      where: { id, isDeleted: 0 },
      include: { knowledgeBase: true },
    });
    if (!dir) throw new NotFoundException('目录不存在');
    if (dir.knowledgeBase.creatorId !== userId)
      throw new ForbiddenException('无权限修改');

    return this.prismaService.directory.update({
      where: { id },
      data: updateDto,
    });
  }

  // 删除目录（下属文档移至根目录）
  async remove(id: number, userId: number) {
    const dir = await this.prismaService.directory.findUnique({
      where: { id, isDeleted: 0 },
      include: { knowledgeBase: true },
    });
    if (!dir) throw new NotFoundException('目录不存在');
    if (dir.knowledgeBase.creatorId !== userId)
      throw new ForbiddenException('无权限删除');

    // 事务：删除目录 + 移动下属文档
    return this.prismaService.$transaction([
      // 下属文档移至根目录（directoryId设为null）
      this.prismaService.document.updateMany({
        where: { directoryId: id, isDeleted: 0 },
        data: { directoryId: null },
      }),
      // 逻辑删除目录
      this.prismaService.directory.update({
        where: { id },
        data: { isDeleted: 1 },
      }),
    ]);
  }
}
