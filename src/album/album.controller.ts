import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
  UsePipes,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateAlbumDto, createAlbumSchema } from './dto/create-album.dto';
import { ZodValidationPipe } from 'src/utils/zodValidationPipe';
import { Response } from 'express';
import { UpdateAlbumDto, updateAlbumSchema } from './dto/update-album.dto';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Get()
  getAllAlbums() {
    return this.albumService.getAllAlbums();
  }

  @Get(':id')
  async getAlbum(@Param('id') id: string, @Res() res: Response) {
    const album = await this.albumService.getAlbum(id);

    res.status(HttpStatus.OK).send(album);
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createAlbumSchema))
  async createAlbum(
    @Body()
    createAlbumDto: CreateAlbumDto,
    @Res() res: Response,
  ) {
    const newAlbum = await this.albumService.createAlbum(createAlbumDto);

    res.status(HttpStatus.CREATED).send(newAlbum);
  }

  @Put(':id')
  async updateAlbum(
    @Body(new ZodValidationPipe(updateAlbumSchema))
    updateAlbumDto: UpdateAlbumDto,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const updatedAlbum = await this.albumService.updateAlbum(
      id,
      updateAlbumDto,
    );

    res.status(HttpStatus.OK).send(updatedAlbum);
  }

  @Delete(':id')
  async deleteAlbum(@Param('id') id: string, @Res() res: Response) {
    await this.albumService.deleteAlbum(id);

    res.status(HttpStatus.NO_CONTENT).send(true);
  }
}
