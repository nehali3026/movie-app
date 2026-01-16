import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/swagger';
import { CreateMovieDto } from './create-movie.dto';
import { IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateMovieDto extends PartialType(CreateMovieDto) {
  @ApiProperty({
    example: 'The Matrix Reloaded',
    description: 'Movie title',
    required: false,
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    example: 2003,
    description: 'Year the movie was published',
    minimum: 1888,
    maximum: 2100,
    required: false,
  })
  @Type(() => Number)
  @IsNumber({}, { message: 'publishingYear must be a number' })
  @Min(1888, { message: 'Publishing year must be at least 1888' })
  @Max(2100, { message: 'Publishing year cannot exceed 2100' })
  @IsOptional()
  publishingYear?: number;

  @ApiProperty({
    example: 'poster-updated.jpg',
    description: 'Poster file name',
    required: false,
  })
  @IsString()
  @IsOptional()
  poster?: string;
}



