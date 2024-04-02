import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  async getAllFavorites() {
    return this.favoritesService.getAllFavorites();
  }

  @Post('/track/:id')
  async addTrackToFavorites(@Param('id') id: string, @Res() res: Response) {
    await this.favoritesService.addToFavorites(id, 'tracks');

    res.status(HttpStatus.CREATED).send('Success');
  }

  @Delete('/track/:id')
  async deleteTrackFromFavorites(
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    await this.favoritesService.deleteFromFavorites(id, 'tracks', 'delete');

    res.status(HttpStatus.NO_CONTENT).send('Success');
  }

  @Post('/artist/:id')
  async addArtistToFavorites(@Param('id') id: string, @Res() res: Response) {
    await this.favoritesService.addToFavorites(id, 'artists');

    res.status(HttpStatus.CREATED).send('Success');
  }

  @Delete('/artist/:id')
  async deleteArtistFromFavorites(
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    await this.favoritesService.deleteFromFavorites(id, 'artists', 'delete');

    res.status(HttpStatus.NO_CONTENT).send('Success');
  }

  @Post('/album/:id')
  async addAlbumToFavorites(@Param('id') id: string, @Res() res: Response) {
    await this.favoritesService.addToFavorites(id, 'albums');

    res.status(HttpStatus.CREATED).send('Success');
  }

  @Delete('/album/:id')
  async deleteAlbumFromFavorites(
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    await this.favoritesService.deleteFromFavorites(id, 'albums', 'delete');

    res.status(HttpStatus.NO_CONTENT).send('Success');
  }
}
