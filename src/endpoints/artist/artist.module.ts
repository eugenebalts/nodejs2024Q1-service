import { Module } from '@nestjs/common';
import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Artist } from './models/artist.entity';
import { Track } from '../track/models/track.entity';
import { Album } from '../album/models/album.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Artist, Track, Album])],
  providers: [ArtistService],
  controllers: [ArtistController],
})
export class ArtistModule {}
