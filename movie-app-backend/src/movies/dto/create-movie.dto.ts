import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  Max,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMovieDto {
  @ApiProperty({
    example: 'The Matrix',
    description: 'Movie title',
  })
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @ApiProperty({
    example: 1999,
    description: 'Year the movie was published',
    minimum: 1888,
    maximum: 2100,
  })
  @Type(() => Number)
  @IsNumber({}, { message: 'publishingYear must be a number' })
  @Min(1888, { message: 'Publishing year must be at least 1888' })
  @Max(2100, { message: 'Publishing year cannot exceed 2100' })
  publishingYear: number;

  @ApiProperty({
    example: 'poster.jpg',
    description: 'Poster file name',
    required: false,
  })
  @IsString()
  @IsOptional()
  poster?: string;
}



