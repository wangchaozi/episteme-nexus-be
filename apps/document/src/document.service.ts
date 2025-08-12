import { PrismaService } from '@app/prisma';
import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';

@Injectable()
export class DocumentService {
  @Inject(PrismaService)
  private prismaService: PrismaService;

  // 计算文档字数
  private calculateWordCount(content: string): number {
    return content ? content.replace(/\s/g, '').length : 0;
  }

  // 创建文档
  async create(createDocumentDto: CreateDocumentDto, userId: number) {
    const { tagIds, ...docData } = createDocumentDto;

    const kb = await this.prismaService.knowledgeBase.findUnique({
      where: { id: docData.knowledgeBaseId, isDeleted: 0 },
    });
    if (!kb) throw new NotFoundException('知识库不存在');

    return this.prismaService.$transaction(async (tx) => {
      // 创建文档
      const document = await tx.document.create({
        data: {
          ...docData,
          creatorId: userId,
          lastEditorId: userId,
          wordCount: this.calculateWordCount(docData.content),
        },
      });

      // 创建初始版本
      await tx.documentVersion.create({
        data: {
          documentId: document.id,
          content: docData.content,
          editorId: userId,
          versionNumber: 1,
          changeNote: '初始版本',
        },
      });

      // 关联标签
      if (tagIds && tagIds.length > 0) {
        await Promise.all(
          tagIds.map((tagId) =>
            tx.documentTag.create({
              data: { documentId: document.id, tagId },
            }),
          ),
        );
        // 更新标签使用次数
        await tx.tag.updateMany({
          where: { id: { in: tagIds } },
          data: { useCount: { increment: 1 } },
        });
      }

      return document;
    });
  }

  async documentsList({
    page,
    size,
    knowledgeBaseId,
    directoryId,
    tagId,
    keyword,
  }) {
    const skip = (page - 1) * size;
    const where: any = {
      knowledgeBaseId,
      isDeleted: 0,
    };

    // 筛选条件
    if (directoryId !== undefined) {
      where.directoryId = directoryId;
    }
    if (tagId) {
      where.documentTags = { some: { tagId, isDeleted: 0 } };
    }
    if (keyword) {
      where.OR = [
        { title: { contains: keyword } },
        { content: { contains: keyword } },
      ];
    }

    // 执行查询
    const [items, total] = await Promise.all([
      this.prismaService.document.findMany({
        where,
        skip,
        take: size,
        orderBy: { updatedAt: 'desc' },
        include: {
          documentTags: {
            where: { isDeleted: 0 },
            include: {
              tag: {
                select: { id: true, name: true, color: true },
              },
            },
          },
          lastEditor: { select: { id: true, username: true } },
        },
      }),
      this.prismaService.document.count({ where }),
    ]);

    return { items, total, page, size };
  }

  // 获取文档详情
  async findOne(id: number) {
    const doc = await this.prismaService.document.findUnique({
      where: { id, isDeleted: 0 },
      include: {
        documentTags: {
          where: { isDeleted: 0 },
          include: {
            tag: {
              select: { id: true, name: true, color: true },
            },
          },
        },
        creator: { select: { id: true, username: true } },
        lastEditor: { select: { id: true, username: true } },
      },
    });

    if (!doc) throw new NotFoundException('文档不存在');

    // 浏览次数+1
    await this.prismaService.document.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    return doc;
  }

  // 更新文档（同时创建新版本）
  async update(id: number, updateDto: UpdateDocumentDto, userId: number) {
    const { changeNote, ...updateData } = updateDto;

    // 验证文档存在
    const doc = await this.prismaService.document.findUnique({
      where: { id, isDeleted: 0 },
      include: { knowledgeBase: true },
    });
    if (!doc) throw new NotFoundException('文档不存在');

    // 验证权限（知识库创建者或文档创建者）
    const isAuthorized =
      doc.knowledgeBase.creatorId === userId || doc.creatorId === userId;
    if (!isAuthorized) throw new ForbiddenException('无权限修改文档');

    // 事务：更新文档 + 创建新版本 + 处理标签
    return this.prismaService.$transaction(async (tx) => {
      // 计算新版本号
      const lastVersion = await tx.documentVersion.findFirst({
        where: { documentId: id },
        orderBy: { versionNumber: 'desc' },
      });
      const newVersionNumber = (lastVersion?.versionNumber || 0) + 1;

      // 仅当内容变更时创建新版本
      let newVersionId = null;
      if (
        updateData.content !== undefined &&
        updateData.content !== doc.content
      ) {
        const version = await tx.documentVersion.create({
          data: {
            documentId: id,
            content: updateData.content,
            editorId: userId,
            versionNumber: newVersionNumber,
            changeNote: changeNote || '更新内容',
          },
        });
        newVersionId = version.id;
      }

      // 更新文档
      const updatedDoc = await tx.document.update({
        where: { id },
        data: {
          ...updateData,
          lastEditorId: userId,
          wordCount: updateData.content
            ? this.calculateWordCount(updateData.content)
            : doc.wordCount,
        },
      });

      // 处理标签关联（略，类似创建文档的标签逻辑）

      return { ...updatedDoc, newVersionId };
    });
  }

  // 删除文档（逻辑删除）
  async remove(id: number, userId: number) {
    const doc = await this.prismaService.document.findUnique({
      where: { id, isDeleted: 0 },
      include: { knowledgeBase: true },
    });
    if (!doc) throw new NotFoundException('文档不存在');

    // 验证权限
    if (doc.knowledgeBase.creatorId !== userId && doc.creatorId !== userId) {
      throw new ForbiddenException('无权限删除文档');
    }

    return this.prismaService.document.update({
      where: { id },
      data: { isDeleted: 1 },
    });
  }
}
