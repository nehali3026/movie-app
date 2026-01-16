import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './entities/movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { PaginationDto } from './dto/pagination.dto';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
  ) {}

  async create(createMovieDto: CreateMovieDto, userId: string): Promise<Movie> {
    // Use query builder to insert directly, bypassing any relationship logic
    const result = await this.moviesRepository
      .createQueryBuilder()
      .insert()
      .into(Movie)
      .values({
        ...createMovieDto,
        userId,
      })
      .returning('*')
      .execute();
    
    // For PostgreSQL, the raw result contains the inserted row
    if (result.raw && result.raw.length > 0) {
      return result.raw[0] as Movie;
    }
    
    // Fallback: if returning doesn't work, fetch by generated ID
    const generatedId = result.identifiers[0]?.id;
    if (generatedId) {
      return this.moviesRepository.findOne({
        where: { id: generatedId },
      });
    }
    
    throw new Error('Failed to create movie');
  }

  async findAll(
    userId: string,
    paginationDto: PaginationDto,
  ): Promise<{ data: Movie[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [data, total] = await this.moviesRepository.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string, userId: string): Promise<Movie> {
    const movie = await this.moviesRepository.findOne({
      where: { id, userId },
    });

    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }

    return movie;
  }

  async update(
    id: string,
    updateMovieDto: UpdateMovieDto,
    userId: string,
  ): Promise<Movie> {
    const movie = await this.findOne(id, userId);

    Object.assign(movie, updateMovieDto);
    return this.moviesRepository.save(movie);
  }

  async remove(id: string, userId: string): Promise<void> {
    const movie = await this.findOne(id, userId);
    await this.moviesRepository.remove(movie);
  }
}



