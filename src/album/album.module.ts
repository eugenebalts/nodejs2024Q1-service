import { Module } from '@nestjs/common';
import { DataBaseModule } from 'src/database/database.module';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';

@Module({
  imports: [DataBaseModule],
  providers: [AlbumService],
  controllers: [AlbumController],
})
export class AlbumModule {}
