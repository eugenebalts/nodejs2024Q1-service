import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Res,
  UsePipes,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { Response } from 'express';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  getAllFavorites() {
    return this.favoritesService.getAllFavorites();
  }

  @Post('/:object/:id')
  addToFavorites(
    @Param('id') id: string,
    @Param('object') object: 'artist' | 'album' | 'track',
    @Res() res: Response,
  ) {
    const allowedObjects = ['artist', 'album', 'track'];

    if (!allowedObjects.includes(object)) {
      throw new NotFoundException(`Cannot POST /${object}/${id}`);
    }

    this.favoritesService.addToFavorites(id, `${object}s`);

    res.status(HttpStatus.CREATED).send('Success');
  }

  @Delete('/:object/:id')
  deleteFromFavorites(
    @Param('id') id: string,
    @Param('object') object: 'artist' | 'album' | 'track',
    @Res() res: Response,
  ) {
    const allowedObjects = ['artist', 'album', 'track'];

    if (!allowedObjects.includes(object) && typeof id === 'string') {
      throw new NotFoundException(`Cannot POST /${object}/${id}`);
    }

    this.favoritesService.deleteFromFavorites(id, `${object}s`);

    res.status(HttpStatus.NO_CONTENT).send('Success');
  }
}
