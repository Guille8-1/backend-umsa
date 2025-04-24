import { Type } from 'class-transformer'
import { IsString, IsNotEmpty, MinLength, Min, IsInt, IsEmail } from 'class-validator';

export class CommentProjectDto {
    @Type( () => Number )
    @IsInt()
    @Min(1)
    projectId: number

    @IsNotEmpty()
    author: string

    @IsString()
    comentario: string
}