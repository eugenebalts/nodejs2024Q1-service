import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateAlbumDto, createAlbumSchema } from './dto/create-album.dto';
import { ZodValidationPipe } from 'src/utils/zodValidationPipe';
import { Response } from 'express';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Get()
  getAllAlbums() {
    return this.albumService.getAllAlbums();
  }

  @Post()
  createAlbum(
    @Body(new ZodValidationPipe(createAlbumSchema))
    createAlbumDto: CreateAlbumDto,
    @Res() res: Response,
  ) {
    const newAlbum = this.albumService.createAlbum(createAlbumDto);

    res.status(HttpStatus.CREATED).send(newAlbum);
  }
}
