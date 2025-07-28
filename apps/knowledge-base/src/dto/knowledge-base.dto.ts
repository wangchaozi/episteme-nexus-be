import { IsNotEmpty } from 'class-validator';

export class KnowledgeBaseDto {
  @IsNotEmpty({
    message: '知识库名称不能为空',
  })
  name: string;
  @IsNotEmpty({
    message: '知识库描述不能为空',
  })
  description: string;
  isPublic?: number; // 可选，默认0（私有）
  coverImage?: string; // 可选，封面图URL
}
