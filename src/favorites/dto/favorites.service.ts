import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { DataBaseService } from 'src/database/database.service';
import { FavoritesResponse } from '../favorites.interface';
import { isValidUuid } from 'src/utils/isValidUuid';
import { ERROR_INVALID_ID } from 'src/constants';

@Injectable()
export class FavoritesService {
  constructor(private database: DataBaseService) {}

  getAllFavorites(): FavoritesResponse {
    const response: FavoritesResponse = {
      artists: [],
      albums: [],
      tracks: [],
    };

    for (const fav in this.database.favorites) {
      if (!this.database.favorites[fav].length) {
        continue;
      }

      const objectIds: string[] = this.database.favorites[fav];

      if (this.database[fav]) {
        objectIds.forEach((id) => response[fav].push(this.database[fav][id]));
      }
    }

    return response;
  }

  addTrackToFavorites(id: string) {
    if (!isValidUuid(id)) {
      throw new BadRequestException(ERROR_INVALID_ID);
    }

    const track = this.database.tracks[id];

    if (!track) {
      throw new UnprocessableEntityException();
    }

    this.database.favorites.tracks.push(id);
  }
}
