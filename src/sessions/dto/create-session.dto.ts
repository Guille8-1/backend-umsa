import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsInt,
  Min,
} from 'class-validator';

export class CreateSessionDto {
  @IsString({message:'Nombre no Valido'})
  @IsNotEmpty({message:'Nombre no Valido'})
  @MinLength(3,{message: 'Nombre de Usuario No Valido'})
  userName: string

  @IsString({message:'Nombre no Valido'})
  @IsNotEmpty({message:'Nombre no Valido'})
  @MinLength(3,{message: 'Nombre de Usuario No Valido'})
  userLastName: string

  @Type(()=> Number)
  @IsInt()
  @Min(1)
  userId: number

  @IsEmail({}, {message:'Email Invalido'})
  email: string
}

export class VerifySessionDto {
  @IsEmail({}, {message: 'Email No Valido'})
  email: string
}
