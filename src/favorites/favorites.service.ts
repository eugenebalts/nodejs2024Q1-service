import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { DataBaseService } from 'src/database/database.service';
import { FavoritesResponse } from './favorites.interface';
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
      const objectIds: string[] = this.database.favorites[fav];

      if (!objectIds.length) {
        continue;
      }

      if (fav in this.database) {
        objectIds.forEach((id) => {
          if (this.database[fav][id]) {
            response[fav].push(this.database[fav][id]);
          }
        });
      }
    }

    return response;
  }

  addToFavorites(id: string, objectToAdd: 'artists' | 'albums' | 'tracks') {
    if (!isValidUuid(id)) {
      throw new BadRequestException(ERROR_INVALID_ID);
    }

    const object = this.database[objectToAdd][id];

    if (!object) {
      throw new UnprocessableEntityException();
    }

    this.database.favorites[objectToAdd].push(id);
  }

  deleteFromFavorites(
    id: string,
    objectToDelete: 'artists' | 'albums' | 'tracks',
  ) {
    if (!isValidUuid(id)) {
      throw new BadRequestException(ERROR_INVALID_ID);
    }

    const object = this.database[objectToDelete][id];

    if (!object) {
      throw new UnprocessableEntityException();
    }

    const objectIndex = this.database.favorites[objectToDelete].findIndex(
      (val) => val === id,
    );

    if (objectIndex !== -1) {
      this.database.favorites[objectToDelete].splice(objectIndex, 1);
    }
  }
}
