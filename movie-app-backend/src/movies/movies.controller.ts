import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { PaginationDto } from './dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

// Custom validator for image file extensions
class ImageFileExtensionValidator extends FileValidator {
  constructor() {
    super({});
  }

  isValid(file?: Express.Multer.File): boolean {
    if (!file) return true; // Optional file
    const allowedExtensions = ['.jpeg', '.jpg', '.png', '.gif'];
    const fileExtension = extname(file.originalname).toLowerCase();
    return allowedExtensions.includes(fileExtension);
  }

  buildErrorMessage(): string {
    return 'Only .jpeg, .jpg, .png, and .gif files are allowed';
  }
}

@ApiTags('movies')
@Controller('movies')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('poster', {
      storage: diskStorage({
        destination: './uploads/posters',
        filename: (req, file, cb) => {
          const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  @ApiOperation({ summary: 'Create a new movie' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          example: 'The Matrix',
        },
        publishingYear: {
          type: 'number',
          example: 1999,
        },
        poster: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Movie successfully created' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  create(
    @Body() createMovieDto: CreateMovieDto,
    @Request() req,
      @UploadedFile(
        new ParseFilePipe({
          validators: [
            new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
            new ImageFileExtensionValidator(),
          ],
          fileIsRequired: false,
        }),
      )
      file?: Express.Multer.File,
    ) {
      // Transform publishingYear from string to number (multipart/form-data sends strings)
      if (createMovieDto.publishingYear) {
        createMovieDto.publishingYear = Number(createMovieDto.publishingYear);
      }
    if (file) {
      createMovieDto.poster = `posters/${file.filename}`;
    }
    return this.moviesService.create(createMovieDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all movies with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Movies retrieved successfully' })
  findAll(@Request() req, @Query() paginationDto: PaginationDto) {
    return this.moviesService.findAll(req.user.id, paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a movie by ID' })
  @ApiResponse({ status: 200, description: 'Movie retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.moviesService.findOne(id, req.user.id);
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('poster', {
      storage: diskStorage({
        destination: './uploads/posters',
        filename: (req, file, cb) => {
          const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  @ApiOperation({ summary: 'Update a movie' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          example: 'The Matrix Reloaded',
        },
        publishingYear: {
          type: 'number',
          example: 2003,
        },
        poster: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Movie successfully updated' })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  update(
    @Param('id') id: string,
    @Body() updateMovieDto: UpdateMovieDto,
    @Request() req,
      @UploadedFile(
        new ParseFilePipe({
          validators: [
            new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
            new ImageFileExtensionValidator(),
          ],
          fileIsRequired: false,
        }),
      )
      file?: Express.Multer.File,
    ) {
      // Transform publishingYear from string to number (multipart/form-data sends strings)
      if (updateMovieDto.publishingYear !== undefined) {
        updateMovieDto.publishingYear = Number(updateMovieDto.publishingYear);
      }
    if (file) {
      updateMovieDto.poster = `posters/${file.filename}`;
    }
    return this.moviesService.update(id, updateMovieDto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a movie' })
  @ApiResponse({ status: 200, description: 'Movie successfully deleted' })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  remove(@Param('id') id: string, @Request() req) {
    return this.moviesService.remove(id, req.user.id);
  }
}

