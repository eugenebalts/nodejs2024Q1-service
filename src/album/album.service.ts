import { Injectable } from '@nestjs/common';
import { DataBaseService } from 'src/database/database.service';
import { Album } from './album.interface';

@Injectable()
export class AlbumService {
  constructor(private database: DataBaseService) {}
  getAllAlbums(): Album[] {
    return Object.values(this.database.albums);
  }
}
