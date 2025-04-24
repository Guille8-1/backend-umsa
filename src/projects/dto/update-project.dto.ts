import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './create-project.dto';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsInt, IsJSON, IsNotEmpty, IsNumber, IsOptional, IsString, Min, MinLength, Validate, ValidationArguments, ValidatorConstraintInterface } from 'class-validator';
import { Type } from 'class-transformer';

class ArrayOfUsers implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments) {
        try {
            const parsedValue = JSON.parse(value)
            return Array.isArray(parsedValue) && parsedValue.every(item => typeof item === 'string');
        } catch (error) {
            return false
        }

    }
    defaultMessage(args: ValidationArguments) {
        return `${args.property} JSON no valido`
    }
}

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
    @IsString({message:'Titulo no Valido'})
    @IsNotEmpty({message:'Titulo no Valido'})
    @MinLength(3,{message: 'Titulo Valido'})
    titulo: string

    @IsString({message:'Status no Valido'})
    status: string

    @IsString({message:'Etiquetas no Valido'})
    etiquetas: string

    @IsArray()
    @ArrayMinSize(1)
    @ArrayMaxSize(10)
    @IsNumber()
    asignados: string[]

    @IsString({message:'Prioridad no Valida'})
    prioridad: string

    @Type( () => Number )
    @IsInt({message:'parametro no valido'})
    @Min(1)
    paramId: number
}
