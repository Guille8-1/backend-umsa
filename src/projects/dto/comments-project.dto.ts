import { Type } from 'class-transformer'
import { IsString, IsNotEmpty, MinLength, Min, IsInt } from 'class-validator'


export class CommentProjectDto {
    @IsString()
    comentarios: string

    @Type( () => Number )
    @IsInt()
    @Min(1)
    projectId: number
}