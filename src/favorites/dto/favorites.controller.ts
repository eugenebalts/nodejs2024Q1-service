import { Controller, Get, HttpStatus, Param, Post, Res } from '@nestjs/common';
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
    this.favoritesService.addTrackToFavorites(id);

    res.status(HttpStatus.CREATED).send('Success');
  }
}
