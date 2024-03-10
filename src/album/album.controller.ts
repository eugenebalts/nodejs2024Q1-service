import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
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

  @Get(':id')
  getAlbum(@Param('id') id: string, @Res() res: Response) {
    const album = this.albumService.getAlbum(id);

    res.status(HttpStatus.OK).send(album);
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
