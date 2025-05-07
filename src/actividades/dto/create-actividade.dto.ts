import { Type } from 'class-transformer'
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
} from 'class-validator';
import { Users } from '../../auth/entities/users.entity'


export class CreateActividadeDto {
  @IsNumber()
  id: Users;

  @IsString({message:'Titulo no Valido'})
  @IsNotEmpty({message:'Titulo no Valido'})
  @MinLength(3,{message: 'Titulo Valido'})
  tituloActividad: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @Type(() => Number)
  @IsInt({each: true})
  asignadosActividadId: number[]

  @IsString({message:'Nombre no Valido'})
  @IsNotEmpty({message:'Nombre no Valido'})
  @MinLength(3,{message: 'Nombre no Valido'})
  gestorActividad: string

  @IsString({message:'estado no Valido'})
  estadoActividad: string

  @IsString({message:'estado no Valido'})
  tipoActividad: string

  @IsString({message:'Oficina no Valida'})
  oficinaOrigenActividad: string

  @IsString({message:'Prioridad no Valida'})
  prioridadActividad: string

  @Type(()=> Number)
  @IsNumber()
  diasActivoActividad: number

  @Type(()=> Number)
  @IsNumber()
  avanceActividad: number
}
