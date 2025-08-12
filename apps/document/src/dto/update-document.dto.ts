import { CreateDocumentDto } from './create-document.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateDocumentDto extends CreateDocumentDto {
  @IsOptional()
  @IsString()
  changeNote?: string; // 版本变更说明
}
