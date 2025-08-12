import { IsInt } from 'class-validator';

export class RestoreVersionDto {
  @IsInt()
  versionId: number;
}
