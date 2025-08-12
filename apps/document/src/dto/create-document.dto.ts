import { IsString, IsOptional, IsInt, MaxLength } from 'class-validator';

export class CreateDocumentDto {
  @IsString()
  @MaxLength(255)
  title: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsInt()
  knowledgeBaseId: number;

  @IsOptional()
  @IsInt()
  directoryId?: number;

  @IsOptional()
  @IsString()
  contentType = 'markdown'; // markdown/html

  @IsOptional()
  @IsInt()
  isDraft = 0; // 0-发布，1-草稿

  @IsOptional()
  @IsInt({ each: true })
  tagIds?: number[]; // 关联标签ID
}
