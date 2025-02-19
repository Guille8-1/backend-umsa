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

    @IsString({message:'facultad no Valida'})
    facultad: string

    @IsString({message:'estado no Valido'})
    estado: string

    @IsString({message:'Etiquetas no Valido'})
    etiquetas: string

    @IsJSON({message:'Asignados no Validos'})
    @Validate(ArrayOfUsers)
    asignado: string

    @IsString({message:'Prioridad no Valida'})
    prioridad: string

    @IsString({message:'Tipo no Valido'})
    tipo: string
}
