import { Type } from "class-transformer";
import { IsInt, Min } from "class-validator";

export class DeleteProjectDto {
    @Type( () => Number )
    @IsInt()
    @Min(1)
    paramId: number
}