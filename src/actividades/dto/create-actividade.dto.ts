import { Type } from 'class-transformer';
import {
  IsString,
  IsJSON,
  IsNumber,
  Validate,
  IsNotEmpty,
  MinLength,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  IsInt,
  Min,
} from 'class-validator';
import { Users } from '../../auth/entities/users.entity';

export class CreateActividadeDto {
  @IsNumber()
  user: Users;

  @IsString({ message: 'Titulo no Valido' })
  @IsNotEmpty({ message: 'Titulo no Valido' })
  @MinLength(3, { message: 'Titulo Valido' })
  tituloActividad: string;

  @IsString({ message: 'Tipo Actividad no Valido' })
  @IsNotEmpty({ message: 'Tipo Actividad no Valido' })
  @MinLength(3, { message: 'Tipo Actividad no Valido' })
  categoriaActividad: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @Type(() => Number)
  @IsInt({ each: true })
  asignadosActividadId: number[];

  @IsString({ message: 'Nombre no Valido' })
  @IsNotEmpty({ message: 'Nombre no Valido' })
  @MinLength(3, { message: 'Nombre no Valido' })
  gestorActividad: string;

  @IsString({ message: 'estado no Valido' })
  estadoActividad: string;

  @IsString({ message: 'estado no Valido' })
  tipoActividad: string;

  @IsString({ message: 'Oficina no Valida' })
  oficinaOrigenActividad: string;

  @IsString({ message: 'Prioridad no Valida' })
  prioridadActividad: string;
}

export class CreateCommentActivityDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  activity: number;

  @IsNotEmpty()
  author: string;

  @IsString()
  actComentario: string;
}
