import { Injectable } from '@nestjs/common';
import { DataBaseService } from 'src/database/database.service';
import { Album } from './album.interface';
import { v4 as uuidv4 } from 'uuid';
import { CreateAlbumDto } from './dto/create-album.dto';

@Injectable()
export class AlbumService {
  constructor(private database: DataBaseService) {}
  getAllAlbums(): Album[] {
    return Object.values(this.database.albums);
  }

  createAlbum(createAlbumDto: CreateAlbumDto) {
    const id = uuidv4();

    const newAlbum: Album = {
      id,
      ...createAlbumDto,
    };

    this.database.albums[id] = newAlbum;

    return newAlbum;
  }
}
