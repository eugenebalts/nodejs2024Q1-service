import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Res,
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

  @Post('/track/:id')
  addTrackToFavorites(@Param('id') id: string, @Res() res: Response) {
    this.favoritesService.addToFavorites(id, 'tracks');

    res.status(HttpStatus.CREATED).send('Success');
  }

  @Delete('/track/:id')
  deleteTrackFromFavorites(@Param('id') id: string, @Res() res: Response) {
    const allowedObjects = ['artist', 'album', 'track'];

    this.favoritesService.deleteFromFavorites(id, 'tracks');

    res.status(HttpStatus.NO_CONTENT).send('Success');
  }

  @Post('/artist/:id')
  addArtistToFavorites(@Param('id') id: string, @Res() res: Response) {
    this.favoritesService.addToFavorites(id, 'artists');

    res.status(HttpStatus.CREATED).send('Success');
  }

  @Delete('/artist/:id')
  deleteArtistFromFavorites(@Param('id') id: string, @Res() res: Response) {
    this.favoritesService.deleteFromFavorites(id, 'artists');

    res.status(HttpStatus.NO_CONTENT).send('Success');
  }

  @Post('/album/:id')
  addAlbumToFavorites(@Param('id') id: string, @Res() res: Response) {
    this.favoritesService.addToFavorites(id, 'albums');

    res.status(HttpStatus.CREATED).send('Success');
  }

  @Delete('/album/:id')
  deleteAlbumFromFavorites(@Param('id') id: string, @Res() res: Response) {
    this.favoritesService.deleteFromFavorites(id, 'albums');

    res.status(HttpStatus.NO_CONTENT).send('Success');
  }
}
