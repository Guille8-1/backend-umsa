import { Type } from 'class-transformer'
import { IsString, IsNotEmpty, MinLength, Min, IsInt, IsEmail } from 'class-validator';


export class CommentProjectDto {
    @Type( () => Number )
    @IsInt()
    @Min(1)
    projectId: number

    @IsEmail()
    @IsNotEmpty()
    author: string

    @IsString()
    comentarios: string
}