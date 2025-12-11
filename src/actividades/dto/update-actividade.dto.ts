import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNumber,
  IsString,
  //IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateActivityAssignees {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  activityId: number;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(5)
  @Type(() => Number)
  @IsInt({ each: true })
  actAssId: number[];

  @Type(() => Number)
  @IsNumber()
  userIds: string;
}
export class UpdateActivity {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  activityId: number;

  @IsString({ message: 'Estado no Valido' })
  estadoAct: string;

  @Type(() => Number)
  @IsNumber()
  avanceAct: string;

  @IsString({ message: 'Prioridad no Valida' })
  prioridadAct: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  idUser: string;
}
