import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProjectDto {
  @IsString({ message: 'Estado no Valido' })
  estado: string;

  @Type(() => Number)
  @IsNumber()
  avance: string;

  @IsString({ message: 'Documento no Valido' })
  documento: string;

  @IsString({ message: 'Prioridad no Valida' })
  prioridad: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  idUser: string;
}

export class UpdateAssigneesDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  projectId: number;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(5)
  @Type(() => Number)
  @IsInt({ each: true })
  asignadosId: number[];

  @Type(() => Number)
  @IsNumber()
  userId: string;
}
