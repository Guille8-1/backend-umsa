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
import { Users } from '../../users/entities/user.entity';

export class CreateProjectDto {
    @IsNumber()
    user: Users

    @IsString({message:'Titulo no Valido'})
    @IsNotEmpty({message:'Titulo no Valido'})
    @MinLength(3,{message: 'Titulo Valido'})
    titulo: string

    @IsArray()
    @ArrayMinSize(1)
    @ArrayMaxSize(10)
    @Type(() => Number)
    @IsInt({each: true})
    asignadosId: number[]

    @IsString({message:'Documento no Valido'})
    @IsNotEmpty({message:'Documento no Valido'})
    @MinLength(3,{message: 'Documento no Valido'})
    tipoDocumento: string

    @IsString({message:'Nombre no Valido'})
    @IsNotEmpty({message:'Nombre no Valido'})
    @MinLength(3,{message: 'Nombre no Valido'})
    gestor: string

    @IsString({message:'estado no Valido'})
    estado: string
    
    @IsString({message:'estado no Valido'})
    tipo: string
    
    @IsString()
    citeNumero: string
    
    @IsString()
    rutaCv: string

    @Type(()=> Number)
    @IsNumber()
    diasActivo: number

    @Type(()=> Number)
    @IsNumber()
    avance: number

    @IsString({message:'estado no Valido'})
    oficinaOrigen: string

    @IsString({message:'Prioridad no Valida'})
    prioridad: string

}
