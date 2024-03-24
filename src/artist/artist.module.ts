import { Module } from '@nestjs/common';
import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Artist } from './models/artist.entity';
import { Track } from 'src/track/models/track.entity';
import { Album } from 'src/album/models/album.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Artist, Track, Album])],
  providers: [ArtistService],
  controllers: [ArtistController],
})
export class ArtistModule {}
