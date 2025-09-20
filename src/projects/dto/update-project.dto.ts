import { CreateProjectDto } from './create-project.dto';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsInt, IsNumber, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';


export class UpdateProjectDto {

    @IsString({message:'Estado no Valido'})
    estado: string
    
    @Type(()=>Number)
    @IsNumber()
    avance: string

    @IsString({message:'Documento no Valido'})
    documento: string

    @IsString({message:'Prioridad no Valida'})
    prioridad: string
}
