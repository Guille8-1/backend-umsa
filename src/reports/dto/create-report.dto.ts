import { IsDateString, IsInt, Min } from "class-validator";
import { Type } from 'class-transformer';

export class DateRangeDto {
  @IsDateString()
  start: string;

  @IsDateString()
  end: string;

  @Type( () => Number )
  @IsInt()
  @Min(1)
  userId: number
}
