import { Module } from '@nestjs/common';
import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Artist } from './models/artist.entity';
import { Track } from 'src/track/models/track.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Artist, Track])],
  providers: [ArtistService],
  controllers: [ArtistController],
})
export class ArtistModule {}
