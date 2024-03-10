import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataBaseService } from 'src/database/database.service';
import { Album } from './album.interface';
import { v4 as uuidv4 } from 'uuid';
import { CreateAlbumDto } from './dto/create-album.dto';
import { isValidUuid } from 'src/utils/isValidUuid';
import { ERROR_INVALID_ID } from 'src/constants';

@Injectable()
export class AlbumService {
  constructor(private database: DataBaseService) {}
  getAllAlbums(): Album[] {
    return Object.values(this.database.albums);
  }

  getAlbum(id: string): Album {
    if (!isValidUuid(id)) {
      throw new BadRequestException(ERROR_INVALID_ID);
    }

    const album = this.database.albums[id];

    if (!album) {
      throw new NotFoundException();
    }

    return album;
  }

  createAlbum(createAlbumDto: CreateAlbumDto): Album {
    const id = uuidv4();

    const newAlbum: Album = {
      id,
      ...createAlbumDto,
    };

    this.database.albums[id] = newAlbum;

    return newAlbum;
  }
}
