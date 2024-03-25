import { Module } from '@nestjs/common';
import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';
import { DataBaseModule } from 'src/database/database.module';

@Module({
  imports: [DataBaseModule],
  providers: [ArtistService],
  controllers: [ArtistController],
})
export class ArtistModule {}
