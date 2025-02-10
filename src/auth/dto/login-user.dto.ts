import { Type } from 'class-transformer'
import { IsEmail, IsInt, IsNotEmpty, IsString, Min, MinLength } from 'class-validator'

export class CreateUserDto {
    @IsString({message:'Nombre no Valido'})
    @IsNotEmpty({message:'Nombre no Valido'})
    @MinLength(3,{message: 'Nombre de Usuario No Valido'})
    name: string

    @IsEmail({}, {message:'Email Invalido'})
    email: string
    @IsString({message:'Password No Valido'})
    @IsNotEmpty({message:'Password Vacio'})
    @MinLength(5,{message: 'Password No Valido'})
    password: string

    @IsString({message:'Valor Admin No Definido'})
    admin: string
}

export class LoginUserDto {
    @IsEmail({}, {message:'Email Invalido'})
    email: string
    
    @IsString({message:'Password No Valido'})
    @IsNotEmpty({message:'Password Vacio'})
    password: string
}

export class VerifyUserDto {
    @IsString({message:'Token no Valido'})
    name:string

    @IsString({message:'Token no Valido'})
    token:string
}
export class DeleteUserDto {
    @Type( () => Number )
    @IsInt()
    @Min(1)
    userId: number
}

export class GetUserDto {
    @Type( () => Number )
    @IsInt()
    @Min(1)
    userId: number
}