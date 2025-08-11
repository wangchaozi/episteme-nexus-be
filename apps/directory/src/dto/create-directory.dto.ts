import { IsString, IsOptional, IsInt, MaxLength } from 'class-validator';

export class CreateDirectoryDto {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsInt()
  parentId?: number; // 父目录ID，顶级目录为null

  @IsOptional()
  @IsInt()
  sortOrder = 0;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
