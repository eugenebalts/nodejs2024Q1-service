import { Module } from '@nestjs/common';
import { TrackController } from './track.controller';
import { TrackService } from './track.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Track } from './models/track.entity';
import { FavoritesModule } from 'src/favorites/favorites.module';

@Module({
  imports: [TypeOrmModule.forFeature([Track]), FavoritesModule],
  controllers: [TrackController],
  providers: [TrackService],
})
export class TrackModule {}
