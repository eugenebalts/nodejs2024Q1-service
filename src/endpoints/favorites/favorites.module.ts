import { Module } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorites } from './models/favorites.entity';
import { Artist } from '../artist/models/artist.entity';
import { Album } from '../album/models/album.entity';
import { Track } from '../track/models/track.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Favorites, Artist, Album, Track])],
  providers: [FavoritesService],
  controllers: [FavoritesController],
  exports: [FavoritesService],
})
export class FavoritesModule {}
