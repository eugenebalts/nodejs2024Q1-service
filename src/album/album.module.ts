import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Album } from './models/album.entity';
import { Track } from 'src/track/models/track.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Album, Track])],
  providers: [AlbumService],
  controllers: [AlbumController],
})
export class AlbumModule {}
