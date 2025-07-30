import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAdminDto {
  @IsString({ message: 'Nombre no Valido' })
  @IsNotEmpty({ message: 'Nombre no Valido' })
  @MinLength(3, { message: 'Nombre de Usuario No Valido' })
  nombre: string;

  @IsString({ message: 'Nombre no Valido' })
  @IsNotEmpty({ message: 'Nombre no Valido' })
  @MinLength(3, { message: 'Nombre de Usuario No Valido' })
  apellido: string;

  @IsEmail({}, { message: 'Email Invalido' })
  email: string;

  @IsString({ message: 'Password No Valido' })
  @IsNotEmpty({ message: 'Password Vacio' })
  @MinLength(5, { message: 'Password No Valido' })
  password: string;

  @IsString({ message: 'Password No Valido' })
  @IsNotEmpty({ message: 'Password Vacio' })
  @MinLength(5, { message: 'Password No Valido' })
  currPassword: string;

  @Type(() => Number)
  @IsInt()
  @Min(1, { message: 'Nivel de Usuario no Permitido' })
  @Max(4, { message: 'Nivel de Usuario no Permitido' })
  nivel: number;
}

export class UpdatePassword {
  @IsString({ message: 'Password no valido' })
  @IsNotEmpty({ message: 'Password Vacio' })
  @MinLength(8, { message: 'Password demasiado corto' })
  password: string;

  @Type(() => Number)
  @IsInt()
  id: number;
}
