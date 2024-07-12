import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Album } from './models/album.entity';
import { Track } from '../track/models/track.entity';
import { FavoritesModule } from '../favorites/favorites.module';

@Module({
  imports: [TypeOrmModule.forFeature([Album, Track]), FavoritesModule],
  providers: [AlbumService],
  controllers: [AlbumController],
})
export class AlbumModule {}
