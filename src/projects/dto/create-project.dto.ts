import { Type } from 'class-transformer';
import { IsString, IsJSON, IsNumber, Validate, IsNotEmpty, MinLength } from 'class-validator';
import { ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { Users } from 'src/auth/entities/users.entity';

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

export class CreateProjectDto {
    @IsNumber()
    user: Users

    @IsString({message:'Titulo no Valido'})
    @IsNotEmpty({message:'Titulo no Valido'})
    @MinLength(3,{message: 'Titulo Valido'})
    titulo: string

    @IsJSON({message:'Asignados no Validos'})
    @Validate(ArrayOfUsers)
    asignados: string

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
    
    @Type(()=> Number)
    @IsNumber()
    citeNumero: number
    
    @Type(()=> Number)
    @IsNumber()
    rutaVc: number

    @IsString({message:'estado no Valido'})
    oficinaOrigen: string

    @IsString({message:'Prioridad no Valida'})
    prioridad: string

}
