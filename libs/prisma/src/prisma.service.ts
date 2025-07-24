// 引入 NestJS 核心模块中的 Injectable 装饰器和 OnModuleInit 接口
import { Injectable, OnModuleInit } from '@nestjs/common';
// 引入 Prisma 生成的客户端
import { PrismaClient } from 'generated/prisma';

/**
 * Prisma 服务，负责与数据库交互
 * 继承自 PrismaClient 并实现 OnModuleInit 接口
 */
@Injectable() // 声明此类为 NestJS 可注入的服务
export class PrismaService extends PrismaClient implements OnModuleInit {
  /**
   * 构造函数，初始化 PrismaClient
   */
  constructor() {
    // 调用父类 PrismaClient 的构造函数并传入配置
    super({
      log: [
        {
          emit: 'stdout', // 将日志输出到标准输出
          level: 'query', // 记录所有 SQL 查询
        },
      ],
    });
  }

  /**
   * 模块初始化时执行的生命周期钩子
   * 用于建立与数据库的连接
   */
  async onModuleInit() {
    await this.$connect(); // 建立数据库连接
  }
}
