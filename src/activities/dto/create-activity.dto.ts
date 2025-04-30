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
} from 'class-validator';
import {Users} from '../../auth/entities/users.entity';

export class CreateActivityDto {
  @IsNumber()
  user: Users;

  @IsString({message:'Titulo no Valido'})
  @IsNotEmpty({message:'Titulo no Valido'})
  @MinLength(3,{message: 'Titulo Valido'})
  titulo: string

  @IsString({message:'Nombre no Valido'})
  @IsNotEmpty({message:'Nombre no Valido'})
  @MinLength(3,{message: 'Nombre no Valido'})
  asignadoPor: string

}
